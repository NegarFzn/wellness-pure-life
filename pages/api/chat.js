import { getAIChatCompletion } from "../../utils/ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { messages, options = {} } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: "Missing or invalid 'messages'" });
  }

  try {
    const reply = await getAIChatCompletion(messages, options);

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ GPT API Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    res.status(500).json({
      message: "GPT API Error",
      details: error.message,
    });
  }
}
