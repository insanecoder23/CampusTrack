const { randomInt, randomBytes } = require("crypto"); // randomBytes was missing before
const bcrypt = require("bcrypt"); // use "bcryptjs" if that is what your project installs
const User = require("../models/User");
const PasswordReset = require("../models/PasswordReset");
const mailSender = require("../config/MailSender");

// Same normalisation in all three functions so the PasswordReset record
// is always found with the same key.
const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

exports.forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({ email });

    if (user) {
      const otp = randomInt(100000, 1000000).toString();

      await PasswordReset.findOneAndUpdate(
        { email },
        {
          otpHash: await bcrypt.hash(otp, 10),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
          attempts: 0,
          resetToken: null,
          tokenExpiry: null,
        },
        { upsert: true }
      );

      // Not awaited on purpose: the response is the same whether or not the email exists
      mailSender(
        email,
        "Your password reset OTP",
        `<p>Your OTP is <b style="font-size:20px">${otp}</b>. It expires in 10 minutes.</p>`
      )
        .then(() => console.log("OTP mail sent to", email))
        .catch((err) => console.error("OTP mail failed:", err.message));
    } else {
      console.log("Forgot-password requested for unknown email:", email);
    }

    return res.json({ message: "If this email is registered, an OTP has been sent." });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err.message);
    return res.status(500).json({ error: "Could not send OTP. Try again later." });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP required" });
    }

    const record = await PasswordReset.findOne({ email });

    // "used" means the OTP was already exchanged for a reset token
    if (!record || !record.otpHash || record.otpHash === "used" || record.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired or invalid" });
    }

    if (record.attempts >= 5) {
      return res.status(429).json({ error: "Too many attempts. Request a new OTP." });
    }

    const valid = await bcrypt.compare(String(otp), record.otpHash);
    if (!valid) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ error: "Incorrect OTP" });
    }

    const resetToken = randomBytes(32).toString("hex");
    record.resetToken = await bcrypt.hash(resetToken, 10);
    record.tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    record.otpHash = "used";
    await record.save();

    return res.json({ resetToken });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { resetToken, newPassword } = req.body;

    if (!email || !resetToken) {
      return res.status(400).json({ error: "Email and token required" });
    }
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const record = await PasswordReset.findOne({ email });
    if (!record?.resetToken || !record.tokenExpiry || record.tokenExpiry < new Date()) {
      return res.status(400).json({ error: "Session expired. Start again." });
    }

    const ok = await bcrypt.compare(String(resetToken), record.resetToken);
    if (!ok) return res.status(400).json({ error: "Invalid token" });

    await User.updateOne({ email }, { password: await bcrypt.hash(newPassword, 10) });
    await PasswordReset.deleteOne({ email });

    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};