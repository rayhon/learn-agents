## Frameworks, SSR, CSR and SSG
When working with full-stack React frameworks, you will want to decide which rendering method is right for your project. Some offer better performance, while others give you more flexibility, interactivity, or better search engine optimization (SEO).

### SSR (server-side rendering)
SSR is a process where the server pre-renders the page on each request, then sends the complete page HTML to the client (that is, everything that is on the page is provided in the initial request, and nothing is loaded afterward). This approach is best for SEO, as the content is present immediately for the search engine to index. It is also good for websites that focus on performance. Both Next.js and Remix offer this rendering method.

### CSR (client-side rendering)
With CSR, the server first sends a minimal HTML file, which the browser loads, and then the front end renders the page on the client’s device. This method is great for highly interactive apps, dashboards, and single-page applications (SPAs). Again, both Next.js and Remix offer this method.

### SSG (static site generation)
SSG is when pages are pre-built at compile time and served as static HTML. With no need for a back end on request, this option is great for fast-loading blogs, landing pages, and marketing sites, and it is highly performant and good for SEO. While Next.js offers this method, Remix currently does not officially support it.

