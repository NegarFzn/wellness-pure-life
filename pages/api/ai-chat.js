import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: "Missing or invalid 'messages'" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // or try: "gpt-3.5-turbo"
      messages,
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();
    res.status(200).json({ reply });
  } catch (error) {
    console.error("🧠 GPT Error:", error); // LOG HERE

    res.status(500).json({
      message: "GPT Server Error",
      details: error.message || "Something went wrong",
    });
  }
}
