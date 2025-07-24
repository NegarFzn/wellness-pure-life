import { connectToDatabase } from "../../../utils/mongodb";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const token = await getToken({ req });

  if (!token || !token.email || !token.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { type, title, description } = req.body;

    if (!type || !title || !description) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    try {
      const { db } = await connectToDatabase();
      await db.collection("recommendations").insertOne({
        type,
        title,
        description,
        createdAt: new Date(),
      });
      return res.status(201).json({ message: "Recommendation added." });
    } catch (err) {
      console.error("Insert failed:", err);
      return res.status(500).json({ error: "Server error." });
    }
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
