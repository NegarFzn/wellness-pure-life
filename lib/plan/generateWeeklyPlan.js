import { getAIChatCompletion } from "../../utils/ai";

/*----------------------------------------------*
 * SAFE JSON CLEANER
 *----------------------------------------------*/
function cleanJSON(text) {
  if (!text) return text;

  text = text.replace(/```json|```/gi, "").trim();
  text = text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

  return text.trim();
}

/*----------------------------------------------*
 * SAFER PARSE – tolerate extra text
 *----------------------------------------------*/
function safeParseJSON(text) {
  if (!text) throw new Error("Empty AI response");

  try {
    return JSON.parse(text);
  } catch (_) {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      const slice = text.slice(first, last + 1);
      return JSON.parse(slice);
    }
    throw new Error("Weekly Plan AI returned invalid JSON");
  }
}

/*----------------------------------------------*
 * REQUIRED FIELDS VALIDATION
 *----------------------------------------------*/
const REQUIRED_DAY_FIELDS = {
  theme: "",
  focus: "",
  moodColor: "",
  fitness: {
    title: "",
    durationMinutes: 0,
    intensity: "",
    description: "",
  },
  mindfulness: {
    title: "",
    durationMinutes: 0,
    description: "",
  },
  nourish: {
    title: "",
    description: "",
    reminders: [],
  },
  evening: {
    title: "",
    description: "",
  },
  mentorTip: "",
  quote: "",
  quoteAuthor: "",
};

function ensureDayComplete(dayObj, dayName) {
  const fixed = { day: dayName };

  for (const key of Object.keys(REQUIRED_DAY_FIELDS)) {
    let value = dayObj[key];

    // -----------------------------------------------------
    // 1) If value is missing → use default object/string
    // -----------------------------------------------------
    if (value === undefined || value === null) {
      fixed[key] = REQUIRED_DAY_FIELDS[key];
      continue;
    }

    // -----------------------------------------------------
    // 2) If value is a STRING but expected an OBJECT
    // Convert to correct structured object
    // -----------------------------------------------------

    // Nourish: string → { title, description, reminders }
    if (key === "nourish" && typeof value === "string") {
      fixed[key] = {
        title: "Nourish",
        description: value,
        reminders: [],
      };
      continue;
    }

    // Evening: string → { title, description }
    if (key === "evening" && typeof value === "string") {
      fixed[key] = {
        title: "Evening Routine",
        description: value,
      };
      continue;
    }

    // Fitness: string → full fitness object
    if (key === "fitness" && typeof value === "string") {
      fixed[key] = {
        title: "Movement",
        durationMinutes: 20,
        intensity: "medium",
        description: value,
      };
      continue;
    }

    // Mindfulness: string → full mindfulness object
    if (key === "mindfulness" && typeof value === "string") {
      fixed[key] = {
        title: "Mindfulness",
        durationMinutes: 10,
        description: value,
      };
      continue;
    }

    // theme, focus, mentorTip, quote, quoteAuthor should always be strings
    if (
      ["theme", "focus", "mentorTip", "quote", "quoteAuthor"].includes(key) &&
      typeof value !== "string"
    ) {
      fixed[key] = "";
      continue;
    }

    // -----------------------------------------------------
    // 3) If correct type → assign directly
    // -----------------------------------------------------
    fixed[key] = value;
  }

  return fixed;
}

/*----------------------------------------------*
 * FALLBACK DAY & WEEK HELPERS
 *----------------------------------------------*/
function buildFallbackDay(dayName) {
  return {
    day: dayName,
    theme: "Balance & Renewal.",
    focus: "Gentle progress and self-care.",
    moodColor: "lavender",
    fitness: {
      title: "Light Movement",
      durationMinutes: 20,
      intensity: "low",
      description:
        "Take a gentle walk or a light stretching session to wake up your body. Focus on smooth, unhurried movements and steady breathing. Notice how your joints and muscles gradually feel warmer and more comfortable. This is not about pushing limits but about reconnecting with how your body feels today.",
    },
    mindfulness: {
      title: "Breathing Pause",
      durationMinutes: 10,
      description:
        "Sit or lie in a comfortable position and place one hand on your chest and one on your belly. Breathe in slowly through your nose and exhale a little longer than you inhale. Notice how the body relaxes more with each out-breath. Let thoughts come and go without following them.",
    },
    nourish: {
      title: "Hydration & Simple Nourishment",
      description:
        "Prioritise water, herbal tea, and simple, minimally processed meals. Include a source of protein, healthy fats, and colourful vegetables where possible. Eat slowly enough to actually taste and enjoy your food. Let each meal be a small act of kindness towards your body.",
      reminders: [
        "Drink water regularly through the day",
        "Keep meals simple and easy to digest",
        "Avoid skipping meals for long periods",
      ],
    },
    evening: {
      title: "Calm Evening Wind-Down",
      description:
        "Reduce screens and bright lights at least 30–60 minutes before bed. Do something soothing such as light reading, stretching, or a warm shower. Let your breathing slow down and consciously relax your shoulders and jaw. Invite the nervous system to shift into rest-and-repair mode.",
    },
    mentorTip:
      "You do not need a perfect routine to deserve rest and care. Showing up for yourself in small, steady ways is more powerful than any extreme plan. Let this day be about building trust with your body. Consistency and kindness will take you further than pressure ever could.",
    quote: "Peace begins with a single breath.",
    quoteAuthor: "",
  };
}

function buildFallbackWeek() {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const weeklyPlan = {};
  days.forEach((d) => {
    weeklyPlan[d] = buildFallbackDay(d);
  });

  return {
    weekSummary:
      "A gentle, balanced week focused on movement, calm breathing, simple nourishment, and deep rest.",
    weeklyPlan,
  };
}

/*----------------------------------------------*
 * MAIN WEEKLY PLAN GENERATOR (AI)
 *----------------------------------------------*/
export async function generateWeeklyPlan() {
  console.log("🔹 generateWeeklyPlan() called");

  const systemPrompt = `
You are a science-based wellness coach and a long-form wellness writer.
Return ONLY valid JSON. No explanations. No markdown.

Each day MUST include ALL of the following fields:

{
  "day": "Monday",
  "theme": "short theme sentence",
  "focus": "short focus sentence",
  "moodColor": "a simple color name",
  "fitness": {
    "title": "string",
    "durationMinutes": number,
    "intensity": "string",
    "description": "4–6 sentences"
  },
  "mindfulness": {
    "title": "string",
    "durationMinutes": number,
    "description": "4–6 sentences"
  },
  "nourish": {
    "title": "string",
    "description": "4–6 sentences",
    "reminders": ["string", "string"]
  },
  "evening": {
    "title": "string",
    "description": "4–6 sentences"
  },
  "mentorTip": "2–3 sentences",
  "quote": "string",
  "quoteAuthor": "string"
}

REQUIRED JSON STRUCTURE:
{
  "weekSummary": "...",
  "days": [
    { "day": "Monday", ... },
    ...
    { "day": "Sunday", ... }
  ]
}

Make sure theme, focus, moodColor, nourish, and evening ALWAYS contain meaningful AI-generated text.
`;

  const userPrompt = `Generate the full 7-day wellness plan now.`;

  let raw;
  try {
    raw = await getAIChatCompletion(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.9, topP: 0.95, maxTokens: 4000 }
    );
  } catch (err) {
    console.error("❌ AI call failed:", err);
    return buildFallbackWeek();
  }

  if (!raw) {
    console.error("❌ Empty AI response");
    return buildFallbackWeek();
  }

  const cleaned = cleanJSON(raw);

  let parsed;
  try {
    parsed = safeParseJSON(cleaned);
  } catch (err) {
    console.error("❌ JSON parse failed:", err);
    return buildFallbackWeek();
  }

  const requiredDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const weeklyPlan = {};
  requiredDays.forEach((dayName) => {
    const fromAI = parsed?.days?.find?.((d) => d.day === dayName) || null;

    weeklyPlan[dayName] = ensureDayComplete(
      fromAI || buildFallbackDay(dayName),
      dayName
    );
  });

  const weekSummary =
    parsed?.weekSummary ||
    "A balanced week designed to support steady movement, calmer breathing, simple nourishment, and deeper rest.";

  return {
    weekSummary,
    weeklyPlan, // ✔ fixed
  };
}

export { ensureDayComplete };
