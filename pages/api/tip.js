import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content:
            "Give me a short, actionable wellness tip suitable for daily motivation. Keep it under 30 words.",
        },
      ],
      temperature: 0.7,
      max_tokens: 60,
    });

    console.log("🧠 OpenAI response:", response); // Debugging line

    const tip = response.choices?.[0]?.message?.content?.trim();
    if (!tip) throw new Error("No tip content received");

    res.status(200).json({ tip });
  } catch (error) {
    console.error("❌ OpenAI API error:", error);
    res.status(500).json({ tip: null, message: "Failed to generate tip" });
  }
}
