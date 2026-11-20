// gsc-daily — runs every morning from pg_cron (job gsc-daily), no computer needed.
// 1. Re-submits https://carsuae.net/sitemap-latest.xml and /sitemap.xml to
//    Google Search Console (allowed API; Google re-reads them and finds new pages).
//    Needs the service account to be a FULL user in Search Console; while it is
//    only "restricted" the submit returns 403 and is logged.
// 2. Inspects the key pages (home, browse, makes, cities, guides, news, newest
//    cars) with the URL Inspection API and stores the result in
//    public.gsc_index_status, so the weekly report can say what Google indexed.
// Google's «Request indexing» button has no allowed API (Indexing API = jobs and
// livestreams only), so this is the closest safe automation.
// Secret: GSC_SA_KEY (service-account JSON). Auth: x-cron-secret.

import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const SITE = "sc-domain:carsuae.net";
const ORIGIN = "https://carsuae.net";
const SITEMAPS = [`${ORIGIN}/sitemap-latest.xml`, `${ORIGIN}/sitemap.xml`];
const MAX_INSPECT = 90; // URL Inspection quota is 2,000/day per site
const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "content-type": "application/json" } });
const b64url = (buf: ArrayBuffer | string) => {
  const bytes = typeof buf === "string" ? new TextEncoder().encode(buf) : new Uint8Array(buf);
  let s = ""; for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

async function accessToken(scope: string): Promise<string> {
  const raw = Deno.env.get("GSC_SA_KEY");
  if (!raw) throw new Error("GSC_SA_KEY missing");
  const sa = JSON.parse(raw);
  const pem = sa.private_key.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const now = Math.floor(Date.now() / 1000);
  const aud = sa.token_uri || "https://oauth2.googleapis.com/token";
  const unsigned = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" })) + "." + b64url(JSON.stringify({ iss: sa.client_email, scope, aud, iat: now, exp: now + 3600 }));
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const r = await fetch(aud, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: unsigned + "." + b64url(sig) }) });
  const j = await r.json();
  if (!r.ok) throw new Error(`token ${r.status}: ${j.error ?? ""} ${j.error_description ?? ""}`);
  return j.access_token;
}

const api = (path: string) => `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}${path}`;

async function inspect(tok: string, url: string) {
  const r = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST", headers: { authorization: `Bearer ${tok}`, "content-type": "application/json" },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) return { url, error: `${r.status}: ${j?.error?.message ?? "unknown"}` };
  const s = j.inspectionResult?.indexStatusResult || {};
  return { url, verdict: s.verdict, coverage: s.coverageState, last_crawl: s.lastCrawlTime || null, google_canonical: s.googleCanonical || null };
}

const kindOf = (u: string) => {
  const p = new URL(u).pathname;
  if (p === "/") return "home";
  if (p.startsWith("/car/")) return "car";
  if (p.startsWith("/news")) return "news";
  if (p.startsWith("/blog")) return "article";
  if (p.startsWith("/dealer")) return "dealer";
  if (p.startsWith("/used-cars")) return "category";
  return "page";
};

Deno.serve(async (req) => {
  const { data: ok } = await sb.rpc("check_ig_fetch_secret", { s: req.headers.get("x-cron-secret") || "" });
  if (ok !== true) return json({ error: "unauthorized" }, 401);
  const out: Record<string, unknown> = {};
  try {
    // --- 1. permission + sitemap submit (needs write scope)
    const wtok = await accessToken("https://www.googleapis.com/auth/webmasters");
    const site = await fetch(api(""), { headers: { authorization: `Bearer ${wtok}` } }).then((r) => r.json()).catch(() => ({}));
    out.permission = site.permissionLevel || site.error?.message || "unknown";
    out.submitted = [];
    for (const sm of SITEMAPS) {
      const r = await fetch(api(`/sitemaps/${encodeURIComponent(sm)}`), { method: "PUT", headers: { authorization: `Bearer ${wtok}` } });
      const t = r.ok ? "" : (await r.json().catch(() => ({})))?.error?.message ?? "";
      (out.submitted as unknown[]).push({ sitemap: sm.replace(ORIGIN, ""), status: r.status, error: t || undefined });
    }

    // --- 2. pick URLs: every non-car page in the latest sitemap, then newest cars
    const xml = await fetch(`${ORIGIN}/sitemap-latest.xml`).then((r) => r.text());
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
    const nonCar = locs.filter((u) => kindOf(u) !== "car");
    const cars = locs.filter((u) => kindOf(u) === "car");
    // Skip pages already indexed and re-checked within 7 days, to spend the quota on the rest.
    const { data: known } = await sb.from("gsc_index_status").select("url,verdict,checked_at,first_indexed_at");
    const fresh = new Set((known || []).filter((k) => k.verdict === "PASS" && Date.now() - new Date(k.checked_at).getTime() < 7 * 86400e3).map((k) => k.url));
    const pick = [...nonCar, ...cars].filter((u) => !fresh.has(decodeURI(u))).slice(0, MAX_INSPECT);

    // --- 3. inspect (8 at a time)
    const rtok = await accessToken("https://www.googleapis.com/auth/webmasters.readonly");
    const results: any[] = [];
    for (let i = 0; i < pick.length; i += 8) results.push(...await Promise.all(pick.slice(i, i + 8).map((u) => inspect(rtok, decodeURI(u)))));
    const good = results.filter((r) => !r.error);
    const prev = new Map((known || []).map((k) => [k.url, k]));
    if (good.length) {
      await sb.from("gsc_index_status").upsert(good.map((r) => ({
        url: r.url, kind: kindOf(r.url), verdict: r.verdict, coverage: r.coverage, last_crawl: r.last_crawl,
        google_canonical: r.google_canonical, checked_at: new Date().toISOString(),
        first_indexed_at: r.verdict === "PASS" ? ((prev.get(r.url) as any)?.first_indexed_at ?? new Date().toISOString()) : null,
      })), { onConflict: "url" });
    }
    const byCov: Record<string, number> = {};
    good.forEach((r) => { byCov[r.coverage || "?"] = (byCov[r.coverage || "?"] || 0) + 1; });
    out.inspected = good.length;
    out.errors = results.length - good.length;
    out.firstError = results.find((r) => r.error)?.error;
    out.coverage = byCov;
    const submitOk = (out.submitted as any[]).every((s) => s.status === 200 || s.status === 204);
    await sb.from("ops_runs").insert({ task: "gsc-daily", ok: submitOk && out.errors === 0, note: JSON.stringify(out).slice(0, 1500) });
    return json(out);
  } catch (e) {
    const msg = String((e as Error).message || e).slice(0, 400);
    await sb.from("ops_runs").insert({ task: "gsc-daily", ok: false, note: msg });
    return json({ error: msg, ...out }, 500);
  }
});
