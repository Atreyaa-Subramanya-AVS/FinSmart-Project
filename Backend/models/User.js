const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true }, // only for Google login
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // only for traditional login
  profilePicture: { type: String }, // From Google
  otp: {type: String},
  otpExpires: {type: Date},
});

module.exports = mongoose.model("User", UserSchema);
