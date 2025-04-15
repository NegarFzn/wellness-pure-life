import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate"; // adjust path if needed
import { generateEmailContent } from "./generateEmailContent.js";

export async function sendWelcomeEmail(name, email) {
  const transporter = nodemailer.createTransport({
    host: "mail.robotscapital.com",
    port: 465,
    secure: true,
    auth: {
      user: "info@wellnesspurelife.com",
      pass: "mK3CmVABnzWmWk",
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
