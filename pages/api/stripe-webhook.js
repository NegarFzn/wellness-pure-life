import { buffer } from "micro";
import Stripe from "stripe";
import { db } from "../../../lib/firebase";
import {
  doc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";

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
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
          isPremium: true,
          upgradedAt: new Date().toISOString(),
        });
        console.log("🌟 Premium granted via UID.");
      } catch (err) {
        console.error("❌ Firestore update via UID failed:", err.message);
      }
    } else if (email) {
      try {
        const q = query(collection(db, "users"), where("email", "==", email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          snapshot.forEach(async (docSnap) => {
            await updateDoc(doc(db, "users", docSnap.id), {
              isPremium: true,
              upgradedAt: new Date().toISOString(),
            });
            console.log("🌟 Premium granted via email.");
          });
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
