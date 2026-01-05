// pages/api/premium-reminder.js
import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../utils/mongodb";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const email = session?.user?.email;
  const category = req.query.category || "fitness";

  // Guests must always see the premium reminder
  if (!email) return res.status(200).json({ show: true });

  const { db } = await connectToDatabase();
  const users = db.collection("users");

  // Find user in MongoDB (source of truth)
  const user = await users.findOne({ email });

  if (!user) {
    return res.status(200).json({ show: true });
  }

  // Category-specific dismissal key
  const fieldKey = `premiumDismissedAt_${category}`;

  // -------------------------
  // POST → User clicked “Not now”
  // -------------------------
  if (req.method === "POST") {
    await users.updateOne(
      { email },
      {
        $set: {
          [fieldKey]: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    return res.status(200).json({ ok: true });
  }

  // -------------------------
  // GET → Check if reminder should show
  // -------------------------
  if (req.method === "GET") {
    const lastDismissed = user[fieldKey];

    const remindInDays = 3;

    const shouldShow =
      !lastDismissed ||
      new Date(lastDismissed).getTime() + remindInDays * 24 * 60 * 60 * 1000 <
        Date.now();

    return res.status(200).json({ show: shouldShow });
  }

  return res.status(405).end();
}
