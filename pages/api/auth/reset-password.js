import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { sendEmail } from "../../../utils/email";
import { createPasswordResetEmail } from "../../../emails/emailCreator";
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { email, token, password } = req.body;

  const { db } = await connectToDatabase();
  const users = db.collection("users");

  /* -------------------------------------------------------
     CASE 1 — REQUEST RESET EMAIL
  ------------------------------------------------------- */
  if (email && !token && !password) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await users.findOne({ email: normalizedEmail });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = uuidv4();
    const expires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          resetToken,
          resetTokenExpires: expires,
        },
      }
    );

    const { subject, body } = createPasswordResetEmail(user.name || "", resetToken);

    try {
      await sendEmail(normalizedEmail, subject, body);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("❌ Email send error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to send reset email" });
    }
  }

  /* -------------------------------------------------------
     CASE 2 — RESET PASSWORD USING TOKEN
  ------------------------------------------------------- */
  if (token && password) {
    const user = await users.findOne({ resetToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    if (!user.resetTokenExpires || user.resetTokenExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Token expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await users.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpires: "" },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  }

  /* -------------------------------------------------------
     INVALID REQUEST
  ------------------------------------------------------- */
  return res.status(400).json({ success: false, message: "Invalid request" });
}
