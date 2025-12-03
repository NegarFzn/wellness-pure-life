import { getAIChatCompletion } from "../../utils/ai";

export async function generateWeeklyPlan(userProfile = {}, quizData = {}) {
  const systemPrompt = `
You are a science-based wellness coach. Create a structured Weekly Plan for fitness, mindfulness, and nutrition.
STRICTLY return JSON only. No explanations outside JSON.

JSON structure:
{
  "weekSummary": "string",
  "days": [
    {
      "day": "Monday",
      "theme": "string",
      "focus": "string",
      "fitness": {
        "title": "string",
        "durationMinutes": number,
        "description": "string",
        "intensity": "low|medium|high"
      },
      "mindfulness": {
        "title": "string",
        "durationMinutes": number,
        "description": "string"
      },
      "nourish": {
        "title": "string",
        "description": "string",
        "reminders": ["string"]
      },
      "evening": {
        "title": "string",
        "description": "string"
      }
    }
  ]
}

Rules:
- Create exactly 7 days (Monday → Sunday)
- Tone: Warm, simple, WellnessPureLife style
- Must be realistic, sustainable, science-based
- NO extreme workouts or diets
- JSON ONLY
`;

  const userPrompt = `
User profile:
${JSON.stringify(userProfile, null, 2)}

Quiz results:
${JSON.stringify(quizData, null, 2)}

Generate the weekly plan in JSON.
`;

  const raw = await getAIChatCompletion(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    {
      temperature: 0.7,
      maxTokens: 1500,
    }
  );

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Weekly Plan JSON Error:", err, raw);
    throw new Error("Invalid JSON from Weekly Plan AI");
  }
}
