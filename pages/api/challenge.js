// pages/api/challenge.js
export default async function handler(req, res) {
  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deploymentId = "gpt-4o";

    const fetchOpenAI = async (prompt, maxTokens = 2000) => {
      const response = await fetch(
        `${endpoint}/openai/deployments/${deploymentId}/chat/completions?api-version=2023-03-15-preview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
          },
          body: JSON.stringify({
            messages: [{ role: "system", content: prompt }],
            temperature: 0.85,
            max_tokens: maxTokens,
          }),
        }
      );

      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || "";
    };

    // Fetch 100 tips
    const tipRaw = await fetchOpenAI(
      "Respond ONLY with a JSON array of 100 unique short wellness tips (max 12 words each). No title or explanation — just valid JSON.",
      2000
    );
    let tips = [];
    try {
      const jsonStr = tipRaw.slice(tipRaw.indexOf("["), tipRaw.lastIndexOf("]") + 1);
      tips = JSON.parse(jsonStr).filter((t) => typeof t === "string");
    } catch {
      tips = Array(10).fill("⚠️ Invalid GPT tips output.");
    }

    // Fetch 7 challenges
    const challengeRaw = await fetchOpenAI(
      "Respond ONLY with a valid JSON array of 7 short wellness challenges (max 12 words each). No explanation or extra text.",
      300
    );
    let challenges = [];
    try {
      const jsonStr = challengeRaw.slice(challengeRaw.indexOf("["), challengeRaw.lastIndexOf("]") + 1);
      challenges = JSON.parse(jsonStr).filter((c) => typeof c === "string");
    } catch {
      challenges = Array(7).fill("⚠️ Invalid challenge format.");
    }

    res.status(200).json({ tips, challenges });
  } catch (err) {
    console.error("Azure GPT error:", err);
    res.status(500).json({
      tips: Array(10).fill("⚠️ Failed to fetch tips."),
      challenges: Array(7).fill("⚠️ Failed to fetch challenges."),
    });
  }
}
