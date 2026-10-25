const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false, 
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const mailSender = async (email, title, body) => {
  try {
    const info = await transporter.sendMail({
      from: `"Faizan Student" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });
    return info;
  } catch (error) {
    console.error("Mail error:", error.message);
    throw error;
  }
};

module.exports = mailSender;