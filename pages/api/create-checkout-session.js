// pages/api/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.log("❌ Invalid method");
    return res.status(405).end();
  }

  const { email } = req.body;
  console.log("📨 Creating session for:", email);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1RGsNpFkW4K3pwedXi2EiUuB", // <- Check this again too
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${req.headers.origin}/premium-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
    });

    console.log("✅ Stripe session created:", session.id);

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
