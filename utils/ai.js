// utils/ai.js
import OpenAI from "openai";

const apiKey = process.env.AZURE_OPENAI_API_KEY;
const baseURL = process.env.AZURE_OPENAI_ENDPOINT;

if (!apiKey) throw new Error("Missing AZURE_OPENAI_API_KEY");
if (!baseURL) throw new Error("Missing AZURE_OPENAI_ENDPOINT");

// Azure client (no apiVersion added)
export const aiClient = new OpenAI({
  apiKey,
  baseURL, // you are already setting it in env
});

export async function getAIChatCompletion(
  messages,
  {
    model = "gpt-4o",
    temperature = 0.7,
    maxTokens = 1000,
    topP = 0.9,
  } = {}
) {
  if (!Array.isArray(messages)) {
    throw new Error("Messages must be an array");
  }

  try {
    const input = messages.map((m) => ({
  role: m.role,
  content: m.content   // plain string only
}));

    const response = await aiClient.responses.create({
      model,
      input,
      temperature,
      top_p: topP,
      max_output_tokens: maxTokens,
    });

    return response.output_text?.trim() || "";
  } catch (err) {
    console.error("❌ OpenAI API Error:", err.response?.data || err);
    throw new Error("AI generation failed");
  }
}
