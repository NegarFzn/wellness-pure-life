import { db } from "../../../lib/firebaseAdmin"; // using server-side Firestore
import { sendWelcomeEmail } from "../../../utils/email"; // sends the welcome email

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  try {
    // ✅ Using firebase-admin SDK pattern
    const docRef = db.collection("subscribers").doc(email);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return res.status(409).json({ message: "You're already subscribed!" });
    }

    await docRef.set({
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    await sendWelcomeEmail(name, email);

    return res.status(201).json({ message: "✅ Thank you for subscribing!" });
  } catch (error) {
    console.error("❌ Subscription Error:", error);
    return res.status(500).json({ message: "Subscription failed." });
  }
}
