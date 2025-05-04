const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback", // Match this with Google Developer Console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || "";
        const profilePicture = profile.photos?.[0]?.value || "";

        // Check if the user already exists based on Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Create a new user if not found
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email,
            profilePicture,
          });
        } else {
          // Update user data if missing fields
          if (!user.email || !user.profilePicture) {
            user.email = email;
            user.profilePicture = profilePicture;
            await user.save();
          }
        }

        // Return the user object in the session
        done(null, user);
      } catch (err) {
        done(err, null); // Handle errors during the authentication process
      }
    }
  )
);

// Serialize the user into the session
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize the user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});