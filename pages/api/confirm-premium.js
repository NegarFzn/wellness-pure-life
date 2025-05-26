// pages/api/confirm-premium.js
import { firestore } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "Missing UID" });
  }

  try {
    console.log("📩 Incoming UID for premium upgrade:", uid);
    await firestore.collection("users").doc(uid).update({
      isPremium: true,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("🔥 Failed to update premium status:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
