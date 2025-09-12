import { getToken } from "next-auth/jwt";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "wellnesspurelife";
const savedCollection = "quiz_daily_saved"; // daily check-ins are saved here

export default async function handler(req, res) {
  const { method, query } = req;

  let client;

  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db(dbName);

    switch (method) {
      case "GET": {
        const { mode } = query;

        if (mode === "history") {
          const token = await getToken({ req });
          const email = token?.email;

          if (!email) {
            return res.status(401).json({ error: "Unauthorized" });
          }

          const dailyResults = await db
            .collection(savedCollection)
            .find({ email, slug: "daily-quiz" })
            .sort({ savedAt: -1 })
            .toArray();

          return res.status(200).json({ history: dailyResults });
        }

        return res.status(400).json({ error: "Missing or invalid query" });
      }

      case "POST": {
        const { slug, answers, email: emailFromBody } = req.body;

        if (
          !slug ||
          typeof slug !== "string" ||
          !answers ||
          typeof answers !== "object"
        ) {
          return res
            .status(400)
            .json({ error: "Missing or invalid 'slug' or 'answers'." });
        }

        const token = await getToken({ req });
        const email = token?.email || emailFromBody;

        if (!email) {
          return res.status(401).json({ error: "Email is required" });
        }

        const saveDoc = {
          slug: slug.trim().toLowerCase(),
          email: email.trim(),
          answers,
          savedAt: new Date(),
        };

        await db.collection(savedCollection).insertOne(saveDoc);

        return res.status(200).json({
          message: "Daily check-in saved",
          result: saveDoc,
        });
      }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("❌ Daily Quiz API Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  } finally {
    if (client) await client.close();
  }
}
