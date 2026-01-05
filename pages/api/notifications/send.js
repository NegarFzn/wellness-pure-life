import { Expo } from "expo-server-sdk";
import { connectToDatabase } from "../../../utils/mongodb";

const expo = new Expo();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("users");

    // Fetch users with a registered push token
    const users = await collection
      .find({ pushToken: { $exists: true, $ne: null } })
      .toArray();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users with push tokens" });
    }

    const messages = [];

    for (const user of users) {
      const { pushToken, name } = user;

      if (Expo.isExpoPushToken(pushToken)) {
        messages.push({
          to: pushToken,
          sound: "default",
          title: "Stay motivated! 💪",
          body: `Hey ${name || "there"}, time for your next workout!`,
        });
      }
    }

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    return res.status(200).json({
      message: "Push notifications sent",
      tickets,
    });
  } catch (err) {
    console.error("❌ Push notification error:", err);
    return res.status(500).json({ message: "Failed to send notifications" });
  }
}
