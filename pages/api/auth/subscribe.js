import { firestore } from "../../../utils/firebaseAdmin"; // Server-side Firestore instance
import { sendEmail } from "../../../utils/email"; // Universal email sender
import { createSubscriptionEmail } from "../../../emails/emailCreator"; // Email content builder

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  try {
    const docRef = firestore.collection("subscribers").doc(email);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return res.status(409).json({ message: "You're already subscribed!" });
    }

    await docRef.set({
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    const { subject, body } = createSubscriptionEmail(name);
    await sendEmail(email, subject, body);

    return res.status(201).json({ message: "✅ Thank you for subscribing!" });
  } catch (error) {
    console.error("❌ Subscription Error:", error);
    return res.status(500).json({ message: "Subscription failed." });
  }
}
