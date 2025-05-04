// pages/api/verify-token.js
import { db } from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
  // 🔒 [NEW] Reject unsupported methods
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { token } = req.query;

  if (!token) {
    console.error("❌ Missing token in request.");
    return res.status(400).json({ message: "Missing token." });
  }

  try {
    const tokenDoc = await db.collection("emailTokens").doc(token).get();

    if (!tokenDoc.exists) {
      console.warn("⚠️ Invalid or expired token used:", token);
      return res.status(400).json({ message: "❌ Invalid or expired token." });
    }

    const data = tokenDoc.data();
    const { uid, createdAt } = data;

    // 🕒 [NEW] Optional: Check if token has expired (older than 10 minutes)
    const now = Date.now();
    const expirationTime = 10 * 60 * 1000; // 10 minutes
    if (createdAt && now - createdAt > expirationTime) {
      console.warn("❌ Token expired.");
      await db.collection("emailTokens").doc(token).delete(); // cleanup expired
      return res.status(400).json({ message: "❌ Token expired." });
    }

    if (!uid) {
      console.error("❌ Token document found but missing UID:", data);
      return res.status(500).json({ message: "Invalid token data." });
    }

    console.log("🔐 Verifying email for UID:", uid);

    await db.collection("users").doc(uid).update({ emailVerified: true });
    await db.collection("emailTokens").doc(token).delete();

    console.log("✅ Email verified and token deleted for UID:", uid);

    return res.status(200).json({ message: "✅ Email verified successfully!" });
  } catch (error) {
    console.error("🔥 Server error during email verification:", {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ message: "❌ Something went wrong." });
  }
}
