# Hono + Durable Objects Guide

## Setup

### 1. Install Dependencies
```bash
npm install hono @cloudflare/workers-types
```

### 2. Environment Types
**`worker/env.d.ts`**
```typescript
import { Counter } from './durable_objects/counter'
import { Counter2 } from './durable_objects/counter_do'

interface Env {
  Bindings: {
    COUNTER: DurableObjectNamespace<Counter>
    COUNTER2: DurableObjectNamespace<Counter2>
  }
  Variables: {
    requestId: string
    counterStub?: DurableObjectStub<Counter>
    counter2Stub?: DurableObjectStub<Counter2>
  }
}
```

### 3. Durable Object Classes
**`worker/durable_objects/counter.ts`** (WebSocket)
```typescript
export class Counter {
  private value: number = 0
  private sessions: Set<WebSocket> = new Set()

  constructor(private state: DurableObjectState, private env: any) {}

  async fetch(request: Request): Promise<Response> {
    if (new URL(request.url).pathname === '/ws') {
      return this.handleWebSocket(request)
    }
    return new Response('Not found', { status: 404 })
  }

  private async handleWebSocket(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get('Upgrade')
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 })
    }

    const [client, server] = Object.values(new WebSocketPair())
    server.accept()
    this.sessions.add(server)

    server.send(JSON.stringify({ type: 'update', value: this.value }))

    server.addEventListener('message', async (event) => {
      const data = JSON.parse(event.data as string)
      if (data.type === 'increment') {
        this.value++
        await this.state.storage.put('value', this.value)
        this.broadcast({ type: 'update', value: this.value })
      }
    })

    server.addEventListener('close', () => this.sessions.delete(server))
    return new Response(null, { status: 101, webSocket: client })
  }

  private broadcast(message: any) {
    this.sessions.forEach(session => {
      try {
        session.send(JSON.stringify(message))
      } catch {
        this.sessions.delete(session)
      }
    })
  }
}
```

**`worker/durable_objects/counter_do.ts`** (HTTP)
```typescript
export class Counter2 {
  private value: number = 0

  constructor(private state: DurableObjectState, private env: any) {}

  async increment(): Promise<number> {
    if (this.value === 0) {
      this.value = (await this.state.storage.get('value')) || 0
    }
    this.value++
    await this.state.storage.put('value', this.value)
    return this.value
  }

  async getValue(): Promise<number> {
    if (this.value === 0) {
      this.value = (await this.state.storage.get('value')) || 0
    }
    return this.value
  }
}
```

### 4. Hono API
**`worker/hono/api.ts`**
```typescript
import { Hono } from 'hono'
import type { Env } from '../env'

const app = new Hono<Env>()

// Middleware
app.use('*', async (c, next) => {
  c.set('requestId', crypto.randomUUID())
  await next()
})

app.use('/api/counter/*', async (c, next) => {
  c.set('counterStub', c.env.COUNTER.get(c.env.COUNTER.idFromName('default')))
  await next()
})

app.use('/api/counter2/*', async (c, next) => {
  c.set('counter2Stub', c.env.COUNTER2.get(c.env.COUNTER2.idFromName('default')))
  await next()
})

// Routes
app.get('/api/counter/ws', async (c) => {
  return c.get('counterStub')!.fetch(c.req.raw.clone())
})

app.get('/api/counter2/increment', async (c) => {
  const value = await c.get('counter2Stub')!.increment()
  return c.json({ value })
})

export { app }
```

### 5. Worker Entry Point ⚠️ **CRITICAL**
**`worker/index.ts`**
```typescript
import { app } from './hono/api'
import type { Env } from './env'

// ⚠️ MUST EXPORT DURABLE OBJECT CLASSES
export { Counter } from './durable_objects/counter'
export { Counter2 } from './durable_objects/counter_do'

export default {
  async fetch(request: Request, env: Env['Bindings'], ctx: ExecutionContext) {
    return app.fetch(request, env, ctx)
  },
} satisfies ExportedHandler<Env['Bindings']>
```

### 6. Wrangler Configuration
**`wrangler.jsonc`**
```json
{
  "name": "my-app",
  "main": "./worker/index.ts",
  "durable_objects": {
    "bindings": [
      { "name": "COUNTER", "class_name": "Counter", "script_name": "my-app" },
      { "name": "COUNTER2", "class_name": "Counter2", "script_name": "my-app" }
    ]
  }
}
```

## Usage Examples

### WebSocket (Real-time)
```javascript
const ws = new WebSocket('ws://localhost:8787/api/counter/ws')
ws.onmessage = (e) => console.log(JSON.parse(e.data))
ws.onopen = () => ws.send(JSON.stringify({ type: 'increment' }))
```

### HTTP (Traditional)
```bash
curl http://localhost:8787/api/counter2/increment
curl http://localhost:8787/api/counter2/value
```

## Hono Patterns

### Simple Pattern
```typescript
// Basic - no Variables support
const app = new Hono<{ Bindings: Env }>()
// ❌ Cannot use c.set() or c.get()
```

### Structured Pattern ✅ **Recommended**
```typescript
// Advanced - full Variables support
const app = new Hono<Env>()
// ✅ Can use c.set() and c.get() for middleware data
```

## Pros & Cons

### WebSocket + Durable Objects
**Pros:**
- Real-time bidirectional communication
- Automatic state persistence
- Global distribution
- Broadcasts to multiple clients

**Cons:**
- More complex setup
- WebSocket connection management needed
- Higher resource usage

### HTTP + Durable Objects
**Pros:**
- Simple request/response pattern
- Easy to test and debug
- Lower overhead
- Stateless client

**Cons:**
- No real-time updates
- Manual polling needed for live data
- Higher latency for frequent updates

## ⚠️ Critical Export Requirement

**Without exports in `worker/index.ts`, you get:**
```
Error: Script does not export a Counter entrypoint
```

**Required exports:**
```typescript
export { Counter } from './durable_objects/counter'
export { Counter2 } from './durable_objects/counter_do'
```

This is a **two-system approach**:
- `wrangler.jsonc` = build-time configuration
- `index.ts` exports = runtime registration

Both are required for Durable Objects to work!