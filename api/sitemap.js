// /sitemap.xml: every page Google should know about. Category pages are only
// listed while they have at least one listing.

import { SITE_URL, BUDGET_STEPS, MAKE_SLUGS, CITY_SLUGS, MIN_MODEL_LISTINGS, paths, modelSlug, langPath } from "../src/seo-data.js";
import { queryListings, queryTable, esc } from "./_lib.js";
import { ARTICLES } from "../src/articles.js";
import { INFO_PAGES } from "../src/legal.js";

export default async function handler(req, res) {
  try {
    // Supabase returns at most 1,000 rows per request, so page through
    // (seen 2026-11-14: the sitemap listed exactly 1,000 of ~1,580 live cars).
    // Hidden duplicates are left out, like the browse page does.
    const rows = [];
    for (let offset = 0; offset < 50000; offset += 1000) {
      const { rows: page } = await queryListings([
        ["select", "id,make,model,city,price,created_at,dealer_id"],
        ["duplicate", "not.is.true"],
        ["order", "created_at.desc,id.desc"],
        ["limit", "1000"],
        ["offset", String(offset)],
      ]);
      rows.push(...page);
      if (page.length < 1000) break;
    }

    const day = (ts) => (ts ? new Date(ts).toISOString().slice(0, 10) : undefined);
    const newest = day(rows[0] && rows[0].created_at);
    const latestFor = (pred) => day((rows.find(pred) || {}).created_at);

    const urls = [
      { loc: "/", lastmod: newest, priority: "1.0" },
      { loc: paths.all(), lastmod: newest, priority: "0.9" },
      { loc: paths.vin(), priority: "0.7" },
    ];
    // Every page also has an English copy under /en.
    urls.push(...[
      { loc: paths.blog(), lastmod: ARTICLES[0] && ARTICLES[0].date, priority: "0.7" },
      ...ARTICLES.map((a) => ({ loc: paths.article(a.slug), lastmod: a.updated || a.date, priority: "0.7" })),
      ...Object.values(INFO_PAGES).map((pg) => ({ loc: pg.path, priority: pg.priority || "0.3" })),
    ]);
    const makes = [...new Set(rows.map((r) => r.make))].filter((m) => MAKE_SLUGS[m]);
    const cities = [...new Set(rows.map((r) => r.city))].filter((c) => CITY_SLUGS[c]);
    makes.forEach((m) => urls.push({ loc: paths.make(m), lastmod: latestFor((r) => r.make === m), priority: "0.8" }));
    cities.forEach((c) => urls.push({ loc: paths.city(c), lastmod: latestFor((r) => r.city === c), priority: "0.8" }));
    BUDGET_STEPS.forEach((b) => {
      if (rows.some((r) => Number(r.price) <= b)) urls.push({ loc: paths.budget(b), lastmod: latestFor((r) => Number(r.price) <= b), priority: "0.7" });
    });
    // Model pages only once they have a few cars (thinner ones are noindex).
    const pairs = new Map();
    rows.forEach((r) => {
      if (!MAKE_SLUGS[r.make] || !modelSlug(r.model)) return;
      const k = paths.model(r.make, r.model);
      const p = pairs.get(k) || { r, n: 0 };
      p.n += 1;
      pairs.set(k, p);
    });
    pairs.forEach(({ r, n }, loc) => { if (n >= MIN_MODEL_LISTINGS) urls.push({ loc, lastmod: latestFor((x) => x.make === r.make && x.model === r.model), priority: "0.7" }); });
    const dealers = await queryTable("dealers", [["select", "id,slug"]]).catch(() => []);
    dealers.forEach((d) => { if (rows.some((r) => r.dealer_id === d.id)) urls.push({ loc: paths.dealer(d.slug), lastmod: latestFor((r) => r.dealer_id === d.id), priority: "0.6" }); });
    // English copies: only the main pages (home, browse, makes, cities,
    // budgets, VIN check, articles, info pages). The /en car, model and dealer
    // pages stay reachable through hreflang links but are not listed, so the
    // sitemap of a new site isn't doubled with machine-translated copies.
    urls.push(...urls.filter((u) => !/^\/(used-cars\/(?!in\/|under\/)[^/]+\/|dealer\/)/.test(u.loc))
      .map((u) => ({ ...u, loc: langPath(u.loc, true), priority: (Number(u.priority) * 0.8).toFixed(1) })));
    rows.forEach((r) => urls.push({ loc: paths.car(r.id), lastmod: day(r.created_at), priority: "0.6" }));

    // Car news (Arabic only, so no /en copies).
    const news = await queryTable("news", [["select", "slug,published_at"], ["published", "eq.true"], ["order", "published_at.desc"], ["limit", "1000"]]).catch(() => []);
    if (news.length) {
      urls.push({ loc: paths.news(), lastmod: day(news[0].published_at), priority: "0.7" });
      news.forEach((n) => urls.push({ loc: paths.newsItem(n.slug), lastmod: day(n.published_at), priority: "0.5" }));
    }

    // /sitemap-latest.xml (submitted to Search Console every day by the
    // Supabase function gsc-daily): the main pages plus anything new or
    // changed in the last 3 days, so Google gets a short, fresh list.
    let list = urls;
    if (/sitemap-latest/.test(req.url || "")) {
      const since = day(new Date(Date.now() - 3 * 86400e3));
      const core = /^\/(|used-cars|vin-check|blog|news|dealers|used-cars\/(in\/)?[^/]+)$/;
      list = urls.filter((u) => !/^\/en(\/|$)/.test(u.loc) && (core.test(u.loc) || (u.lastmod && u.lastmod >= since)));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${list.map((u) => `  <url><loc>${esc(SITE_URL + encodeURI(u.loc))}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`;
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.end(xml);
  } catch (err) {
    console.error("sitemap", err);
    res.statusCode = 500;
    res.setHeader("Cache-Control", "no-store");
    res.end("sitemap unavailable");
  }
}
