import { OpenAIClient } from "@azure/openai";
import { AzureKeyCredential } from "@azure/core-auth";



const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

export async function getChatCompletion(messages) {
  const result = await client.getChatCompletions(deploymentName, messages, {
    temperature: 0.7,
    maxTokens: 1000,
  });
  return result.choices[0].message.content;
}
