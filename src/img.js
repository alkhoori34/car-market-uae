// Image URLs through Vercel's image optimizer (/_vercel/image), so phones get
// a small WebP/AVIF instead of the full-size upload. Allowed sizes and source
// hosts are set in vercel.json "images"; keep IMG_WIDTHS in sync with it.
// Shared by the app (src/App.jsx) and the server pages (api/page.js).

export const IMG_WIDTHS = [384, 640, 828, 1080, 1600];
const SUPABASE_HOST = "bfdyxoycbwlibzcovxef.supabase.co";
const LOCAL_DIRS = ["/l/", "/listings/", "/media/"]; // keep in sync with vercel.json

// Returns the optimizer URL for an image, or the original URL when the image
// cannot go through it (blob: previews, unknown hosts, local dev).
// Supabase Storage answers slowly from the UAE (often 1–4 s per photo), so
// public photos go through our own /img/<path> route: worker/index.js fetches
// them once and keeps them in Cloudflare's edge cache for a year (file names
// never change). vercel.json has the same /img rewrite for the old host.
const STORAGE_PREFIX = `https://${"bfdyxoycbwlibzcovxef.supabase.co"}/storage/v1/object/public/`;
function viaEdge(src) {
  if (typeof window !== "undefined" && /^(localhost|127\.)/.test(window.location.hostname)) return src;
  return src.startsWith(STORAGE_PREFIX) ? `/img/${src.slice(STORAGE_PREFIX.length)}` : src;
}

// Since 2026-10-27 the site runs on Cloudflare (no /_vercel/image there), so
// photos are served as uploaded. Set IMG_OPTIMIZER = true only on Vercel.
const IMG_OPTIMIZER = false;

export function imgSrc(src, width = 640, quality = 70) {
  if (!src || typeof src !== "string") return src;
  if (!IMG_OPTIMIZER) return viaEdge(src);
  if (typeof window !== "undefined" && /^(localhost|127\.)/.test(window.location.hostname)) return src;
  let path = src;
  const own = src.match(/^https?:\/\/(?:www\.)?carsuae\.net(\/.*)$/);
  if (own) path = own[1];
  else if (/^https?:\/\//.test(src) && !src.includes(SUPABASE_HOST)) return src;
  else if (!/^https?:\/\//.test(src) && !src.startsWith("/")) return src;
  // Only folders listed in vercel.json images.localPatterns may be optimized;
  // anything else would come back as a 400 and a broken photo.
  if (path.startsWith("/") && !LOCAL_DIRS.some((d) => path.startsWith(d))) return src;
  const w = IMG_WIDTHS.find((x) => x >= width) || IMG_WIDTHS[IMG_WIDTHS.length - 1];
  return `/_vercel/image?url=${encodeURIComponent(path)}&w=${w}&q=${quality}`;
}

// srcset for responsive <img>, e.g. imgSrcSet(src, [384, 640, 828]).
export function imgSrcSet(src, widths = [384, 640, 828]) {
  if (!IMG_OPTIMIZER) return undefined;
  const first = imgSrc(src, widths[0]);
  if (first === src) return undefined;
  return widths.map((w) => `${imgSrc(src, w)} ${w}w`).join(", ");
}
