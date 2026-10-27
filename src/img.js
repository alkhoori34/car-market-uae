// Photo URLs for the app (src/App.jsx) and the server pages (api/page.js).
//
// Since 2026-10-27 the site runs on Cloudflare Workers. Supabase Storage is
// slow from the UAE (1–4 s per photo) and uploads are full size, so public
// storage photos go through our own route /img/<path>?w=<width>:
// worker/index.js resizes them with Cloudflare Image Transformations (WebP,
// quality 75; free up to 5,000 new sizes a month, then it falls back to the
// original file) and keeps the result in Cloudflare's edge cache for a year
// (file names never change). vercel.json has a plain /img rewrite for the old
// host. Other photos (public/l/..., blob: previews) are used as they are.

export const IMG_WIDTHS = [384, 640, 1080];
const STORAGE_PREFIX = "https://bfdyxoycbwlibzcovxef.supabase.co/storage/v1/object/public/";

function isLocalDev() {
  return typeof window !== "undefined" && /^(localhost|127\.)/.test(window.location.hostname);
}

export function imgSrc(src, width = 640) {
  if (!src || typeof src !== "string" || isLocalDev()) return src;
  if (!src.startsWith(STORAGE_PREFIX)) return src;
  const w = IMG_WIDTHS.find((x) => x >= width) || IMG_WIDTHS[IMG_WIDTHS.length - 1];
  return `/img/${src.slice(STORAGE_PREFIX.length)}?w=${w}`;
}

// srcset for responsive <img>, e.g. imgSrcSet(src, [384, 640]).
export function imgSrcSet(src, widths = [384, 640]) {
  const first = imgSrc(src, widths[0]);
  if (!first || first === src) return undefined;
  const ws = [...new Set(widths.map((w) => IMG_WIDTHS.find((x) => x >= w) || IMG_WIDTHS[IMG_WIDTHS.length - 1]))];
  return ws.map((w) => `${imgSrc(src, w)} ${w}w`).join(", ");
}
