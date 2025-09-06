// Structured Pattern (Full Variables Support)
interface Env {
  Bindings: {
    COUNTER: DurableObjectNamespace<Counter>
    COUNTER2: DurableObjectNamespace<Counter2>
  }
  Variables: {
    requestId: string
    startTime: number
    userAgent?: string
    counterStub?: DurableObjectStub<Counter>
    counter2Stub?: DurableObjectStub<Counter2>
  }
} 