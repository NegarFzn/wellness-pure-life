import { db, adminAuth } from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { token, password } = req.body;

  try {
    // Get reset token from Firestore
    const doc = await db.collection("resetTokens").doc(token).get();
    if (!doc.exists) throw new Error("Invalid or expired token.");

    const { email, expiresAt } = doc.data();

    // Check if token is expired
    if (Date.now() > expiresAt) throw new Error("Reset token has expired.");

    // Lookup user by email
    const user = await adminAuth.getUserByEmail(email);

    // Update the password via Firebase Admin
    await adminAuth.updateUser(user.uid, {
      password,
    });

    // Clean up: delete token
    await db.collection("resetTokens").doc(token).delete();

    return res.status(200).json({ message: "✅ Password reset successfully." });
  } catch (err) {
    console.error("Reset error:", err);
    return res.status(400).json({
      message: err.message || "Something went wrong during password reset.",
    });
  }
}
