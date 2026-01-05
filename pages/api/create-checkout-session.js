// pages/api/create-checkout-session.js
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../utils/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  let { uid, email, password, name, plan, source, quizType, primaryGoal, utm } =
    req.body;

  try {
    // ----------------------------------------------------------
    // 1) MONGODB → SIGNUP IF password is provided
    // ----------------------------------------------------------
    const { db } = await connectToDatabase();
    const users = db.collection("users");

    if (!uid && email && password) {
      const existing = await users.findOne({ email });

      if (!existing) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertResult = await users.insertOne({
          email,
          password: hashedPassword,
          name: name || "",
          isVerified: false,
          isPremium: false,
          createdAt: new Date(),
        });

        uid = insertResult.insertedId.toString();
      } else {
        uid = existing._id.toString();
      }
    }

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    // ----------------------------------------------------------
    // 2) MONGODB → Ensure user exists & update metadata
    // ----------------------------------------------------------
    await users.updateOne(
      { email },
      {
        $setOnInsert: {
          email,
          name: name || "",
          createdAt: new Date(),
        },
        $set: {
          leadSource: source || "checkout",
          quizType: quizType || null,
          primaryGoal: primaryGoal || null,
          utm: utm || null,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    // ----------------------------------------------------------
    // 3) STRIPE: Select pricing (yearly / monthly)
    // ----------------------------------------------------------
    const priceId =
      plan === "yearly"
        ? "price_1Sm2bxLUvW2lwD1sfea1Q4Wo"
        : "price_1Sm2bILUvW2lwD1sQwCVUq0X";

    // ----------------------------------------------------------
    // 4) STRIPE: Create Checkout Session
    // ----------------------------------------------------------
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],

      customer_email: email,
      client_reference_id: email,

      metadata: {
        uid: uid || "",
        email,
        priceId,
        source: source || "",
        quizType: quizType || "",
        primaryGoal: primaryGoal || "",
      },

      success_url: `${req.headers.origin}/premium-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("❌ create-checkout-session error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
