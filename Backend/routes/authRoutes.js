const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // adjust path if needed

// --- GOOGLE AUTH ROUTES ---
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    const { username, email, profilePicture } = req.user;

    console.log("Logged in user:", { username, email, profilePicture });

    // Redirect with a flag to refresh dashboard data
    res.redirect("http://localhost:3000/dashboard?refresh=true");
  }
);

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
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    req.session.user = {
      username: user.username,
      email: user.email,
      profilePicture: null,
    };

    return res.status(200).json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// --- FETCH USER DATA (for both Google and local) ---
router.get("/user", (req, res) => {
  if (req.session?.user) {
    return res.status(200).json(req.session.user);
  }

  console.log()

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

    // Clear session
    req.session.destroy(() => {
      res.redirect("http://localhost:3000");
    });
  });
});

module.exports = router;