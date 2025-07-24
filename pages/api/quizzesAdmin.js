import { getAllQuizzesWithContent } from "../../lib/quizzesdb";
import { connectToDatabase } from "../../utils/mongodb";


export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === "POST") {
    const quiz = req.body;

    // Basic validation
    if (
      !quiz.slug ||
      !quiz.title ||
      !Array.isArray(quiz.questions) ||
      !quiz.questions.length
    ) {
      return res.status(400).json({ error: "Invalid quiz data" });
    }

    // Check for duplicate slug
    const exists = await db.collection("quizzes").findOne({ slug: quiz.slug });
    if (exists) {
      return res
        .status(409)
        .json({ error: "Quiz with this slug already exists" });
    }

    await db.collection("quizzes").insertOne(quiz);
    return res.status(201).json({ message: "Quiz added!", quiz });
  }

  if (req.method === "GET") {
    // Use your utility for listing all quizzes
    const quizzes = await getAllQuizzesWithContent();
    return res.status(200).json(quizzes);
  }

  res.setHeader("Allow", ["POST", "GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
