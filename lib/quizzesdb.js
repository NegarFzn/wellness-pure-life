import { connectToDatabase } from "../utils/mongodb";
import { getToken } from "next-auth/jwt";

export async function getAllQuizzes() {
  const { db } = await connectToDatabase();
  const quizzes = await db
    .collection("quizzes")
    .find({}, { projection: { title: 1, slug: 1 } })
    .toArray();
  return quizzes.map((q) => ({ title: q.title, slug: q.slug }));
}

export async function getAllQuizzesWithContent() {
  const { db } = await connectToDatabase();
  return db.collection("quizzes").find({}).toArray();
}

export async function getQuizBySlug(slug) {
  const { db } = await connectToDatabase();
  return db.collection("quizzes").findOne({ slug });
}

export async function saveQuizResult({ slug, result, answers, email }) {
  const { db } = await connectToDatabase();

  const existing = await db.collection("quizResults").findOne({ slug, email });
  if (existing) return { newEntry: false };

  const entry = { slug, result, answers, email, createdAt: new Date() };
  await db.collection("quizResults").insertOne(entry);

  return { newEntry: true };
}

export async function getRecommendationsByType(type) {
  const { db } = await connectToDatabase();
  return db
    .collection("quizzes")
    .aggregate([
      { $unwind: "$recommendations" },
      { $match: { "recommendations.type": { $regex: new RegExp(type, "i") } } },
      { $replaceRoot: { newRoot: "$recommendations" } },
    ])
    .toArray();
}

export async function getRecommendationsByTypeAndSlug(type, slug) {
  const { db } = await connectToDatabase();
  const quiz = await db.collection("quizzes").findOne({ slug });
  if (!quiz) return [];
  return quiz.recommendations.filter(
    (r) => r.type.toLowerCase() === type.toLowerCase()
  );
}

export async function logRecommendationClick({
  quizSlug,
  result,
  recommendation,
  email,
  link,
  clickedAt,
}) {
  const { db } = await connectToDatabase();
  await db.collection("quizClicks").insertOne({
    quizSlug,
    result,
    recommendation,
    email,
    link,
    clickedAt: new Date(clickedAt),
  });
}

export async function getUserQuizHistory(req) {
  const token = await getToken({ req });
  if (!token || !token.email) throw new Error("Unauthorized");
  const { db } = await connectToDatabase();
  return db
    .collection("quizResults")
    .find({ email: token.email })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getRecentQuizResults() {
  const { db } = await connectToDatabase();
  return db
    .collection("quizResults")
    .find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();
}
