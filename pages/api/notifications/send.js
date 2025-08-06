import { Expo } from "expo-server-sdk";
import { firestore } from "../../../utils/firebaseAdmin";

const expo = new Expo();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const snapshot = await firestore
      .collection("users")
      .where("pushToken", "!=", null)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No users with push tokens" });
    }

    const messages = [];

    snapshot.forEach((doc) => {
      const { pushToken, name } = doc.data();
      if (Expo.isExpoPushToken(pushToken)) {
        messages.push({
          to: pushToken,
          sound: "default",
          title: "Stay motivated! 💪",
          body: `Hey ${name || "there"}, time for your next workout!`,
        });
      }
    });

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    res.status(200).json({ message: "Push notifications sent", tickets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send notifications" });
  }
}
