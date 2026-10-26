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
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

const mailSender = async (email, title, body) => {
  try {
    const info = await transporter.sendMail({
      from: `"Faizan Student" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("SMTP error:", error.message);
    throw error;
  }
};

module.exports = mailSender;