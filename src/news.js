// آخر الأخبار (since 2026-11-14): car news written daily by a scheduled task
// into the Supabase table public.news (slug, title, excerpt, body, image_url,
// image_credit, category, source_name, source_url, published, published_at).
// The body is light markdown ("## " subheadings, "- " list lines, blank lines
// between paragraphs). newsBlocks() turns it into the same block list the
// articles use, so React (ArticleBlocks) and api/page.js (blocksHtml) render
// news exactly like articles. News exists in Arabic only.

export const NEWS_FIELDS = "slug,title,excerpt,body,image_url,image_credit,category,source_name,source_url,published_at";
export const NEWS_LIST_FIELDS = "slug,title,excerpt,image_url,category,published_at";

// Badge colour class per category (unknown categories use the muted one).
export const NEWS_CATEGORY_CLASS = {
  "أخبار": "cm-badge-blue",
  "سيارات جديدة": "cm-badge-mint",
  "قوانين ومرور": "cm-badge-red",
  "أسعار": "cm-badge-muted",
};

export function newsBlocks(md) {
  const blocks = [];
  let list = null;
  const flush = () => { if (list) { blocks.push(["ul", list]); list = null; } };
  String(md || "").replace(/\r/g, "").split(/\n/).forEach((raw) => {
    const line = raw.trim();
    if (!line) { flush(); return; }
    // The source line is shown separately under the article.
    if (/^المصدر\s*[:：]/.test(line)) { flush(); return; }
    let m;
    if ((m = line.match(/^#{2,3}\s+(.+)$/))) { flush(); blocks.push(["h2", m[1]]); return; }
    if ((m = line.match(/^[-*•]\s+(.+)$/))) { (list = list || []).push(stripMd(m[1])); return; }
    flush();
    blocks.push(["p", stripMd(line)]);
  });
  flush();
  return blocks;
}

// Drops markdown emphasis and turns [text](url) into "text".
function stripMd(s) {
  return s.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, "$1");
}

export function formatNewsDate(iso) {
  try {
    return new Intl.DateTimeFormat("ar-AE", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dubai" }).format(new Date(iso));
  } catch { return ""; }
}

// Only http(s) image URLs are shown.
export const newsImage = (n) => (n && /^https:\/\//.test(n.image_url || "") ? n.image_url : null);
