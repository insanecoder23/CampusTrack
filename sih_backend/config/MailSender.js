const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.MAIL_FROM || "Faizan Student <onboarding@resend.dev>",
      to: email,
      subject: title,
      html: body,
    });

    if (error) throw new Error(error.message);

    console.log("Email sent:", data.id);
    return data;
  } catch (error) {
    console.error("MAIL ERROR:", error.message);
    throw error;
  }
};

module.exports = mailSender;