// Vercel Routing Middleware. The home page "/" would otherwise be served
// straight from the static index.html (static files win over vercel.json
// rewrites), so Google would see an empty page. This sends "/" to the same
// server renderer as the other pages; React takes over in the browser.
export const config = { matcher: "/" };

export default function middleware(request) {
  const url = new URL("/api/page?route=/", request.url);
  return new Response(null, { headers: { "x-middleware-rewrite": url.toString() } });
}
