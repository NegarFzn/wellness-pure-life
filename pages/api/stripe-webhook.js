import { buffer } from "micro";
import Stripe from "stripe";
import { markUserAsPremiumByEmail } from "../../lib/markUserPremiumByEmail"; // Create this function

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

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
      const email = session.customer_email;

      console.log("✅ Checkout completed for:", email);

      try {
        await markUserAsPremiumByEmail(email); // 🔥 Promote the user in DB
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
