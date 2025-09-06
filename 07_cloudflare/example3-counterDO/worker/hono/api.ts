import { Hono } from "hono";

// Structured pattern - FULL VARIABLES SUPPORT
export const app = new Hono<Env>();

// Middleware to set Variables
app.use('*', async (c, next) => {
  c.set('requestId', crypto.randomUUID());
  c.set('startTime', Date.now());
  c.set('userAgent', c.req.header('User-Agent'));
  
  console.log(`[${c.get('requestId')}] Request started: ${c.req.method} ${c.req.path}`);
  
  await next();
  
  const duration = Date.now() - c.get('startTime');
  console.log(`[${c.get('requestId')}] Request completed in ${duration}ms`);
});

// Middleware for counter routes - set stub Variables
app.use('/api/counter/*', async (c, next) => {
  c.set('counterStub', c.env.COUNTER.get(c.env.COUNTER.idFromName('counter')));
  await next();
});

app.use('/api/counter2/*', async (c, next) => {
  c.set('counter2Stub', c.env.COUNTER2.get(c.env.COUNTER2.idFromName('counter123')));
  await next();
});

app.get("/api/", (c) => {
  const requestId = c.get('requestId');
  console.log(`[${requestId}] API request received`);
  
  return c.json({
    name: "Cloudflare (with Hono - Structured Pattern)",
    timestamp: new Date().toISOString()
  });
});

// WebSocket counter - using Variables
app.get('/api/counter/ws', async (c) => {
  const requestId = c.get('requestId');
  const counterStub = c.get('counterStub')!;
  
  console.log(`[${requestId}] WebSocket connection requested for Counter`);
  
  return counterStub.fetch(c.req.raw);
}); 

// HTTP counter routes - using Variables
app.get('/api/counter2/increment', async (c) => {
  const requestId = c.get('requestId');
  const counter2Stub = c.get('counter2Stub')!;
  
  console.log(`[${requestId}] Counter2 increment requested`);
  
  const value = await counter2Stub.increment();
  return c.json({
    message: 'Counter2 incremented via HTTP',
    value,
  });
});

app.get('/api/counter2/value', async (c) => {
  const requestId = c.get('requestId');
  const counter2Stub = c.get('counter2Stub')!;
  
  console.log(`[${requestId}] Counter2 value requested`);
  
  const value = await counter2Stub.getCounterValue();
  return c.json({
    message: 'Counter2 current value',
    value,
  });
});

app.get('/api/counter2/decrement', async (c) => {
  const requestId = c.get('requestId');
  const counter2Stub = c.get('counter2Stub')!;
  
  console.log(`[${requestId}] Counter2 decrement requested`);
  
  const value = await counter2Stub.decrement();
  return c.json({
    message: 'Counter2 decremented via HTTP',
    value,
  });
});

app.get('/api/counter2/reset', async (c) => {
  const requestId = c.get('requestId');
  const counter2Stub = c.get('counter2Stub')!;
  
  console.log(`[${requestId}] Counter2 reset requested`);
  
  // Reset by getting current value then decrementing to 0
  const currentValue = await counter2Stub.getCounterValue();
  let resetValue = 0;
  if (currentValue !== 0) {
    resetValue = await counter2Stub.decrement(currentValue);
  }
  
  return c.json({
    message: 'Counter2 reset to 0',
    previousValue: currentValue,
    currentValue: resetValue,
  });
}); 
