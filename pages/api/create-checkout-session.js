// pages/api/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1RGsNpFkW4K3pwedXi2EiUuB", // ✅ Your actual Stripe Price ID
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${req.headers.origin}/premium-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
    });

    // 🔁 Return sessionUrl (or redirect URL)
    res.status(200).json({ sessionUrl: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
