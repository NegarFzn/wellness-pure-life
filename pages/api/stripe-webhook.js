import { buffer } from "micro";
import Stripe from "stripe";
import { db } from "../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  if (req.method === "POST") {
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
      const uid = session.metadata.uid; // ✅ get UID from metadata

      console.log("✅ Checkout completed for UID:", uid);

      if (!uid) {
        console.error("❌ UID missing in session metadata");
        return res.status(400).send("UID missing in session metadata");
      }

      try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
          isPremium: true,
          upgradedAt: new Date().toISOString(),
        });
        console.log("🌟 User upgraded to Premium!");
      } catch (err) {
        console.error("❌ Failed to upgrade user:", err.message);
      }
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
