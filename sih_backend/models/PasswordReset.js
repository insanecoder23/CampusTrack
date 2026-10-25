const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  otpHash: String,
  expiresAt: Date,
  attempts: { type: Number, default: 0 },
  resetToken: String,
  tokenExpiry: Date,
});

module.exports = mongoose.model("PasswordReset", schema);