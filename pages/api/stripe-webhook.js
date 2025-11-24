import { buffer } from "micro";
import Stripe from "stripe";
import { firestore } from "../../utils/firebaseAdmin"; // Updated to use admin SDK

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const uid = session.metadata?.uid;
    const email = session.customer_email;

    console.log("✅ Checkout complete");
    if (uid) {
      try {
        const userRef = firestore.doc(`users/${uid}`);
        await userRef.update({
          isPremium: true,
          planType: session.mode || "subscription",

          upgradedAt: new Date().toISOString(),
        });
        console.log("🌟 Premium granted via UID.");
      } catch (err) {
        console.error("❌ Firestore update via UID failed:", err.message);
      }
    } else if (email) {
      try {
        const q = firestore.collection("users").where("email", "==", email);
        const snapshot = await q.get();
        if (!snapshot.empty) {
          for (const docSnap of snapshot.docs) {
            await docSnap.ref.update({
              isPremium: true,
              upgradedAt: new Date().toISOString(),
            });
          }
        } else {
          console.warn("⚠️ No user found with this email:", email);
        }
      } catch (err) {
        console.error("❌ Firestore update via email failed:", err.message);
      }
    } else {
      console.warn("⚠️ No UID or email in session metadata.");
    }
  }

  return res.status(200).json({ received: true });
}
