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
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://wellnesspurelife.com";

  const resetUrl = `${baseUrl}/reset-password/${token}`;

  console.log("📧 Generating reset link for:", email);

  try {
    // Save token to Firestore
    console.log("📝 Saving token to Firestore...");
    await db
      .collection("resetTokens")
      .doc(token)
      .set({
        email,
        expiresAt: Date.now() + 3600000, // 1 hour
      });

    // Setup mailer
    console.log("📨 Setting up mail transporter...");
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    console.log("🚀 Sending reset email to:", email);
    await transporter.sendMail({
      from: `"Wellness Pure Life" <${process.env.EMAIL_USER}>`,
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
    return res
      .status(200)
      .json({ message: "Reset email sent! Check your inbox." });
  } catch (error) {
    console.error(
      "❌ Error occurred in reset flow:",
      error.message,
      error.stack
    );
    return res.status(500).json({
      message:
        "Could not send reset email. Please check the address and try again.",
      error: error.message,
    });
  }
}
