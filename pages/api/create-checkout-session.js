// pages/api/create-checkout-session.js
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import { firestore } from "../../utils/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.log("❌ Invalid method");
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  let { uid, email, password, name } = req.body;
  console.log("📨 Incoming checkout session for:", { uid, email });

  try {
    // Signup if no uid and valid email + password are provided
    if (!uid && email && password) {
      const userQuery = await firestore
        .collection("users")
        .where("email", "==", email)
        .get();

      if (userQuery.empty) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRef = await firestore.collection("users").add({
          email,
          password: hashedPassword,
          name,
          isVerified: false, 
          isPremium: false,
          createdAt: new Date().toISOString(),
        });
        uid = userRef.id;
        console.log("✅ User signed up:", uid);
      } else {
        const existingUser = userQuery.docs[0];
        uid = existingUser.id;
        console.log("⚠️ User already exists, using existing UID:", uid);
      }
    }

    if (!uid || !email) {
      console.error("❌ Missing uid or email in request:", { uid, email });
      return res.status(400).json({ error: "Missing uid or email" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1RGsNpFkW4K3pwedXi2EiUuB",
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        uid: uid,
      },
      success_url: `${req.headers.origin}/premium-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
    });

    console.log("✅ Stripe session created:", session.id);
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe or Firestore Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
