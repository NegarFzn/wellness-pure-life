import nodemailer from "nodemailer";
import { emailTemplate } from "../../email-server/emailTemplate";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../lib/firebaseAdmin"; // ✅ Admin SDK Firestore

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, uid } = req.body;
  if (!email || !uid) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    // 1. Create token and store in Firestore using Admin SDK
    const token = uuidv4();
    await db.collection("emailTokens").doc(token).set({
      uid,
      createdAt: Date.now(),
    });

    // 2. Custom verification email content
    const subject = "Verify your email for Wellness Pure Life ✨";
    const body = `
      <p>You're almost there!</p>
      <p>Please verify your email to unlock personalized health insights and full access to your Wellness Pure Life experience.</p>
    `;
    const verificationLink = `http://localhost:3000/verify-email?token=${token}`; // replace in prod
    const html = emailTemplate(
      email.split("@")[0],
      `${body}<p><a href="${verificationLink}" style="color:#4F46E5;">👉 Click here to verify your email</a></p>`
    );

    // 3. Nodemailer configuration
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 4. Send the email
    await transporter.sendMail({
      from: '"Wellness Pure Life" <info@wellnesspurelife.com>',
      to: email,
      subject,
      html,
    });

    return res.status(200).json({ message: "📬 Verification email sent!" });
  } catch (error) {
    console.error("❌ EMAIL ERROR", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      message: "Failed to send email",
      error: error.message,
    });
  }
}
