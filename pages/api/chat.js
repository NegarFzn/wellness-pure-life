import { OpenAIClient } from "@azure/openai";
import { AzureKeyCredential } from "@azure/core-auth";


const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

console.log("🌍 ENV:", { endpoint, deploymentName, hasKey: !!apiKey });

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: "Missing or invalid 'messages'" });
  }

  try {
    console.log("📤 Sending to Azure:", messages);

    const result = await client.getChatCompletions(deploymentName, messages, {
      temperature: 0.5,      // less randomness
      maxTokens: 500,        // shorter replies
      topP: 0.9,
      frequencyPenalty: 0.5, // avoid repetition
    });

    const reply = result.choices?.[0]?.message?.content?.trim();
    console.log("✅ Azure replied:", reply);

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Azure GPT Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause,
    });

    res.status(500).json({
      message: "Azure GPT API Error",
      details: error.message,
    });
  }
}
