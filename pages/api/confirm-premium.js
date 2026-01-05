// pages/api/confirm-premium.js
import Stripe from "stripe";
import { connectToDatabase } from "../../utils/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: "Missing session_id" });
  }

  try {
    // Retrieve Stripe Checkout Session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Extract user email from session
    const email =
      session?.customer_details?.email ||
      session?.customer_email ||
      session?.metadata?.email ||
      null;

    if (!email) {
      return res
        .status(400)
        .json({ error: "No email found in Stripe session" });
    }

    // MongoDB Connection
    const { db } = await connectToDatabase();

    // Update premium flag — safe & idempotent
    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          isPremium: true,
          premium: {
            status: "active",
            upgradedAt: new Date(),
            sessionId: session.id,
          },
        },
      }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("🔥 Failed to confirm premium:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
