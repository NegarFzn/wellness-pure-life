// pages/api/confirm-premium.js
import { firestore } from "../../utils/firebaseAdmin";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: "Missing session_id" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const uid = session.metadata?.uid;

    if (!uid) {
      return res
        .status(400)
        .json({ error: "UID not found in session metadata" });
    }

    await firestore.collection("users").doc(uid).update({
      isPremium: true,
      upgradedAt: new Date().toISOString(),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("🔥 Failed to confirm premium:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
