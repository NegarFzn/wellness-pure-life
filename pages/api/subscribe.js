import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { sendWelcomeEmail } from "@/utils/email";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  try {
    const docRef = doc(db, "subscribers", email);
    const existingDoc = await getDoc(docRef);

    if (existingDoc.exists()) {
      return res.status(409).json({ message: "You're already subscribed!" });
    }

    await setDoc(docRef, {
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    try {
      const info = await sendWelcomeEmail(name, email);
      console.log("✅ Welcome Email Sent:", email, info);
    } catch (error) {
      console.error("❌ Welcome Email Error:", error.message);
    }

    return res.status(201).json({ message: "✅ Thank you for subscribing!" });
  } catch (err) {
    console.error("Subscribe Error:", err);
    return res.status(500).json({ message: "Subscription failed." });
  }
}
