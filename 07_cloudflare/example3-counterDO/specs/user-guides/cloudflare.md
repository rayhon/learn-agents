# Cloudflare Workers Runtime Contract
Cloudflare Workers runtime expects your script to export specific handlers. The fetch handler is the HTTP request handler.

## Basic Pattern

```javascript
//worker
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    //handler
    return new Response('Hello World!')
  }
}
```

When a request hits your Worker:
* Cloudflare runtime calls your fetch function
* Passes in: request, env (bindings), ctx (execution context)
* Expects a Response back

## Other available handlers
```javascript
export default {
  // HTTP requests
  async fetch(request, env, ctx) {
    return new Response('HTTP')
  },

  // Cron triggers (scheduled)
  async scheduled(event, env, ctx) {
    console.log('Cron job triggered')
  },

  // Email routing
  async email(message, env, ctx) {
    // Handle email
  },

  // Queues
  async queue(batch, env, ctx) {
    // Handle queue messages
  }
}
```

# Cloudflare Durable Object
# Cloudflare K/V
# Cloudflare D1
# Cloudflare AI
