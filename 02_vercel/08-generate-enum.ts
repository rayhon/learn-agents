import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

const model = openai("gpt-4");

export const classifySentiment = async (
  text: string,
) => {
  const { object } = await generateObject({
    model,
    output: "enum",
    enum: ["positive", "negative", "neutral"],
    prompt: text,
    system:
      `Classify the sentiment of the text as either ` +
      `positive, negative, or neutral.`,
  });

  return object;
};

const result = await classifySentiment(
  `This is terrible`,
);

console.log(result); // negative