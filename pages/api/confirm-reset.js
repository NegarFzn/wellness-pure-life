import { db, adminAuth } from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { token, password } = req.body;

  try {
    const doc = await db.collection("resetTokens").doc(token).get();

    if (!doc.exists || doc.data().expiresAt < Date.now()) {
      return res
        .status(400)
        .json({ message: "Token is invalid or has expired." });
    }

    const { email } = doc.data();
    const user = await adminAuth.getUserByEmail(email);
    await adminAuth.updateUser(user.uid, { password });
    await db.collection("resetTokens").doc(token).delete();

    return res.status(200).json({ message: "✅ Password successfully reset!" });
  } catch (error) {
    console.error("❌ Password reset error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
}
