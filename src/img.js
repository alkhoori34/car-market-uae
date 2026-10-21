// Image URLs through Vercel's image optimizer (/_vercel/image), so phones get
// a small WebP/AVIF instead of the full-size upload. Allowed sizes and source
// hosts are set in vercel.json "images"; keep IMG_WIDTHS in sync with it.
// Shared by the app (src/App.jsx) and the server pages (api/page.js).

export const IMG_WIDTHS = [384, 640, 828, 1080, 1600];
const SUPABASE_HOST = "bfdyxoycbwlibzcovxef.supabase.co";
const LOCAL_DIRS = ["/l/", "/listings/", "/media/"]; // keep in sync with vercel.json

// Returns the optimizer URL for an image, or the original URL when the image
// cannot go through it (blob: previews, unknown hosts, local dev).
export function imgSrc(src, width = 640, quality = 70) {
  if (!src || typeof src !== "string") return src;
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
  const first = imgSrc(src, widths[0]);
  if (first === src) return undefined;
  return widths.map((w) => `${imgSrc(src, w)} ${w}w`).join(", ");
}
