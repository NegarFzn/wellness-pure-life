import { connectToDatabase } from "../../../utils/mongodb";
import { sendEmail } from "../../../utils/email";
import { createVerificationEmail, createWelcomeEmail } from "../../../emails/emailCreator";
import crypto from "crypto";

// 72 hours in milliseconds
const TOKEN_LIFETIME = 72 * 60 * 60 * 1000;

export default async function handler(req, res) {
  /* ------------------------------------------
     VERIFY EMAIL (GET)
  ------------------------------------------- */
  if (req.method === "GET") {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Missing token" });

    try {
      const { db } = await connectToDatabase();

      // Find user with this verification token
      const user = await db.collection("users").findOne({
        verificationToken: token,
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const expiresAt = user.verificationExpiresAt
        ? new Date(user.verificationExpiresAt).getTime()
        : 0;

      const now = Date.now();

      if (now > expiresAt) {
        return res.status(400).json({ message: "Token expired" });
      }

      // Update user
      await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: { isVerified: true },
          $unset: { verificationToken: "", verificationExpiresAt: "" },
        }
      );

      // AFTER updating user as verified
      const { subject, body } = createWelcomeEmail(user.name || "Member");
      await sendEmail(user.email, subject, body);

      return res.status(200).json({
        message: "✅ Email verified successfully",
        success: true,
        email: user.email,
        name: user.name,
      });
    } catch (error) {
      console.error("❌ Email verification error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  /* ------------------------------------------
     RESEND VERIFICATION EMAIL (POST)
  ------------------------------------------- */
  if (req.method === "POST") {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
      const { db } = await connectToDatabase();

      const user = await db.collection("users").findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: "User already verified" });
      }

      const token = crypto.randomBytes(32).toString("hex");

      const expiresAt = new Date(Date.now() + TOKEN_LIFETIME);

      // Update token + expiration
      await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: {
            verificationToken: token,
            verificationExpiresAt: expiresAt,
          },
        }
      );

      // Send email
      const { subject, body } = createVerificationEmail(user.name || "", token);
      await sendEmail(email, subject, body);

      return res.status(200).json({ message: "✅ Verification email sent" });
    } catch (error) {
      console.error("❌ Resend verification error:", error);
      return res
        .status(500)
        .json({ message: "Failed to resend verification email" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
