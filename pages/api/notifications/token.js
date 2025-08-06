import { firestore } from "../../../utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, token } = req.body;

  if (!userId || !token) {
    return res.status(400).json({ message: "Missing user ID or token" });
  }

  try {
    const userRef = firestore.collection("users").doc(userId);
    await userRef.update({ pushToken: token });
    res.status(200).json({ message: "Token saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save token" });
  }
}
