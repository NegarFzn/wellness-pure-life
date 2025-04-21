import { db } from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ valid: false });
  }

  try {
    const doc = await db.collection("resetTokens").doc(token).get();

    if (!doc.exists) {
      return res.status(404).json({ valid: false });
    }

    const data = doc.data();
    const now = Date.now();

    if (now > data.expiresAt) {
      return res.status(410).json({ valid: false });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error("❌ Token validation error:", error);
    return res.status(500).json({ valid: false });
  }
}
