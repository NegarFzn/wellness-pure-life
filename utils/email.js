import nodemailer from "nodemailer";
import { emailTemplate } from "../email-server/emailTemplate.js"; // adjust path if needed
import { generateEmailContent } from "../email-server/contentGenerator.js";

export async function sendWelcomeEmail(name, email) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { subject, body } = generateEmailContent(); // ✅ Use this content
  const html = emailTemplate(name, body); // ✅ Use dynamic HTML body

  return transporter.sendMail({
    from: '"Wellness Pure Life" <info@wellnesspurelife.com>',
    to: email,
    subject, // ✅ Dynamic subject like "This Week’s Wellness: Fuel, Focus & Fitness 💚"
    html,
  });
}


