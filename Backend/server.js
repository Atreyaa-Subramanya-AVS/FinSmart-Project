require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET || "mysecret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// MONGOOSE CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error(`MongoDB Connection Error: ${err.message}`));

// USER MODEL
const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  username: { type: String, required: true, unique: true },
});
const User = mongoose.model("User", UserSchema);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// PASSPORT SERIALIZE/DESERIALIZE
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    const username = req.user?.username;
    res.redirect(`http://localhost:3000/dashboard?username=${encodeURIComponent(username)}`);
  }
);

app.get("/auth/user", (req, res) => {
  res.json(req.user || null);
});
app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.redirect("http://localhost:3000");
  });
});

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key=${process.env.GEMINI_API_KEY}`;

app.post("/api/chat", async (req, res) => {
  const { history } = req.body;

  if (!history || !Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: "History is required" });
  }

  try {
    const payload = {
      contents: history,
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
        stopSequences: [],
      },
    };

    const response = await axios.post(GEMINI_ENDPOINT, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ reply });
  } catch (err) {
    console.error("Gemini API error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate reply" });
  }
});


app.post("/api/recommend", async (req, res) => {
  const { Data } = req.body;

  console.log("Received Data:", Data);

  // Format a prompt tailored to financial analysis
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
    const geminiRes = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const geminiData = await geminiRes.json();

    const generatedText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Could not generate financial advice.";

    res.json({ response: generatedText });
  } catch (error) {
    console.error("Error calling Gemini:", error);
    res.status(500).json({ error: "Failed to fetch financial recommendation." });
  }
});


app.get("/", (req, res) => {
  res.send("FinSmart API + Gemini is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
