const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("User", UserSchema);
