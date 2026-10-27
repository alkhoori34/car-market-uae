// Cloudflare Workers entry (since 2026-10-27; the site moved here from Vercel
// because Vercel's free plan paused it). It does what vercel.json rewrites +
// middleware.js did: server-rendered pages go to api/page.js, /sitemap.xml to
// api/sitemap.js, /api/vin to api/vin.js; everything else is a static file
// from dist/ (Vite build), with index.html as the single-page-app fallback.
// The api/*.js handlers are written for Vercel's Node (req, res) style, so a
// small adapter turns a fetch Request into req/res and back.

import page from "../api/page.js";
import sitemap from "../api/sitemap.js";
import vin from "../api/vin.js";

// Paths rendered on the server (same list as the vercel.json rewrites).
const PAGE_EXACT = new Set([
  "/", "/used-cars", "/sell", "/faq", "/safety", "/dealers", "/about", "/terms",
  "/privacy", "/contact", "/blog", "/vin-check",
]);
const PAGE_PREFIX = ["/used-cars/", "/car/", "/blog/", "/dealer/"];

function pageRoute(pathname) {
  let path = pathname;
  let en = false;
  if (path === "/en" || path.startsWith("/en/")) {
    en = true;
    path = path.slice(3) || "/";
  }
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  if (en || PAGE_EXACT.has(path) || PAGE_PREFIX.some((p) => path.startsWith(p))) {
    return { route: path, en };
  }
  return null;
}

// Runs a Vercel-style handler(req, res) and returns a fetch Response.
function runNode(handler, request, query) {
  return new Promise((resolve) => {
    const headers = {};
    request.headers.forEach((v, k) => { headers[k] = v; });
    const url = new URL(request.url);
    headers.host = headers.host || url.host;
    headers["x-forwarded-host"] = headers["x-forwarded-host"] || url.host;
    headers["x-forwarded-proto"] = headers["x-forwarded-proto"] || url.protocol.replace(":", "");
    const req = { method: request.method, url: url.pathname + url.search, headers, query };
    const out = new Headers();
    let status = 200;
    let done = false;
    const finish = (body) => {
      if (done) return;
      done = true;
      resolve(new Response(request.method === "HEAD" ? null : body ?? null, { status, headers: out }));
    };
    const res = {
      get statusCode() { return status; },
      set statusCode(v) { status = v; },
      setHeader: (k, v) => out.set(k, String(v)),
      getHeader: (k) => out.get(k),
      removeHeader: (k) => out.delete(k),
      status(code) { status = code; return res; },
      end: finish,
      send: finish,
      json(obj) { out.set("Content-Type", "application/json; charset=utf-8"); finish(JSON.stringify(obj)); },
      redirect(a, b) { const [code, loc] = typeof a === "number" ? [a, b] : [302, a]; status = code; out.set("Location", loc); finish(null); },
    };
    Promise.resolve()
      .then(() => handler(req, res))
      .catch((err) => {
        console.error("handler", err);
        if (!done) { status = 500; out.set("Cache-Control", "no-store"); finish("Server error"); }
      });
  });
}

// Pages say "Cache-Control: s-maxage=…" (meant for Vercel's edge). Keep that
// behaviour with Cloudflare's cache so busy pages don't hit Supabase each time.
async function cached(request, ctx, make) {
  if (request.method !== "GET") return make();
  const cache = caches.default;
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await make();
  const cc = res.headers.get("Cache-Control") || "";
  const m = cc.match(/s-maxage=(\d+)/);
  if (res.status === 200 && m) {
    const copy = new Response(res.clone().body, res);
    copy.headers.set("Cache-Control", `public, max-age=${m[1]}`);
    ctx.waitUntil(cache.put(request, copy));
    // Browsers should not keep server pages: new listings must show up.
    const out = new Response(res.body, res);
    out.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    return out;
  }
  return res;
}

export default {
  async fetch(request, env, ctx) {
    // api/_lib.js reads the built index.html through this.
    globalThis.__CF_ASSETS = env.ASSETS;
    const url = new URL(request.url);
    const q = Object.fromEntries(url.searchParams);

    // www → bare domain (one canonical host for Google).
    if (url.hostname === "www.carsuae.net") {
      url.hostname = "carsuae.net";
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === "/sitemap.xml") return cached(request, ctx, () => runNode(sitemap, request, q));
    if (url.pathname === "/api/vin") return runNode(vin, request, q);
    if (url.pathname === "/api/page") return cached(request, ctx, () => runNode(page, request, q));
    if (url.pathname === "/api/sitemap") return cached(request, ctx, () => runNode(sitemap, request, q));

    const pr = (request.method === "GET" || request.method === "HEAD") && pageRoute(url.pathname);
    if (pr) {
      const query = { ...q, route: decodeURIComponent(pr.route) };
      delete query.lang;
      if (pr.en) query.lang = "en";
      return cached(request, ctx, () => runNode(page, request, query));
    }

    // Static files; unknown paths get index.html (the React app routes them).
    return env.ASSETS.fetch(request);
  },
};
