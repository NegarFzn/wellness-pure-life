import { db } from "@/lib/firebase";
import { sendWeeklyNewsletter } from "@/utils/email";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const snapshot = await db.collection("subscribers").get();
    const subscribers = snapshot.docs.map((doc) => doc.data());

    await sendWeeklyNewsletter(subscribers);

    return res.status(200).json({ message: "✅ Weekly newsletters sent!" });
  } catch (err) {
    console.error("Newsletter Error:", err);
    return res.status(500).json({ message: "Failed to send newsletters." });
  }
}
