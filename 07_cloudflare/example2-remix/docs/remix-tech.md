## Signature for a loader method
``` typescript
    1 import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
    2 // Note: The specific Response type can be imported from different packages
    3 // depending on the environment, but it's the standard Response object.
    4 import type { Response } from "@remix-run/node";
    5 
    6 export async function loader(
    7   { context, request, params }: LoaderFunctionArgs
    8 ): Promise<Response> { // <--- THIS IS THE EXPLICIT RETURN TYPE
    9   // ... your code
   10 }
```
* Exporting a function named loader means you are implementing a globally-defined interface.
* That global interface's contract is: "The function must accept LoaderFunctionArgs and must return a Promise<Response>."
* The flexibility comes from the fact that this interface only governs the "wrapper" (`Response`), not the specific shape of the JSON data inside the response body.


## Specify the actual return type at the module level
The name loader is a convention, not an implementation of a shared, central interface. Each route file is a completely separate, self-contained world.
Let's look at two different route files side-by-side.

  ---

  File 1: app/routes/tasks.tsx
```ts
    1 import { json } from "@remix-run/cloudflare";
    2 import { useLoaderData } from "@remix-run/react";
    3 import { getTasks, type Task } from "~/db"; // Fictional DB access
    4 
    5 // This loader's job is to return tasks.
    6 export async function loader() {
    7   const tasks = await getTasks();
    8   // Its data shape is { tasks: Task[] }
    9   return json({ tasks });
   10 }
   11 
   12 export default function TasksPage() {
   13   // `typeof loader` here refers ONLY to the loader IN THIS FILE.
   14   // It correctly infers the type as { tasks: Task[] }.
   15   const { tasks } = useLoaderData<typeof loader>();
   16 
   17   return (
   18     <ul>{/* ... render tasks ... */}</ul>
   19   );
   20 }
```
  ---

  File 2: app/routes/profile.tsx
```ts
    1 import { json } from "@remix-run/cloudflare";
    2 import { useLoaderData } from "@remix-run/react";
    3 import { getCurrentUser, type User } from "~/auth"; // Fictional auth access
    4 
    5 // This loader's job is to return a user.
    6 export async function loader() {
    7   const user = await getCurrentUser();
    8   // Its data shape is { user: User | null }
    9   return json({ user });
   10 }
   11 
   12 export default function ProfilePage() {
   13   // `typeof loader` here refers ONLY to the loader IN THIS FILE.
   14   // It correctly infers the type as { user: User | null }.
   15   // It has no knowledge of the loader in tasks.tsx.
   16   const { user } = useLoaderData<typeof loader>();
   17 
   18   return (
   19     <h1>Welcome, {user?.name}</h1>
   20   );
   21 }
```
  ---