import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, token } = req.body;

  if (!userId || !token) {
    return res.status(400).json({ message: "Missing user ID or token" });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("users");

    // Convert userId to ObjectId
    const filter = { _id: new ObjectId(userId) };

    const updateResult = await collection.updateOne(filter, {
      $set: { pushToken: token },
    });

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Token saved successfully" });
  } catch (err) {
    console.error("❌ Failed to save token:", err);
    return res.status(500).json({ message: "Failed to save token" });
  }
}
