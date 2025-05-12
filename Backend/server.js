require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key=${GEMINI_API_KEY}`;

// Middleware
app.use(cors({ origin: "https://fin-smart-project.vercel.app/", credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

// User schema and model
const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  username: { type: String, required: true, unique: true },
});
const User = mongoose.model("User", UserSchema);

// Google OAuth setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google Profile:", profile); // Debug the profile data

        const email = profile._json.email;
        const profilePicture = profile._json.picture; // Correctly get the picture from _json

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: email,
            profilePicture: profilePicture // Store the profile picture correctly
          });
        } else {
          // If the user exists, you can update the profile picture if it hasn't been set
          user.profilePicture = user.profilePicture || profilePicture;
          user.email = email; // update the email if necessary
        }

        done(null, user);
      } catch (err) {
        console.error("Google Strategy Error:", err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});


passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Google Auth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://fin-smart-project.vercel.app/login",
  }),
  (req, res) => {
    const { username, email, profilePicture } = req.user; // Extract from the user object
    console.log("Redirecting with:", { username, email, profilePicture }); // Debugging line
    res.redirect(
      `${process.env.FRONTEND_URL}/dashboard?username=${encodeURIComponent(
        username
      )}&email=${encodeURIComponent(email)}&picture=${encodeURIComponent(
        profilePicture
      )}`
    );
  }
);

app.get("/auth/user", (req, res) => res.json(req.user || null));
app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.redirect(process.env.FRONTEND_URL);
  });
});

// Gemini Chat Endpoint
app.post("/api/chat", async (req, res) => {
  const { history } = req.body;
  if (!history || !Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: "History is required" });
  }

  try {
    const response = await axios.post(
      GEMINI_ENDPOINT,
      {
        contents: history,
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
          stopSequences: [],
        },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    res.json({ reply });
  } catch (err) {
    console.error("Gemini API error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate reply" });
  }
});

// Gemini Financial Recommendation Endpoint
app.post("/api/recommend", async (req, res) => {
  const { Data } = req.body;
  if (!Data) {
    return res.status(400).json({ error: "No financial data provided" });
  }

  const prompt = `
  Analyze the following financial details and provide detailed recommendations tailored to the user's financial goals.

  Include:
  - Monthly budgeting suggestions
  - Investment planning
  - Savings goals
  - Debt reduction strategies (if applicable)
  - Suggestions for long-term financial stability

  User Financial Data:
  ${JSON.stringify(Data, null, 2)}
  `;

  try {
    const response = await axios.post(
      GEMINI_ENDPOINT,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const generatedText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    res.json({ response: generatedText });
  } catch (error) {
    console.error(
      "Gemini Recommendation Error:",
      error?.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "Failed to fetch financial recommendation." });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("FinSmart API + Gemini is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
