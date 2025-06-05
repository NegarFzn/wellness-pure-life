import OpenAI, { AzureOpenAI } from "openai";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-04-01-preview";
const openaiApiKey = process.env.OPENAI_API_KEY;

const useAzure = !!endpoint && !!azureApiKey && !!deployment;

let aiClient = null;

if (useAzure) {
  try {
    aiClient = new AzureOpenAI({
      endpoint,
      apiKey: azureApiKey,
      deployment,
      apiVersion,
    });
  } catch (error) {
    console.error("❌ Failed to initialize Azure OpenAI client:", error);
  }
} else if (openaiApiKey) {
  try {
    aiClient = new OpenAI({ apiKey: openaiApiKey });
  } catch (error) {
    console.error("❌ Failed to initialize OpenAI client:", error);
  }
}

export async function getAIChatCompletion(
  messages,
  {
    temperature = 0.5,
    maxTokens = 500,
    topP = 0.9,
    frequencyPenalty = 0.5,
  } = {}
) {
  if (!messages || !Array.isArray(messages)) {
    throw new Error("Missing or invalid 'messages'");
  }

  if (!aiClient) {
    throw new Error("No valid AI client configuration found.");
  }

  const payload = {
    messages,
    temperature,
    max_tokens: maxTokens,
    top_p: topP,
    frequency_penalty: frequencyPenalty,
    model: useAzure ? undefined : "gpt-4",
  };

  const response = await aiClient.chat.completions.create(payload);
  return response.choices?.[0]?.message?.content?.trim();
}
