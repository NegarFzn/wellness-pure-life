import { firestore } from "../../../utils/firebaseAdmin";
import { sendEmail } from "../../../utils/email";
import { createVerificationEmail } from "../../../emails/emailCreator";
import crypto from "crypto";

const TOKEN_LIFETIME = 72 * 60 * 60 * 1000; // 72 hours

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Missing token" });

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

    if (Date.now() > new Date(user.verificationExpiresAt).getTime()) {
      return res.status(400).json({ message: "Token expired" });
    }

    await userDoc.ref.update({
      isVerified: true,
      verificationToken: null,
      verificationExpiresAt: null,
    });

    return res.status(200).json({ message: "✅ Email verified successfully" });
  }

  if (req.method === "POST") {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

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
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
