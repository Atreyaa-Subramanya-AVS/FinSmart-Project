require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const recommendRoutes = require("./routes/recommendRoutes");
const detailsRoutes = require("./routes/detailsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://fin-smart-project.vercel.app",
    credentials: true,
  })
);

// Middleware to parse JSON requests
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.JWT_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI) // Use Mongo URI from environment
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

// Routes
app.use("/auth", authRoutes); // Authentication routes
app.use("/api", chatRoutes); // Chat-related routes
app.use("/api", recommendRoutes); // Recommendation-related routes
app.use("/api/details", detailsRoutes); // Detils-related routes

// Local authentication routes
const localAuthRoutes = require("./routes/localAuth");
app.use("/auth/local", localAuthRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("FinSmart API + Gemini is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
