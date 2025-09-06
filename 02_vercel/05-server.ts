import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { once } from "node:events";
import { generateText, type CoreMessage } from "ai";
import { openai } from "@ai-sdk/openai";

const model = openai("gpt-4");

export const startServer = async () => {
  const app = new Hono();

  app.post("/api/get-completions", async (ctx) => {
    const messages: CoreMessage[] =
      await ctx.req.json();

    const result = await generateText({
      model,
      messages,
    });

    return ctx.json(result.response.messages);
  });

  const server = serve({
    fetch: app.fetch,
    port: 4317,
    hostname: "0.0.0.0",
  });

  // Wait for the "listening" event to fire
  await once(server, "listening");

  return server;
};