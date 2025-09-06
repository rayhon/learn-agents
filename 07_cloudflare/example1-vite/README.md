# React + TypeScript + Vite

## Setup
### Frontend
```bash
npm create vite@latest -- example1-vite --template react-ts

npm i -D @cloudflare/vite-plugin wrangler

# edit vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
});

# add wrangler.jsonc
{
  "name": "cloudflare-vite-tutorial",
  "compatibility_date": "2025-04-03",
  "assets": {
    "not_found_handling": "single-page-application"
  }
}
```

### Backend
```bash
npm i -D @cloudflare/workers-types

# add tsconfig.worker.json
{
  "extends": "./tsconfig.node.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.worker.tsbuildinfo",
    "types": ["@cloudflare/workers-types/2023-07-01", "vite/client"],
  },
  "include": ["worker"],
}

# update tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.worker.json" },
  ],
}

# add worker code under worker/index.ts
...


# update wrangler.jsonc
{
  "name": "cloudflare-vite-tutorial",
  "compatibility_date": "2025-04-03",
  "assets": {
    "not_found_handling": "single-page-application"
  },
  "main": "./worker/index.ts"
}

```

## Flow
* The browser first loads and parses your `index.html` file. Inside index.html, it finds this line:

```js
<script type="module" src="/src/main.tsx"></script>
```

* This tag explicitly tells the browser that `main.tsx` is the entry point for the entire JavaScript application.
* The browser then loads and executes `main.tsx`. Inside this file, you have this code:

```js
  1     import App from './App.tsx' // This line loads App.tsx
  2 
  3     createRoot(document.getElementById('root')!).render(
  4       <StrictMode>
  5         <App />
  6       </StrictMode>,
  7     )
```
*  The import App from './App.tsx' statement causes the `App.tsx` file to be loaded.
* Finally, the code in main.tsx takes the App component (which was loaded from App.tsx) and renders it into the <div id="root"></div> element in your index.html.

## How component talks to worker
The code that points the frontend to the /api backend endpoint is in the src/App.tsx file. Here is the specific snippet:

```tsx
1 // ... inside the App component
2 <button
3   onClick={() => {
4     fetch("/api/")
5       .then((res) => res.json() as Promise<{ name: string }>)
6       .then((data) => setName(data.name));
7   }}
8   aria-label="get name"
9 >
10   Name from API is: {name}
11 </button>
```
The key part is the onClick handler for the button. The line `fetch("/api/")` is what makes the network request from the frontend (running in the browser) to the backend endpoint.

Because you are using the @cloudflare/vite-plugin, when you are running the development server (npm run dev), the plugin intelligently forwards this request to your local worker code (worker/index.ts). When deployed, this request will be handled by your live Cloudflare Worker on the edge.

### Production
In production, when both the frontend and the worker are deployed to Cloudflare, the routing to /api is handled automatically.

### Development
The @cloudflare/vite-plugin is needed to solve this problem for your local development environment.

  Here's the scenario without the plugin:

   1. You run npm run dev. Vite starts a development server, let's say on http://localhost:5173, to serve your React frontend.
   2. The Vite server knows how to handle requests for your React components, CSS, etc., but it knows nothing about your worker or the /api endpoint.
   3. When your React app makes a fetch('/api/') call, the browser sends that request to http://localhost:5173/api/.
   4. The Vite server receives this request, doesn't recognize it, and returns a 404 Not Found error.

  The @cloudflare/vite-plugin elegantly solves this by creating a unified local environment that mimics production:

  When you run npm run dev with the plugin active, it essentially tells your Vite development server:

  > "Serve the normal frontend files as you usually do. However, if you see a request coming in for a path that starts with /api/, don't handle it
  yourself. Instead, proxy (forward) that request to the Cloudflare Worker code that is also running locally in the background."

  So, the plugin's job is to bridge the gap between your frontend dev server and your backend worker code on your local machine, making it seem like they
   are running on the same domain, just as they will be in production. This saves you from the hassle of dealing with things like Cross-Origin Resource
  Sharing (CORS) errors and having to use different API URLs for development and production.

  ## Vite != NextJS
  ### Routing
  * Vite itself does not handle routing like nextjs.  Vite's core job is to be an extremely fast build tool and development server. It is "unopinionated" about how you structure your application, meaning it doesn't include features like routing, state management, or server-side rendering out of the box.
  * To handle routing in a Vite project, you need to add a client-side routing library yourself. For a React project, the most popular choice by far is
  `react-router-dom`.


## wrangler.json
```json
{
    "name": "example1-vite-tutorial",
    "compatibility_date": "2025-04-03",
    "assets": {
      "not_found_handling": "single-page-application"
    },
    "main": "./worker/index.ts"
}
```

* `"name": "example1-vite-tutorial"`: This defines the name of your project on the Cloudflare network. This name will be part of the URL once it's
  deployed (e.g., example1-vite-tutorial.your-subdomain.workers.dev).

* `"compatibility_date": "2025-04-03"`: This is a crucial setting for stability. It locks your worker to a specific version of the Cloudflare Workers
  runtime. This prevents any future updates to the runtime from breaking your deployed code.

* `"main": "./worker/index.ts"`: This tells Wrangler that the entry point for your server-side worker logic is the file index.ts located inside the
  worker directory.

* `"assets": { "not_found_handling": "single-page-application" }`: This section configures how your frontend's static files are handled.
    * The "single-page-application" setting is vital for React/Vite applications. It tells Cloudflare: "If a request comes in for a path that doesn't
      match a static file (e.g., a user directly visits your-app.com/some/route), don't return a 404 Not Found error. Instead, serve the index.html
      file." This allows your React application to load and handle the routing on the client-side, which is how all Single-Page Applications (SPAs)
      work.

## Build and Deploy
```bash
# install dependencies
npm install

# start developmennt server
npm run dev

# build and deploy
npm run build

# preview the build
npm run preview

# run "wrangler deploy" underneath
npm run deploy

# Monitor your workers:
npx wrangler tail
```
Here's a more detailed breakdown of the process:

1. You run `npm run build`:
    * Vite compiles your TypeScript/React code from the src folder into highly optimized, plain JavaScript and CSS.
    * The @cloudflare/vite-plugin compiles your worker code from the worker folder into a single JavaScript file.
    * All of these optimized files, along with your index.html and anything from the public folder, are placed into the dist directory.

2. You run `wrangler deploy`:
    * Wrangler takes the contents of the dist folder and uploads them to Cloudflare.
    * The static assets (HTML, CSS, JS, images) are deployed to Cloudflare Pages.
    * The worker script is deployed to the Cloudflare Workers runtime.

All of your source code (src/, worker/), configuration files (vite.config.ts, tsconfig.json, etc.), and the node_modules directory are not shipped. They
are only necessary on your local machine for development and for building the final production-ready assets in the dist folder.

## Build Process in Detail
That's the magic of a build tool like Vite. The components and files inside your src directory undergo a complete transformation to become optimized for production.

Here's what happens to them:

### TypeScript and JSX Files (.tsx)
Your React components, written in TypeScript with JSX, are converted into plain, standard JavaScript that any modern browser can understand. This process involves:

   * Transpilation: All TypeScript-specific syntax (like type annotations) is removed.
   * Compilation: The JSX syntax (e.g., <h 1>Hello</h 1>) is converted into regular JavaScript function calls (e.g., React.createElement('h1', null, 
     'Hello')).
   * Bundling: Vite analyzes all the import statements and combines all your separate component files into a single, highly optimized JavaScript file. This is crucial because it's much faster for a browser to download one large file than many small ones.
   * Minification: The final bundled JavaScript file is "minified," meaning all unnecessary characters like spaces, newlines, and comments are removed, and variable names are shortened. This makes the file size significantly smaller, leading to faster downloads for the user.

### CSS Files (.css)
Your CSS files (App.css, index.css) are also processed:

   * Bundling: They are combined into a single CSS file.
   * Minification: Just like with JavaScript, all unnecessary characters are removed to make the file as small as possible.

### Assets (images, fonts, etc.)
Assets imported into your components (like the react.svg in App.tsx) are processed as well. Vite gives them a unique filename with a "hash" (e.g.,react-a1b2c3d4.svg) and copies them to the dist/assets folder. The hashed filename ensures that if you change the image, users will download the new
version instead of loading an old, cached one.

### The Final Result

After the build, your entire src directory, which is organized for developer convenience, is transformed into a few optimized files inside the dist
folder. These files are completely different from your source code and are designed to give the end-user the fastest possible loading experience.








