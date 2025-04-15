import { db } from "../../lib/firebaseAdmin";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) {
    console.log("❌ No email provided in request");
    return res.status(400).json({ message: "Email is required" });
  }

  const token = uuidv4();
  const resetUrl = `https://wellnesspurelife.com/reset-password/${token}`;
  console.log("📧 Generating reset link for:", email);

  try {
    console.log("📝 Saving token to Firestore...");
    await db.collection("resetTokens").doc(token).set({
      email,
      expiresAt: Date.now() + 3600000,
    });

    console.log("📨 Setting up mail transporter...");
    const transporter = nodemailer.createTransport({
      host: "mail.robotscapital.com",
      port: 465,
      secure: true,
      auth: {
        user: "info@wellnesspurelife.com",
        pass: "mK3CmVABnzWmWk", // ✅ Make sure this is valid
      },
    });

    console.log("🚀 Sending reset email to:", email);
    await transporter.sendMail({
      from: '"Wellness Pure Life" <info@wellnesspurelife.com>',
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Hello 👋</h2>
        <p>Click the link to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    console.log("✅ Email sent successfully!");
    return res.status(200).json({ message: "Reset email sent! Check your inbox." });

  } catch (error) {
    console.error("❌ Error occurred in reset flow:", error);
    return res
      .status(500)
      .json({ message: "Could not send reset email. Please check the address and try again." });
  }
}
