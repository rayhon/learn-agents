# Full Stack (React + Worker on Cloudflare)

## wrangler.jsonc

```json
"main": "worker/index.ts",
"compatibility_date": "2025-06-20",
"assets": {
    "not_found_handling": "single-page-application"
},
```
* main points to the worker that going to act as your backend api (ie. /api)
* This can lead to surprising but intentional behavior. For example, if you define an API endpoint in a Worker script (e.g. /api/date) and then fetch it with a client-side request in your SPA (e.g. fetch("/api/date")), the Worker script will be invoked and your API response will be returned as expected. However, if you navigate to /api/date in your browser, you will be served an HTML file. Again, this is to reduce the number of billable invocations for your application while still maintaining SPA-like functionality. This behavior can be disabled by setting the assets_navigation_has_no_effect compatibility flag.


## vite-plugin
* vite.config.ts - setup to use vite-plugin. This runs your Worker in the Cloudflare Workers runtime, ensuring your local development environment is as close to production as possible.

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
})

```

## Run dev
```bash
npm run dev
```
* This project uses Vite for local development and build, and thus comes with all of Vite's features, including hot module replacement (HMR).
* In addition, vite.config.ts is set up to use the Cloudflare Vite plugin. This runs your application in the Cloudflare Workers runtime, just like in production, and enables access to local emulations of bindings.

## Deploy
```bash
npm run deploy
```
* cloudflare gives you a domain to access your web app.

## Custom domain
### wrangler.jsonc
* add routes
```
	"routes": [
		{
			"pattern": "test.contextforce.com",
			"custom_domain": true
		}
	]
```

## Use Hono for api routing
Updated your Cloudflare Worker to use Hono for routing as you requested. To summarize, I've:

* Installed hono as a dependency.
```bash
npm install hono --prefix my-react-app
```
* Created a new Hono application in my-react-app/worker/hono/api.ts.
* Updated main worker file, my-react-app/worker/index.ts, to use the Hono application for handling requests.

## Counter Durable Object
* 3 event handlers: fetch, webSocketMessage, scheduled alarm. 
* Constructor code doesn't have this property so don't read/write data there.
* DurableObject guaranteed one event handler completely "done" before other event handled. So, it serialized the events.
* When you have await in the handler, the event loop will be idle but the os thread can free up to help other durable object but not this one. So, you don't need to worry about race condition that cause inconsistency.
* Thread in the handler write to storage and it will continue event the write is not yet persisted to the disk. However, the thread will hold up in output gate til the confirmation is received or else it will return error in response. During the time it stucks at the "output gate", next event in the queue can pass the "input gate" and start running.


## References
* https://github.com/backpine/react-on-workers-with-assets
* https://www.youtube.com/watch?v=vCMRtiTb7hE