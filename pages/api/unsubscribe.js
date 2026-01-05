import { connectToDatabase } from "../../utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const { db } = await connectToDatabase();

    // Update email_leads funnel status → unsubscribed
    await db.collection("email_leads").updateMany(
      { email },
      {
        $set: {
          "funnel.status": "unsubscribed",
          "funnel.day": 999, // stops automation completely
          unsubscribedAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      message: "You have successfully unsubscribed.",
    });
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
}
