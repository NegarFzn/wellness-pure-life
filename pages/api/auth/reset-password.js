import { firestore, FieldValue } from "../../../utils/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { sendEmail } from "../../../utils/email";
import { createPasswordResetEmail } from "../../../emails/emailCreator";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, token, password } = req.body;
  const usersRef = firestore.collection("users");

  // ✅ Case 1: Send password reset email
  if (email && !token && !password) {
    const snapshot = await usersRef.where("email", "==", email).limit(1).get();
    if (snapshot.empty) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userDoc = snapshot.docs[0];
    const resetToken = uuidv4();
    const expires = Date.now() + 15 * 60 * 1000;

    await userDoc.ref.update({ resetToken, resetTokenExpires: expires });

    const userName = userDoc.data().name || "";
    const { subject, body } = createPasswordResetEmail(userName, resetToken);

    try {
      await sendEmail(email, subject, body);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to send reset email" });
    }
  }

  // ✅ Case 2: Update password using token
  if (token && password) {
    const snapshot = await usersRef
      .where("resetToken", "==", token)
      .limit(1)
      .get();
    if (snapshot.empty) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (
      !userData.resetTokenExpires ||
      userData.resetTokenExpires < Date.now()
    ) {
      return res.status(400).json({ success: false, message: "Token expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await userDoc.ref.update({
      password: hashedPassword,
      resetToken: FieldValue.delete(),
      resetTokenExpires: FieldValue.delete(),
    });

    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  }

  return res.status(400).json({ success: false, message: "Invalid request" });
}
