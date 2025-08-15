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

export async function saveQuizResult({
  slug,
  result,
  answers,
  email,
  isDaily = false,
}) {
  const { db } = await connectToDatabase();

  if (isDaily) {
    // Only block duplicates for *today*
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingToday = await db.collection("quizResults").findOne({
      slug,
      email,
      isDaily: true,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingToday) {
      return { newEntry: false, reason: "duplicate-today" };
    }
  } else {
    // Non-daily quizzes: block if same quiz already exists for this user
    const existing = await db.collection("quizResults").findOne({
      slug,
      email,
      isDaily: false,
    });
    if (existing) {
      return { newEntry: false, reason: "duplicate" };
    }
  }

  const entry = {
    slug,
    result,
    answers,
    email,
    isDaily,
    createdAt: new Date(),
  };
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

export async function getUserQuizHistory(req, { filterDaily } = {}) {
  const token = await getToken({ req });
  if (!token?.email) return [];

  const { db } = await connectToDatabase();
  const query = { email: token.email };
  if (filterDaily !== undefined) {
    query.isDaily = filterDaily;
  }

  return await db
    .collection("quizResults")
    .find(query)
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
