import { getAIChatCompletion } from "../../utils/ai";

export async function generateDailyPlan(userProfile = {}, quizData = {}) {
  const systemPrompt = `
You are a wellness coach. Create a DAILY ROUTINE with 3 sections:
- Morning
- Midday
- Evening

STRICTLY return JSON.
JSON structure:

{
  "daySummary": "string",
  "morning": {
    "title": "string",
    "description": "string",
    "durationMinutes": number
  },
  "midday": {
    "title": "string",
    "description": "string",
    "durationMinutes": number
  },
  "evening": {
    "title": "string",
    "description": "string",
    "durationMinutes": number
  }
}

Rules:
- Keep the tone calming and realistic
- Always science-based
- JSON ONLY
`;

  const userPrompt = `
User profile:
${JSON.stringify(userProfile, null, 2)}

Quiz:
${JSON.stringify(quizData, null, 2)}

Generate the daily plan now in JSON.
`;

  const raw = await getAIChatCompletion(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    {
      temperature: 0.7,
      maxTokens: 1000,
    }
  );

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Daily Plan JSON Error:", err, raw);
    throw new Error("Invalid JSON from Daily AI");
  }
}
