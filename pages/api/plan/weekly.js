import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "../../../utils/mongodb";
import {
  generateWeeklyPlan,
  ensureDayComplete,
} from "../../../lib/plan/generateWeeklyPlan";
import { sendEmail } from "../../../utils/email";
import { createWeeklyPlanEmail } from "../../../emails/contentGenerator";

function normalizeDayDurations(day) {
  if (!day) return day;

  const fixed = { ...day };

  if (typeof fixed.fitness === "string") {
    fixed.fitness = {
      title: "Fitness",
      description: fixed.fitness,
      duration: null,
      durationMinutes: null,
    };
  }

  if (typeof fixed.mindfulness === "string") {
    fixed.mindfulness = {
      title: "Mindfulness",
      description: fixed.mindfulness,
      duration: null,
      durationMinutes: null,
    };
  }

  if (fixed.fitness && typeof fixed.fitness === "object") {
    fixed.fitness.duration =
      fixed.fitness.duration ?? fixed.fitness.durationMinutes ?? null;
  }

  if (fixed.mindfulness && typeof fixed.mindfulness === "object") {
    fixed.mindfulness.duration =
      fixed.mindfulness.duration ?? fixed.mindfulness.durationMinutes ?? null;
  }

  return fixed;
}

export default async function handler(req, res) {
  try {
    // ------------------------------------------------------------
    // 1) AUTHENTICATION
    // ------------------------------------------------------------
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const email = session.user.email;

    // ------------------------------------------------------------
    // 2) PREMIUM CHECK
    // ------------------------------------------------------------
    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    const mongoUser = await usersCollection.findOne({ email });
    if (!mongoUser || mongoUser.isPremium !== true) {
      return res.status(403).json({ error: "Premium required" });
    }

    const plansCollection = db.collection("weekly_plans");
    const historyCollection = db.collection("weekly_plan_history");

    // ------------------------------------------------------------
    // FIX: RELIABLE QUERY PARSING
    // ------------------------------------------------------------
    const action = req.query?.action || "";

    // ------------------------------------------------------------
    // 📩 SEND WEEKLY PLAN EMAIL (POST + ?action=email)
    // ------------------------------------------------------------
    if (req.method === "POST" && action === "email") {
      const userPlan = await plansCollection.findOne({ email });

      if (!userPlan || !userPlan.Days) {
        return res.status(404).json({ error: "Weekly plan not found" });
      }

      // STEP 1 — Shape the plan data into a clean array
      let planData = Array.isArray(userPlan.Days)
        ? userPlan.Days
        : userPlan.Days?.days
        ? userPlan.Days.days
        : Object.values(userPlan.Days || {});

      // STEP 2 — Normalize each day BEFORE generating the email
      planData = planData.map((d) => {
        const cleaned = normalizeDayDurations(d);
        const full = ensureDayComplete(cleaned, d.day);
        return full;
      });

      // ------------------------------------------------------------
      // FIX: DEFINE appUrl SO TEMPLATE DOES NOT CRASH
      // ------------------------------------------------------------
      const appUrl =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://wellnesspurelife.com";

      // ------------------------------------------------------------
      // BUILD EMAIL HTML
      // ------------------------------------------------------------
      const updatedAt = userPlan?.updatedAt
        ? new Date(userPlan.updatedAt).toISOString()
        : new Date().toISOString();

      const emailData = createWeeklyPlanEmail({
        name: mongoUser.name || email.split("@")[0],
        email,
        updatedAt,
        userPlan,
        planData,
        appUrl,
      });

      await sendEmail(email, emailData.subject, emailData.body);

      return res.status(200).json({ success: true, message: "Email sent" });
    }

    // ------------------------------------------------------------
    // GET — Load existing plan or create new
    // ------------------------------------------------------------
    if (req.method === "GET") {
      const userPlan = await plansCollection.findOne({ email });

      // ------------------------------------------------------------
      // CREATE NEW PLAN IF NOT EXISTS
      // ------------------------------------------------------------
      if (!userPlan || !userPlan.Days) {
        const newPlan = await generateWeeklyPlan();
        const nowIso = new Date().toISOString();

        const normalized = newPlan.weeklyPlan;

        const doc = {
          email,
          PlanTheme: newPlan.weekSummary || "",
          WeekSummary: newPlan.weekSummary || "",
          WeeklyCoachTip: newPlan.weekSummary || "",
          Days: Object.values(normalized), // Monday → Sunday array
          updatedAt: nowIso,
        };

        await plansCollection.updateOne(
          { email },
          { $set: doc },
          { upsert: true }
        );

        await historyCollection.insertOne({
          ...doc,
          savedAt: nowIso,
        });

        // FIX → Convert normalized array into object for frontend shape
        const planObject = Object.fromEntries(
          Object.values(normalized).map((d) => [d.day, d])
        );

        return res.status(200).json({
          plan: planObject, // CORRECT SHAPE
          weekSummary: newPlan.weekSummary,
          updatedAt: nowIso,
        });
      }

      // ------------------------------------------------------------
      // EXISTING PLAN
      // ------------------------------------------------------------
      const raw = Object.fromEntries(userPlan.Days.map((d) => [d.day, d]));

      // Normalization (old shapes → new shape)
      let normalized = {};

      if (raw?.Monday) {
        normalized = raw;
      } else if (raw?.days && Array.isArray(raw.days)) {
        normalized = Object.fromEntries(raw.days.map((d) => [d.day, d]));
      } else if (typeof raw === "object") {
        normalized = raw;
      }

      const fixedPlan = Object.fromEntries(
        Object.entries(normalized).map(([day, data]) => {
          const cleaned = normalizeDayDurations(data);
          const completed = ensureDayComplete(cleaned, day);
          return [day, completed];
        })
      );

      return res.status(200).json({
        plan: fixedPlan,
        weekSummary: userPlan.WeekSummary || "",
        updatedAt: userPlan.updatedAt || null,
      });
    }

    // ------------------------------------------------------------
    // POST — Regenerate plan when not sending email
    // ------------------------------------------------------------
    if (req.method === "POST" && !action) {
      const existing = await plansCollection.findOne({ email });

      if (existing?.weeklyPlan) {
        await historyCollection.insertOne({
          email,
          weeklyPlan: existing.weeklyPlan,
          weekSummary: existing.weekSummary || "",
          updatedAt: existing.updatedAt || null,
          savedAt: new Date().toISOString(),
        });
      }

      const aiPlan = await generateWeeklyPlan();
      if (!aiPlan?.weeklyPlan) {
        return res
          .status(500)
          .json({ error: "AI failed to produce weekly plan" });
      }

      const nowIso = new Date().toISOString();

      const normalized = aiPlan.weeklyPlan;

      // 🔥 SAVE NORMALIZED SHAPE IN DATABASE
      await plansCollection.updateOne(
        { email },
        {
          $set: {
            PlanTheme: aiPlan.weekSummary || "",
            WeekSummary: aiPlan.weekSummary || "",
            WeeklyCoachTip: aiPlan.weekSummary || "",
            Days: Object.values(normalized), // array: Monday → Sunday
            updatedAt: nowIso,
          },
        },
        { upsert: true }
      );

      return res.status(200).json({
        plan: normalized,
        weekSummary: aiPlan.weekSummary,
        updatedAt: nowIso,
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("🔥 Weekly Plan API Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
