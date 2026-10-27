
const { Resend } = require("resend");
require("dotenv").config();

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is missing");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
  try {
    const { data, error } = await resend.emails.send({
      from:
        process.env.MAIL_FROM ||
        "Faizan Student <it2023123@rcciit.org.in>",
      to: [email],
      subject: title,
      html: body,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(error.message);
    }

    console.log("Email accepted by Resend:", data.id);
    return data;
  } catch (error) {
    console.error("MAIL ERROR:", error.message);
    throw error;
  }
};

module.exports = mailSender;
