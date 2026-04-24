import { buffer } from "micro";
import Stripe from "stripe";
import { connectToDatabase } from "../../utils/mongodb";

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

/* ----------------------------------------------------
   Helper: Safely extract email from Stripe event
   (Including fallback to Stripe Customer lookup)
----------------------------------------------------- */
async function extractEmail(event) {
  const obj = event?.data?.object;

  let email =
    obj?.customer_details?.email ||
    obj?.metadata?.email ||
    obj?.customer_email ||
    obj?.client_reference_id ||
    null;

  // If email still not found but we have a Customer ID → fetch it
  if (!email && obj?.customer) {
    try {
      const customer = await stripe.customers.retrieve(obj.customer);
      email = customer?.email || null;
    } catch (e) {
      console.warn("⚠️ Unable to fetch customer email from Stripe:", e.message);
    }
  }

  return email;
}

/* ----------------------------------------------------
   Helper: Update Premium Status in MongoDB
----------------------------------------------------- */
async function updateMongoPremium({
  email,
  isPremium,
  premiumData = {},
}) {
  if (!email) {
    console.warn("⚠️ Cannot update premium: missing email");
    return;
  }

  const { db } = await connectToDatabase();
  const users = db.collection("users");

  const result = await users.updateOne(
    { email },
    {
      $set: {
        isPremium,
        premium: {
          status: premiumData.status || (isPremium ? "active" : "inactive"),
          stripeCustomerId: premiumData.customerId || null,
          subscriptionId: premiumData.subscriptionId || null,
          priceId: premiumData.priceId || null,
          currentPeriodEnd: premiumData.currentPeriodEnd || null,
          updatedAt: new Date(),
        },
      },
    }
  );

  if (result.matchedCount === 0) {
    console.warn(`⚠️ Stripe webhook: no user found for email ${email} — skipping update`);
    return;
  }

  console.log(`⭐ Premium updated for ${email} → isPremium=${isPremium}`);
}

/* ----------------------------------------------------
   MAIN WEBHOOK HANDLER
----------------------------------------------------- */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
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
    console.error("❌ Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`🔔 Stripe Event Received: ${event.type}`);

  /* ----------------------------------------------------
     1) Checkout Completed → Premium Granted
  ----------------------------------------------------- */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = await extractEmail(event);

    await updateMongoPremium({
      email,
      isPremium: true,
      premiumData: {
        status: "active",
        customerId: session.customer,
        subscriptionId: session.subscription,
        priceId: session?.metadata?.priceId || null,
        currentPeriodEnd: null,
      },
    });
  }

  /* ----------------------------------------------------
     2) Subscription Created / Updated
  ----------------------------------------------------- */
  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.created"
  ) {
    const sub = event.data.object;
    const email = await extractEmail(event);

    const isPremium =
      sub.status === "active" || sub.status === "trialing";

    await updateMongoPremium({
      email,
      isPremium,
      premiumData: {
        status: sub.status,
        customerId: sub.customer,
        subscriptionId: sub.id,
        priceId: sub.items?.data?.[0]?.price?.id || null,
        currentPeriodEnd: sub.current_period_end
          ? new Date(sub.current_period_end * 1000)
          : null,
      },
    });
  }

  /* ----------------------------------------------------
     3) Subscription Canceled
  ----------------------------------------------------- */
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    const email = await extractEmail(event);

    await updateMongoPremium({
      email,
      isPremium: false,
      premiumData: {
        status: "canceled",
        customerId: sub.customer,
        subscriptionId: sub.id,
        priceId: sub.items?.data?.[0]?.price?.id || null,
        currentPeriodEnd: sub.current_period_end
          ? new Date(sub.current_period_end * 1000)
          : null,
      },
    });
  }

  /* ----------------------------------------------------
     4) Invoice Payment Failed → Downgrade to inactive
  ----------------------------------------------------- */
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object;
    const email =
      invoice?.customer_email || (await extractEmail(event));

    await updateMongoPremium({
      email,
      isPremium: false,
      premiumData: {
        status: "past_due",
        customerId: invoice.customer,
        subscriptionId: invoice.subscription,
        priceId: null,
        currentPeriodEnd: null,
      },
    });
  }

  return res.json({ received: true });
}
