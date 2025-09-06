import { app } from "./hono/api";

// Export Durable Object classes for Cloudflare Workers
export { Counter } from "./durable_objects/counter_ws";
export { Counter2 } from "./durable_objects/counter";

// Structured pattern - Env has Bindings structure
export default {
  fetch(request, env, ctx) {
    return app.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Env['Bindings']>;
