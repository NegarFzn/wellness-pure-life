import { firestore } from "../../../utils/firebaseAdmin";
import { sendEmail } from "../../../utils/email";
import { createVerificationEmail } from "../../../emails/emailCreator";
import crypto from "crypto";

const TOKEN_LIFETIME = 72 * 60 * 60 * 1000; // 72 hours

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Missing token" });

    try {
      const querySnap = await firestore
        .collection("users")
        .where("verificationToken", "==", token)
        .limit(1)
        .get();

      if (querySnap.empty) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const userDoc = querySnap.docs[0];
      const user = userDoc.data();

      const expiresAt = new Date(user.verificationExpiresAt).getTime();
      if (Date.now() > expiresAt) {
        return res.status(400).json({ message: "Token expired" });
      }

      // ✅ Mark user as verified
      await userDoc.ref.update({
        isVerified: true,
        verificationToken: null,
        verificationExpiresAt: null,
      });

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

  if (req.method === "POST") {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
      const querySnap = await firestore
        .collection("users")
        .where("email", "==", email)
        .limit(1)
        .get();

      if (querySnap.empty) {
        return res.status(404).json({ message: "User not found" });
      }

      const userDoc = querySnap.docs[0];
      const user = userDoc.data();

      if (user.isVerified) {
        return res.status(400).json({ message: "User already verified" });
      }

      const token = crypto.randomBytes(32).toString("hex");

      await userDoc.ref.update({
        verificationToken: token,
        verificationExpiresAt: new Date(Date.now() + TOKEN_LIFETIME),
      });

      const { subject, body } = createVerificationEmail(user.name, token);
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
