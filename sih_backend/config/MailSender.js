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
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Faizan Student", email: process.env.MAIL_FROM },
        to: [{ email }],
        subject: title,
        htmlContent: body,
      }),
      signal: AbortSignal.timeout(15000), // fail after 15s instead of hanging
    });

    if (!res.ok) {
      throw new Error(`Brevo ${res.status}: ${await res.text()}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Mail error:", error.message);
    throw error;
  }
};

module.exports = mailSender;