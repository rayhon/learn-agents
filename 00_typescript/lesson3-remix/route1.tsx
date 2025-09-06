// In real life: from "@remix-run/node"
import type { Loader } from "./framework";

const loader: Loader = async ({request, params}) => {
    if (params.slug === "secret") {
        // We must return a `Response`. This is valid.
        return new Response("Access Denied", { status: 403 });
    }
    
    // We must return a `Response`. This is also valid.
    // The `json()` helper in Remix just creates a `Response` for you.
    return new Response(JSON.stringify({ data: "some public data" }), {
        headers: { "Content-Type": "application/json" },
    });
};

export {loader};