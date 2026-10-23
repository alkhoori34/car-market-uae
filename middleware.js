// Vercel Routing Middleware.
// - The home page "/" would otherwise be served straight from the static
//   index.html (static files win over vercel.json rewrites), so Google would
//   see an empty page. This sends "/" to the same server renderer as the
//   other pages; React takes over in the browser.
// - English pages live under /en (/en, /en/used-cars/toyota, /en/car/<id> …):
//   they go to the same renderer with lang=en.
export const config = { matcher: ["/", "/en", "/en/:path*"] };

export default function middleware(request) {
  const incoming = new URL(request.url);
  const en = /^\/en(\/|$)/.test(incoming.pathname);
  const route = en ? incoming.pathname.replace(/^\/en/, "") || "/" : "/";
  const url = new URL("/api/page", request.url);
  incoming.searchParams.forEach((v, k) => { if (k !== "route" && k !== "lang") url.searchParams.set(k, v); });
  url.searchParams.set("route", decodeURIComponent(route));
  if (en) url.searchParams.set("lang", "en");
  return new Response(null, { headers: { "x-middleware-rewrite": url.toString() } });
}
