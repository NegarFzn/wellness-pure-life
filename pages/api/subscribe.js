import { db } from "../../lib/firebase"; // make sure this is the new Firestore setup
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: "Missing name or email." });
  }

  try {
    const q = query(collection(db, "subscribers"), where("email", "==", email));
    const existing = await getDocs(q);

    if (!existing.empty) {
      return res.status(409).json({ message: "Already subscribed." });
    }

    await addDoc(collection(db, "subscribers"), {
      name,
      email,
      subscribedAt: new Date().toISOString(),
    });

    res.status(201).json({ message: "Subscribed successfully!" });
  } catch (err) {
    console.error("Subscription error:", err);
    res.status(500).json({ message: "Failed to subscribe." });
  }
}
