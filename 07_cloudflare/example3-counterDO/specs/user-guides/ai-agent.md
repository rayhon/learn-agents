# install
```bash
npm i agents
```

# Define your agent using the Agent

```javascript
import { Agent } from "agents";

interface Env {
  // Define environment variables & bindings here
}

// Pass the Env as a TypeScript type argument
// Any services connected to your Agent or Worker as Bindings
// are then available on this.env.<BINDING_NAME>

// The core class for creating Agents that can maintain state, orchestrate
// complex AI workflows, schedule tasks, and interact with users and other
// Agents.
class MyAgent extends Agent<Env, State> {
  // Optional initial state definition
  initialState = {
    counter: 0,
    messages: [],
    lastUpdated: null
  };

  // Called when a new Agent instance starts or wakes from hibernation
  async onStart() {
    console.log('Agent started with state:', this.state);
  }

  // Handle HTTP requests coming to this Agent instance
  // Returns a Response object
  async onRequest(request: Request): Promise<Response> {
    return new Response("Hello from Agent!");
  }

  // Called when a WebSocket connection is established
  // Access the original request via ctx.request for auth etc.
  async onConnect(connection: Connection, ctx: ConnectionContext) {
    // Connections are automatically accepted by the SDK.
    // You can also explicitly close a connection here with connection.close()
    // Access the Request on ctx.request to inspect headers, cookies and the URL
  }

  // Called for each message received on a WebSocket connection
  // Message can be string, ArrayBuffer, or ArrayBufferView
  async onMessage(connection: Connection, message: WSMessage) {
    // Handle incoming messages
    connection.send("Received your message");
  }

  // Handle WebSocket connection errors
  async onError(connection: Connection, error: unknown): Promise<void> {
    console.error(`Connection error:`, error);
  }

  // Handle WebSocket connection close events
  async onClose(connection: Connection, code: number, reason: string, wasClean: boolean): Promise<void> {
    console.log(`Connection closed: ${code} - ${reason}`);
  }

  // Called when the Agent's state is updated from any source
  // source can be "server" or a client Connection
  onStateUpdate(state: State, source: "server" | Connection) {
    console.log("State updated:", state, "Source:", source);
  }

  // You can define your own custom methods to be called by requests,
  // WebSocket messages, or scheduled tasks
  async customProcessingMethod(data: any) {
    // Process data, update state, schedule tasks, etc.
    this.setState({ ...this.state, lastUpdated: new Date() });
  }
}

export default MyAgent;
```
* Agent is Cloudflare Durable Object
* Instances of an Agent are addressed by a unique identifier: that identifier (ID) can be the user ID, an email address, GitHub username, a flight ticket number, an invoice ID, or any other identifier that helps to uniquely identify the instance and for whom it is acting on behalf of.
* Writing an Agent requires you to define a class that extends the Agent class from the Agents SDK package. An Agent encapsulates all of the logic for an Agent, including how clients can connect to it, how it stores state, the methods it exposes, and any error handling.
* You can also define your own methods on an Agent: it's technically valid to publish an Agent only has your own methods exposed, and create/get Agents directly from a Worker.
* Your own methods can access the Agent's environment variables and bindings on this.env, state on this.setState, and call other methods on the Agent via this.yourMethodName.


## Custom Chat Agent extends AIChatAgent
* AIChatAgent -> Agent -> Server -> DurableObject
* onChatMessage(onFinish, options?): Promise<Response | undefined>;
* messages: Message[]
* manage message

```javascript
// Example of extending AIChatAgent
import { AIChatAgent } from "agents/ai-chat-agent";
import { Message } from "ai";

interface Env {
  AI: any; // Your AI binding
}

class CustomerSupportAgent extends AIChatAgent<Env> {
  // Override the onChatMessage method to customize behavior
  async onChatMessage(onFinish) {
    // Access the AI models using environment bindings
    const { openai } = this.env.AI;

    // Get the current conversation history
    const chatHistory = this.messages;

    // Generate a system prompt based on knowledge base
    const systemPrompt = await this.generateSystemPrompt();

    // Generate a response stream
    const stream = await openai.chat({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory
      ],
      stream: true
    });

    // Return the streaming response
    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream" }
    });
  }

  // Helper method to generate a system prompt
  async generateSystemPrompt() {
    // Query knowledge base or use static prompt
    return `You are a helpful customer support agent.
            Respond to customer inquiries based on the following guidelines:
            - Be friendly and professional
            - If you don't know an answer, say so
            - Current company policies: ...`;
  }
}
```

## Agent
* To enable an Agent to accept WebSockets, define onConnect and onMessage methods on your Agent.
* **Browser Rendering API** - The Browser Rendering allows you to spin up headless browser instances, render web pages, and interact with websites through your Agent You can define a method that uses Puppeteer to pull the content of a web page, parse the DOM, and extract relevant information by calling the OpenAI model.
* Agents can use **Retrieval Augmented Generation (RAG)** to retrieve relevant information and use it augment calls to AI models. Store a user's chat history to use as context for future conversations, summarize documents to bootstrap an Agent's knowledge base, and/or use data from your Agent's web browsing tasks to enhance your Agent's capabilities. You can use the Agent's own SQL database as the source of truth for your data and store embeddings in Vectorize (or any other vector-enabled database) to allow your Agent to retrieve relevant information.
* **State management** - State within an Agent is:
  * Data is permanently stored within an Agent
  * Automatically serialized/deserialized: you can store any JSON-serializable data
  * Immediately consistent within the Agent: read your own writes. 
  * Thread-safe for concurrent updates
  * Fast: state is colocated wherever the Agent is running. Reads and writes do not need to traverse the network. 
  * Agent state is stored in a SQL database that is embedded within each individual Agent instance: you can interact with it using the higher-level **this.setState** API (recommended), which allows you to sync state and trigger events on state changes, or by directly querying the database with this.sql.


```javascript
import { Agent, Connection } from "agents";

interface Env {
  AI: Ai;
  VECTOR_DB: Vectorize;
  BROWSER: Fetcher;
}

// Define a type for your Agent's state
interface FlightRecord {
  id: string;
  departureIata: string;
  arrival: Date;
  arrivalIata: string;
  price: number;
}

export class ChatAgent extends Agent<Env, FlightRecord> {
  // It is called when client establishes a new websocket connection. The original 
  // HTTP request, including request headers, cookies, and the URL itself, are 
  // available on ctx.request.
  async onConnect(connection: Connection, ctx: ConnectionContext) {
  }

  // it is called for each incoming websocket message.
  // Messages are one of ArrayBuffer | ArrayBufferView | string, and you can 
  // send messages back to a client using connection.send().
  // You can distinguish between client connections by checking connection.id,
  //  which is unique for each connected client. 
  async onMessage(connection: Connection, message: WSMessage) {
    // const response = await longRunningAITask(message)
    await connection.send(message)
  }

  // WebSocket error and disconnection (close) handling.
  async onError(connection: Connection, error: unknown): Promise<void> {
    console.error(`WS error: ${error}`);
  }

  async onClose(connection: Connection, code: number, reason: string, wasClean: boolean): Promise<void> {
    console.log(`WS closed: ${code} - ${reason} - wasClean: ${wasClean}`);
    connection.close();
  }


  // This allows this.setState and the onStateUpdate method to be typed:
  async onStateUpdate(state: FlightRecord) {
    console.log("state updated", state);
  }

  async someOtherMethod() {
    this.setState({
      ...this.state,
      price: this.state.price + 10,
    });
  }

  // custom method for RAG
  async queryKnowledge(userQuery: string) {
    // Turn a query into an embedding
    const queryVector = await this.env.AI.run('@cf/baai/bge-base-en-v1.5', {
        text: [userQuery],
    });

    // Retrieve results from our vector index
    let searchResults = await this.env.VECTOR_DB.query(queryVector.data[0], {
        topK: 10,
        returnMetadata: 'all',
    });

    let knowledge = [];
    for (const match of searchResults.matches) {
        console.log(match.metadata);
        knowledge.push(match.metadata);
    }

    // Use the metadata to re-associate the vector search results
    // with data in our Agent's SQL database
    let results = this.sql`SELECT * FROM knowledge WHERE id IN (${knowledge.map((k) => k.id)})`;

    // Return them
    return results;
  }

  // custom method for browsing
  async browse(browserInstance: Fetcher, urls: string[]) {
    let responses = [];
    for (const url of urls) {
      const browser = await puppeteer.launch(browserInstance);
      const page = await browser.newPage();
      await page.goto(url);

      await page.waitForSelector("body");
      const bodyContent = await page.$eval(
        "body",
        (element) => element.innerHTML,
      );
      const client = new OpenAI({
        apiKey: this.env.OPENAI_API_KEY,
      });

      let resp = await client.chat.completions.create({
        model: this.env.MODEL,
        messages: [
          {
            role: "user",
            content: `Return a JSON object with the product names, prices and URLs with the following format: { "name": "Product Name", "price": "Price", "url": "URL" } from the website content below. <content>${bodyContent}</content>`,
          },
        ],
        response_format: {
          type: "json_object",
        },
      });

      responses.push(resp);
      await browser.close();
    }

    return responses;
  }

}
```

### install puppetter
```bash
npm i -D @cloudflare/puppeteer
```

### wrangler.jsonc
```jsonc
{
  // ...
  "browser": {
    "binding": "MYBROWSER",
  },
  // ...
  "vectorize": [
    {
      "binding": "VECTOR_DB",
      "index_name": "your-vectorize-index-name"
    }
  ]
  // ...
}
```

* mcp: MCPClientManager;
* onEmail
* manage schedule
* manage state
* manage mcp servers

## Server
* sql
* onConnect
* onStart
* onMessage
* onRequest - for HTTP calls
* onClose, onError, onException
* getConnection
* get/setName
* manage websocket
* manage alarm


## DurableObject
* protected ctx: DurableObjectState;
* protected env: Env;
* constructor(ctx: DurableObjectState, env: Env);
* fetch?(request: Request): Response | Promise<Response>;
* alarm?(alarmInfo?: AlarmInvocationInfo): void | Promise<void>;
* webSocketMessage?(ws: WebSocket, message: string | ArrayBuffer): void | Promise<void>;
* webSocketClose?(ws: WebSocket, code: number, reason: string, wasClean: boolean): void | Promise<void>;
* webSocketError?(ws: WebSocket, error: unknown): void | Promise<void>;

# References
* https://developers.cloudflare.com/agents/api-reference/agents-api/