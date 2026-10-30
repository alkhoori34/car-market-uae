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
import listings from "../api/listings.js";

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

// Pages say "Cache-Control: s-maxage=N, stale-while-revalidate=M". We keep
// them in Cloudflare's cache for N+M seconds; after N seconds the cached copy
// is still served at once and refreshed in the background (ctx.waitUntil), so
// a visitor almost never waits for Supabase (since 2026-10-30; before, every
// visit after the 5-minute window waited 0.5–2 s for a fresh render).
// Tracking parameters (utm_*, fbclid …) are dropped from the cache key so
// visitors from social links share the cached copy.
const KEEP_PARAMS = new Set(["page", "lang", "route", "w"]);
function cacheKey(request) {
  const u = new URL(request.url);
  const kept = [...u.searchParams].filter(([k]) => KEEP_PARAMS.has(k)).sort();
  u.search = kept.length ? "?" + new URLSearchParams(kept) : "";
  return new Request(u.toString(), { method: "GET" });
}
const STORED_AT = "x-cm-stored-at";
async function store(ctx, key, res, fresh, stale) {
  const copy = new Response(res.body, res);
  copy.headers.set("Cache-Control", `public, max-age=${fresh + stale}`);
  copy.headers.set(STORED_AT, String(Date.now()));
  copy.headers.set("x-cm-fresh", String(fresh));
  await caches.default.put(key, copy);
}
function forBrowser(res, extra) {
  const out = new Response(res.body, res);
  // Browsers should not keep server pages: new listings must show up.
  out.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  out.headers.delete(STORED_AT);
  out.headers.delete("x-cm-fresh");
  if (extra) out.headers.set("x-cm-cache", extra);
  return out;
}
async function cached(request, ctx, make) {
  if (request.method !== "GET") return make();
  const key = cacheKey(request);
  const hit = await caches.default.match(key);
  if (hit) {
    const age = (Date.now() - Number(hit.headers.get(STORED_AT) || 0)) / 1000;
    const fresh = Number(hit.headers.get("x-cm-fresh") || 300);
    if (age > fresh) {
      // Stale: answer now, refresh in the background.
      ctx.waitUntil((async () => {
        try {
          const res = await make();
          const m = (res.headers.get("Cache-Control") || "").match(/s-maxage=(\d+)(?:.*stale-while-revalidate=(\d+))?/);
          if (res.status === 200 && m) await store(ctx, key, res, Number(m[1]), Number(m[2] || 86400));
        } catch {}
      })());
      return forBrowser(hit, "stale");
    }
    return forBrowser(hit, "hit");
  }
  const res = await make();
  const m = (res.headers.get("Cache-Control") || "").match(/s-maxage=(\d+)(?:.*stale-while-revalidate=(\d+))?/);
  if (res.status === 200 && m) {
    const fresh = Number(m[1]);
    const stale = Math.max(Number(m[2] || 0), 86400);
    ctx.waitUntil(store(ctx, key, res.clone(), fresh, stale));
    return forBrowser(res, "miss");
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

    // Photos from Supabase Storage, cached at Cloudflare's edge for a year
    // (src/img.js rewrites storage URLs to /img/...). Only GET of public files.
    if (url.pathname.startsWith("/img/")) {
      if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", { status: 405 });
      const path = url.pathname.slice(5);
      if (!path || path.includes("..")) return new Response("Not found", { status: 404 });
      // ?w= picks a resized copy (WebP when the browser accepts it).
      const w = [384, 640, 1080].includes(Number(url.searchParams.get("w"))) ? Number(url.searchParams.get("w")) : 0;
      const webp = /image\/webp/.test(request.headers.get("Accept") || "");
      const cache = caches.default;
      const key = new Request(`https://carsuae.net/img/${path}?w=${w}&f=${w ? (webp ? "webp" : "jpeg") : "orig"}`);
      const hit = await cache.match(key);
      if (hit) return hit;
      const origin = `https://bfdyxoycbwlibzcovxef.supabase.co/storage/v1/object/public/${path}`;
      let src = null;
      if (w) {
        // Image Transformations (enabled on the carsuae.net zone). Over the
        // free monthly quota, or on workers.dev, it fails: use the original.
        try {
          const t = await fetch(origin, {
            cf: { image: { width: w, fit: "scale-down", quality: 75, format: webp ? "webp" : "jpeg" }, cacheEverything: true, cacheTtl: 31536000 },
          });
          if (t.ok && (t.headers.get("content-type") || "").startsWith("image/") && !t.headers.get("cf-resized")?.includes("err=")) src = t;
        } catch {}
      }
      if (!src) src = await fetch(origin, { cf: { cacheEverything: true, cacheTtl: 31536000 } });
      if (!src.ok) return new Response(null, { status: src.status === 400 ? 404 : src.status });
      const res = new Response(src.body, src);
      for (const h of ["set-cookie", "x-robots-tag"]) res.headers.delete(h);
      res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
      res.headers.set("Access-Control-Allow-Origin", "*");
      res.headers.set("Vary", "Accept");
      ctx.waitUntil(cache.put(key, res.clone()));
      return res;
    }

    if (url.pathname === "/sitemap.xml") return cached(request, ctx, () => runNode(sitemap, request, q));
    if (url.pathname === "/api/listings") return cached(request, ctx, () => runNode(listings, request, q));
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
