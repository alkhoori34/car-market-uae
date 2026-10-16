// Helpers shared by the server functions in api/. Files starting with "_"
// are not exposed as routes by Vercel.

// Same values the browser app uses; Vercel exposes project env vars to
// functions regardless of the VITE_ prefix.
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Listings with this many reports are hidden on the site; keep in sync with
// REPORT_THRESHOLD in src/App.jsx.
export const REPORT_THRESHOLD = 3;

export const LISTING_FIELDS =
  "id,make,model,body_type,year,price,previous_price,negotiable,mileage,city,fuel,trans,condition,specs,steering,description,seller_name,image,images,created_at,sold,dealer_id";

// Queries Supabase's REST API. `params` is an array of [key, value] pairs so
// the same column can be filtered twice. Returns { rows, total }.
// By default only live listings: not sold and not past their expiry date
// (pass { live: false } for a single car page, which explains a sold car).
export async function queryListings(params, { count = false, live = true } = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Supabase env vars missing");
  const liveFilters = live
    ? [["sold", "eq.false"], ["or", `(expires_at.is.null,expires_at.gt.${new Date().toISOString()})`]]
    : [];
  const qs = new URLSearchParams([["reports_count", `lt.${REPORT_THRESHOLD}`], ...liveFilters, ...params]);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/listings?${qs}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      ...(count ? { Prefer: "count=exact" } : {}),
    },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  const rows = await res.json();
  let total = rows.length;
  const range = res.headers.get("content-range"); // e.g. "0-23/57"
  if (count && range && range.includes("/")) {
    const n = Number(range.split("/")[1]);
    if (!Number.isNaN(n)) total = n;
  }
  return { rows, total };
}

// Reads any other public table (e.g. dealers) through the same REST API.
export async function queryTable(table, params) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Supabase env vars missing");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${new URLSearchParams(params)}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.json();
}

// The built index.html (with Vite's hashed script and CSS names). It is read
// from the function's own bundle (vercel.json includeFiles "dist/index.html"),
// so a page always points at this deployment's script and CSS. Fetching it
// over the network could return the previous deployment's copy right after a
// deploy, and that page then loaded a script that no longer exists (blank,
// unstyled site for several minutes). The network fetch is only a fallback.
let shellCache = { html: null, at: 0, host: "" };
let bundledShell;
async function readBundledShell() {
  if (bundledShell !== undefined) return bundledShell;
  bundledShell = null;
  try {
    const { readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    for (const p of [join(process.cwd(), "dist", "index.html"), new URL("../dist/index.html", import.meta.url)]) {
      try {
        const html = await readFile(p, "utf8");
        if (html.includes("/assets/")) { bundledShell = html; break; }
      } catch {}
    }
  } catch {}
  return bundledShell;
}
export async function getShell(req) {
  const bundled = await readBundledShell();
  if (bundled) return bundled;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const fresh = shellCache.html && shellCache.host === host && Date.now() - shellCache.at < 60 * 1000;
  if (fresh) return shellCache.html;
  const proto = (req.headers["x-forwarded-proto"] || "https").split(",")[0];
  const res = await fetch(`${proto}://${host}/index.html?shell=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`index.html ${res.status}`);
  const html = await res.text();
  shellCache = { html, at: Date.now(), host };
  return html;
}

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ESC[c]);

// JSON inside <script> must not be able to close the tag.
export const jsonLd = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

export const fmt = (n) => new Intl.NumberFormat("ar-AE").format(Number(n) || 0);

export function photo(l) {
  return l.image || (Array.isArray(l.images) ? l.images[0] : null) || null;
}

// Puts the page's own <head> tags and server-rendered body into the shell.
// React replaces the #root content as soon as the app starts.
// Shown by WhatsApp, Facebook etc. when a page has no car photo of its own.
const DEFAULT_IMAGE = "https://carsuae.net/og-image.png";

export function fillShell(shell, { title, description, canonical, image, noindex, headExtra = "", body }) {
  const ownImage = Boolean(image);
  image = image || DEFAULT_IMAGE;
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    `<link rel="canonical" href="${esc(canonical)}">`,
    noindex ? `<meta name="robots" content="noindex, follow">` : "",
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="CarsUAE">`,
    `<meta property="og:locale" content="ar_AE">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${esc(canonical)}">`,
    `<meta property="og:image" content="${esc(image)}">`,
    `<meta name="twitter:card" content="${ownImage ? "summary_large_image" : "summary"}">`,
    headExtra,
  ].filter(Boolean).join("\n    ");

  return shell
    // Drop the shell's own title/description/canonical/og tags so nothing is duplicated.
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+(name="description"|property="og:[^"]*"|name="twitter:[^"]*")[^>]*>\s*/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, "")
    .replace(/<\/head>/i, `    ${head}\n  </head>`)
    .replace(/<div id="root"><\/div>/i, `<div id="root">${body}</div>`);
}

export function send(res, status, html, { cache = true } = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  // Cache at Vercel's edge for 5 minutes and serve stale for 10 more while
  // refreshing, so new listings show up within minutes without hitting
  // Supabase on every visit.
  res.setHeader("Cache-Control", cache ? "public, s-maxage=300, stale-while-revalidate=600" : "no-store");
  res.end(html);
}
