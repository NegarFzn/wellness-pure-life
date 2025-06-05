import { getAIChatCompletion } from "../../../utils/ai";

export default async function handler(req, res) {
  try {
    const messages = [
      {
        role: "system",
        content: "You are a motivational wellness assistant.",
      },
      {
        role: "user",
        content:
          "Give me a short, inspiring daily wellness tip (1-2 sentences). Keep it friendly and practical.",
      },
    ];

    const tip = await getAIChatCompletion(messages);

    if (!tip) {
      return res.status(500).json({ error: "No response from AI model." });
    }

    res.status(200).json({ tip });
  } catch (error) {
    console.error("❌ Error generating wellness tip:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
