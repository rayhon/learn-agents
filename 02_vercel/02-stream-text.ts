import "dotenv/config";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
const model = openai("gpt-4");

export const answerMyQuestion = async (
  prompt: string,
) => {
  const { textStream } = await streamText({
    model,
    prompt,
  });

  for await (const text of textStream) {
    process.stdout.write(text);
  }
};

await answerMyQuestion(
  "What is the color of the sun?",
);