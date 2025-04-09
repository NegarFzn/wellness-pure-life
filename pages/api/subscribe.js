import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { generateEmailContent } from "../../email-server/contentGenerator";
import { emailTemplate } from "../../email-server/emailTemplate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, name } = req.body;

  // ✅ Validate user input
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValidEmail || !name?.trim()) {
    return res.status(422).json({ message: "Please provide valid name, email, and interest." });
  }

  try {
    // ✅ Prepare file path
    const filePath = path.join(process.cwd(), "data", "subscribe.json");

    let existing = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      existing = fileData ? JSON.parse(fileData) : [];
    }

    // ✅ Check for duplicate email
    if (existing.some((entry) => entry.email === email)) {
      await sendWelcomeEmail(name, email);
      return res.status(409).json({ message: "Email already subscribed." });
    }

    // ✅ Push new subscriber
    const newEntry = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subscribedAt: new Date().toISOString(),
    };

    existing.push(newEntry);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

    // ✅ Send Welcome Email
    const transporter = nodemailer.createTransport({
      host: "mail.robotscapital.com",
      port: 465,
      secure: true,
      auth: {
        user: "info@wellnesspurelife.com",
        pass: "mK3CmVABnzWmWk",
      },
    });

    const { subject, body } = generateEmailContent();
    const mailOptions = {
      from: '"Wellness Pure Life" <info@wellnesspurelife.com>',
      to: newEntry.email,
      subject: "Welcome to Wellness Pure Life! 🌿",
      html: emailTemplate(newEntry.name, body),
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({ message: "Subscription successful" });
  } catch (err) {
    console.error("🔥 Error during subscribe or email:", err);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
}
