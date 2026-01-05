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
 * SAFER PARSE
 *----------------------------------------------*/
function safeParseJSON(text) {
  if (!text) throw new Error("Empty AI response");

  try {
    return JSON.parse(text);
  } catch (_) {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const slice = text.slice(firstBrace, lastBrace + 1);
      return JSON.parse(slice);
    }
    throw new Error("Daily Routine AI returned invalid JSON");
  }
}

/*----------------------------------------------*
 * FALLBACK DAILY ROUTINE
 *----------------------------------------------*/
function buildFallbackDailyRoutine() {
  return {
    summary:
      "A gentle, balanced daily routine focused on movement, calm breathing, nourishing food, and deep rest.",

    morning: {
      title: "Gentle Morning Awakening",
      description:
        "Begin your day slowly with soft movement and deep breathing. Allow your nervous system to wake up without rush. Hydrate your body and set one gentle intention for the day. Avoid screens for the first few minutes if possible.",
      durationMinutes: 20,
      poem: "The light returns in quiet steps,\nBreathe gently into becoming.",
    },

    midday: {
      title: "Midday Reset & Nourishment",
      description:
        "Take a short pause in the middle of your day to reconnect with your breath and posture. Eat a simple, nourishing meal and drink water. Let go of mental tension built up in the morning. Even a few mindful minutes can restore clarity.",
      durationMinutes: 30,
      poem: "Stillness lives between two breaths,\nEven the sun must pause.",
    },

    evening: {
      title: "Evening Wind-Down & Recovery",
      description:
        "Lower stimulation as night approaches by reducing screen exposure and darkening lights. Stretch gently or take a warm shower. Reflect on one good moment from your day. Allow the body to transition naturally into rest.",
      durationMinutes: 30,
      poem: "Let the day fall like soft rain,\nRest is the body remembering.",
    },

    mentorTip:
      "Progress is built through consistency, not pressure. When you care for your body daily in small ways, it begins to trust you again. Let today be about that trust.",

    quote:
      "Slow down and everything you are chasing will come around and catch you.",
    quoteAuthor: "John De Paola",
  };
}

/*----------------------------------------------*
 * MAIN DAILY ROUTINE GENERATOR (USING GPT-4o)
 *----------------------------------------------*/
export async function generateDailyRoutine() {
  console.log("🔹 generateDailyRoutine() called");

  const systemPrompt = `
You are a science-based wellness coach and a long-form wellness writer.
You must return ONLY valid JSON. No explanations. No markdown.

CONTENT MUST BE LONG, PREMIUM, AND EMOTIONALLY SUPPORTIVE.

REQUIRED JSON FORMAT:
{
  "summary": "string",

  "morning": {
    "title": "string",
    "description": "4–6 sentences",
    "durationMinutes": number,
    "poem": "2–4 line poetic reflection for morning"
  },

  "midday": {
    "title": "string",
    "description": "4–6 sentences",
    "durationMinutes": number,
    "poem": "2–4 line poetic reflection for midday"
  },

  "evening": {
    "title": "string",
    "description": "4–6 sentences",
    "durationMinutes": number,
    "poem": "2–4 line poetic reflection for evening"
  },

  "mentorTip": "4–6 sentences",
  "quote": "string",
  "quoteAuthor": "string"
}
`;

  const userPrompt = `
Generate a full premium daily routine now.
Make morning, midday, and evening equally detailed.
`;

  let raw;

  try {
    raw = await getAIChatCompletion(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      {
        model: "gpt-4o",
        temperature: 0.9,
        topP: 0.95,
        maxTokens: 4200,
      }
    );
  } catch (err) {
    console.error("❌ AI call failed:", err);
    const fallback = buildFallbackDailyRoutine();

    return {
      dailyRoutine: {
        Morning: fallback.morning,
        Midday: fallback.midday,
        Evening: fallback.evening,
      },
      daySummary: fallback.summary,
      mentorTip: fallback.mentorTip,
      quote: fallback.quote,
      quoteAuthor: fallback.quoteAuthor,
    };
  }

  if (!raw) {
    console.error("❌ Empty AI response. Using fallback.");
    const fallback = buildFallbackDailyRoutine();

    return {
      dailyRoutine: {
        Morning: fallback.morning,
        Midday: fallback.midday,
        Evening: fallback.evening,
      },
      daySummary: fallback.summary,
      mentorTip: fallback.mentorTip,
      quote: fallback.quote,
      quoteAuthor: fallback.quoteAuthor,
    };
  }

  const cleaned = cleanJSON(raw);

  let parsed;

  try {
    parsed = safeParseJSON(cleaned);
  } catch (err) {
    console.error("❌ JSON parse failed:", err);
    console.error("❌ Raw AI output:", cleaned);
    const fallback = buildFallbackDailyRoutine();

    return {
      dailyRoutine: {
        Morning: fallback.morning,
        Midday: fallback.midday,
        Evening: fallback.evening,
      },
      daySummary: fallback.summary,
      mentorTip: fallback.mentorTip,
      quote: fallback.quote,
      quoteAuthor: fallback.quoteAuthor,
    };
  }

  const fallback = buildFallbackDailyRoutine();

  return {
    dailyRoutine: {
      Morning: {
        ...parsed?.morning,
        poem: parsed?.morning?.poem || fallback.morning.poem,
      },
      Midday: {
        ...parsed?.midday,
        poem: parsed?.midday?.poem || fallback.midday.poem,
      },
      Evening: {
        ...parsed?.evening,
        poem: parsed?.evening?.poem || fallback.evening.poem,
      },
    },

    daySummary:
      parsed?.summary ||
      "A calm, balanced daily routine designed to support gentle movement, mindful pauses, nourishing meals, and restorative rest.",

    mentorTip: parsed?.mentorTip || fallback.mentorTip,
    quote: parsed?.quote || fallback.quote,
    quoteAuthor: parsed?.quoteAuthor || fallback.quoteAuthor,
  };
}
