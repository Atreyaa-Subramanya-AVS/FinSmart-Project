const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // adjust path if needed
const sendOTP = require("../utils/sendOTP");

// --- GOOGLE AUTH ROUTES ---
// Google login route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback route after authentication
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  async (req, res) => {
    const { username, email, profilePicture } = req.user;

    console.log("Logged in user:", { username, email, profilePicture });

    // Generate raw OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save hashed OTP and expiry in DB
    req.user.otp = hashedOtp;
    req.user.otpExpires = Date.now() + 2 * 60 * 1000; // 2 minutes from now
    await req.user.save();

    // Send actual OTP to email
    await sendOTP(email, otp);

    // Set session after saving user data
    req.session.tempUser = {
      id: req.user._id,
      email,
    };

    // Force session save (ensure it’s written before redirecting)
    req.session.save((err) => {
      if (err) {
        console.log("Session save error:", err);
        return res.redirect("http://localhost:3000/login");
      }

      // Redirect to OTP input page on frontend
      res.redirect("http://localhost:3000/signin?showOTP=true");
    });
  }
);

// --- OTP VERIFICATION --- 
router.post("/otp/verify", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpires) {
      return res.status(400).json({ message: "OTP verification failed" });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(410).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // Clear OTP from user record
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Promote tempUser to full user in session
    req.session.user = {
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || null,
    };
    delete req.session.tempUser;

    return res.status(200).json({
      message: "OTP verified",
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("OTP verify error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// --- RESEND OTP --- 
router.post("/otp/resend", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !user.otp) {
      return res.status(400).json({ message: "OTP not found" });
    }

    // Check if OTP has expired
    if (Date.now() > user.otpExpires) {
      // Generate new OTP if expired
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(otp, 10);

      // Save new OTP and expiry in DB
      user.otp = hashedOtp;
      user.otpExpires = Date.now() + 2 * 60 * 1000; // 2 minutes from now
      await user.save();

      // Send new OTP to email
      await sendOTP(user.email, otp);

      return res.status(200).json({ message: "OTP resent successfully" });
    }

    return res.status(200).json({ message: "OTP is still valid" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});


// --- LOCAL REGISTER / LOGIN --- 
router.post("/", async (req, res) => {
  const { name, email, password, option } = req.body;

  try {
    if (option === "Register") {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username: name,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      req.session.user = {
        username: newUser.username,
        email: newUser.email,
        profilePicture: null,
      };

      return res.status(201).json({
        username: newUser.username,
        email: newUser.email,
      });
    }

    // LOGIN FLOW
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    req.session.user = {
      username: user.username,
      email: user.email,
      profilePicture: null,
    };

    // console.log(req.session.user);

    return res.status(200).json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// --- FETCH USER DATA --- 
router.get("/user", (req, res) => {
  if (req.session?.user) {
    return res.status(200).json(req.session.user);
  }

  console.log("Hello:",req.user);

  if (req.user) {
    return res.status(200).json({
      username: req.user.username,
      email: req.user.email,
      profilePicture: req.user.profilePicture || "",
    });
  }

  return res.status(401).json({ message: "User not authenticated" });
});

// --- LOGOUT ROUTE --- 
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });

    req.session.destroy(() => {
      res.redirect("http://localhost:3000");
    });
  });
});

module.exports = router;