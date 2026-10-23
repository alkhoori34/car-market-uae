// Server-rendered pages for search engines and link previews:
//   /car/<id>                 one listing
//   /used-cars                all listings
//   /used-cars/<make>         e.g. /used-cars/toyota
//   /used-cars/in/<city>      e.g. /used-cars/in/dubai
//   /used-cars/under/<max>    e.g. /used-cars/under/50000
//   /used-cars/<make>/<model> e.g. /used-cars/lexus/ls
//   /dealer/<slug>            one dealer's cars
//   /vin-check                free VIN (رقم الشاصي) check tool
//   /blog, /blog/<slug>       articles (src/articles.js)
//   /terms /privacy /contact  info pages (src/legal.js)
//   /                         home page (sent here by middleware.js)
// Category pages take ?page=2, 3 … so every live car is reachable by links.
// vercel.json rewrites those paths here as ?route=<path>. Each response is the
// normal app shell with real <head> tags and the page content already in
// #root; the React app then takes over in the browser.

import { AsyncLocalStorage } from "node:async_hooks";
import {
  SITE_URL, SITE_NAME, BUDGET_STEPS, MAKE_SLUGS, CITY_SLUGS,
  parsePath, paths, categoryCopy as categoryCopyAr, carCopy as carCopyAr, carTitle as carTitleAr, modelSlug, langPath,
} from "../src/seo-data.js";
import { translate } from "../src/i18n.js";
import { articlesIn, articleIn, articleBySlug, formatArticleDate as formatArticleDateIn } from "../src/articles.js";
import { imgSrc, imgSrcSet } from "../src/img.js";
import { infoPageIn, CONTACT_EMAIL, LEGAL_UPDATED } from "../src/legal.js";
import {
  LISTING_FIELDS, queryListings, queryTable, getShell, fillShell as fillShellBase, send, esc, jsonLd, fmt, photo,
} from "./_lib.js";

// English pages (/en/...): the same pages rendered in English. The language
// of the current request is kept in async context so every helper below can
// ask EN() without passing it around.
const langCtx = new AsyncLocalStorage();
const EN = () => Boolean(langCtx.getStore() && langCtx.getStore().en);
const T = (ar, en) => (EN() ? en : ar);
const tr = (s) => (EN() ? translate(String(s ?? "")) : s);
const P = Object.fromEntries(Object.entries(paths).map(([k, f]) => [k, (...a) => langPath(f(...a), EN())]));
const formatArticleDate = (iso) => formatArticleDateIn(iso, EN());
const num = (n) => new Intl.NumberFormat("en-US").format(Number(n) || 0);
const carTitle = (l) => tr(carTitleAr(l));
const aed = (n) => T(`${fmt(n)} د.إ`, `AED ${num(n)}`);

function carCopy(l) {
  if (!EN()) return carCopyAr(l);
  const t = carTitle(l);
  const city = l.city ? translate(l.city) : "";
  const bits = [l.year && `model ${l.year}`, l.mileage ? `${num(l.mileage)} km` : null, l.specs && `${translate(l.specs)} specs`, city && `in ${city}`].filter(Boolean);
  return {
    title: `${t} for sale${l.price ? ` – AED ${num(l.price)}` : ""}${city ? ` in ${city}` : ""} | ${SITE_NAME}`,
    description: `${t} for sale${l.price ? ` at AED ${num(l.price)}` : ""}, ${bits.join(", ")}. Contact the seller directly on ${SITE_NAME}.`,
  };
}

function categoryCopy(route, count) {
  if (!EN()) return categoryCopyAr(route, count);
  const n = count ? `${num(count)} ` : "";
  const make = route.make ? translate(route.make) : "";
  switch (route.kind) {
    case "model": {
      const name = `${make} ${translate(route.model || "")}`.trim();
      return { h1: `Used ${name} for sale in the UAE`, title: `Used ${name} for sale in the UAE | ${SITE_NAME}`,
        description: `Browse ${n}used ${name} cars for sale in Abu Dhabi, Dubai, Sharjah and across the UAE. Compare prices, years and mileage, and contact the seller directly on ${SITE_NAME}.` };
    }
    case "dealer":
      return { h1: `Cars for sale from ${route.name || "this dealer"}`, title: `${route.name || "Dealer"} – cars for sale in the UAE | ${SITE_NAME}`,
        description: `All cars listed by ${route.name || "this dealer"}${route.verified ? `, a verified dealer on ${SITE_NAME}` : ""}. ${n ? `${n}cars ` : ""}with prices, specs and photos, and direct contact.` };
    case "make":
      return { h1: `Used ${make} for sale in the UAE`, title: `Used ${make} cars for sale in the UAE | ${SITE_NAME}`,
        description: `Browse ${n}used ${make} cars for sale in Dubai, Abu Dhabi, Sharjah and across the UAE. Prices, specs and photos, and direct contact with the seller on ${SITE_NAME}.` };
    case "city": {
      const city = translate(route.city);
      return { h1: `Used cars for sale in ${city}`, title: `Used cars for sale in ${city} | ${SITE_NAME}`,
        description: `${n ? `${n}used cars` : "Used cars"} for sale in ${city}, all makes. Compare prices, mileage and specs and contact the seller directly on ${SITE_NAME}.` };
    }
    case "budget":
      return { h1: `Used cars under AED ${num(route.max)}`, title: `Used cars under AED ${num(route.max)} in the UAE | ${SITE_NAME}`,
        description: `Used cars for sale under AED ${num(route.max)} in Dubai, Abu Dhabi and across the UAE. Browse ${n ? `${n}listings` : "the listings"} and contact the seller directly on ${SITE_NAME}.` };
    default:
      return { h1: "Used cars for sale in the UAE", title: `Used cars for sale in the UAE | ${SITE_NAME}`,
        description: `${SITE_NAME} used car marketplace in the UAE: ${n ? `${n}listings` : "listings"} straight from sellers in Dubai, Abu Dhabi, Sharjah and across the UAE. Sell your car for free.` };
  }
}

// Translates the short interface text left in a server-rendered body
// (makes, cities, specs …); seller descriptions stay as written.
const UNESC = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" };
const unesc = (s) => s.replace(/&(amp|lt|gt|quot|#39);/g, (m) => UNESC[m]);
const HAS_AR = /[\u0600-\u06FF]/;
function translateHtml(html) {
  return html
    .replace(/>([^<]+)</g, (m, t) => (HAS_AR.test(t) ? `>${esc(translate(unesc(t)))}<` : m))
    .replace(/\s(alt|aria-label|title)="([^"]*)"/g, (m, a, v) => (HAS_AR.test(v) ? ` ${a}="${esc(translate(unesc(v)))}"` : m));
}

// Adds hreflang links between the Arabic and English copy of a page and, for
// English, switches the shell to English (lang, dir, translated body).
// arOnly: pages that exist only in Arabic (articles, info pages).
function fillShell(shell, opts) {
  const en = EN();
  const rest = opts.canonical.slice(SITE_URL.length) || "/";
  const [pathPart, query = ""] = rest.split(/\?(.*)/s);
  const arPath = pathPart.replace(/^\/en(?=\/|$)/, "") || "/";
  const q = query ? `?${query}` : "";
  const arUrl = SITE_URL + arPath + q;
  const enUrl = SITE_URL + langPath(arPath, true) + q;
  const alt = opts.arOnly ? "" : [
    `<link rel="alternate" hreflang="ar" href="${esc(arUrl)}">`,
    `<link rel="alternate" hreflang="en" href="${esc(enUrl)}">`,
    `<link rel="alternate" hreflang="x-default" href="${esc(arUrl)}">`,
  ].join("");
  let html = fillShellBase(shell, {
    ...opts,
    canonical: en ? (opts.arOnly ? arUrl : enUrl) : arUrl,
    noindex: opts.noindex || (en && opts.arOnly),
    headExtra: alt + (opts.headExtra || ""),
    body: en && !opts.arOnly ? translateHtml(opts.body) : opts.body,
  });
  if (en && !opts.arOnly) {
    html = html
      .replace(/<html[^>]*>/i, '<html lang="en" dir="ltr" class="cm-en">')
      .replace('<meta property="og:locale" content="ar_AE">', '<meta property="og:locale" content="en_AE">');
  }
  return html;
}

const PAGE_SIZE = 48;

// Which makes and cities currently have listings, for the related-links block.
// Refreshed at most every five minutes per server instance.
let facetsCache = { at: 0, makes: [], cities: [] };
async function getFacets() {
  if (Date.now() - facetsCache.at < 5 * 60 * 1000) return facetsCache;
  const { rows } = await queryListings([["select", "make,city"], ["limit", "5000"]]);
  const tally = (key) => {
    const counts = {};
    rows.forEach((r) => { if (r[key]) counts[r[key]] = (counts[r[key]] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };
  facetsCache = {
    at: Date.now(),
    makes: tally("make").filter(([m]) => MAKE_SLUGS[m]),
    cities: tally("city").filter(([c]) => CITY_SLUGS[c]),
  };
  return facetsCache;
}

export default function handler(req, res) {
  const en = String((req.query && req.query.lang) || "") === "en";
  return langCtx.run({ en }, () => handle(req, res));
}

async function handle(req, res) {
  const raw = String((req.query && req.query.route) || "/used-cars");
  const route = raw === "/" ? { kind: "home" } : parsePath(raw);
  const page = Math.max(1, Math.min(500, parseInt((req.query && req.query.page) || "1", 10) || 1));

  let shell;
  try {
    shell = await getShell(req);
  } catch (err) {
    console.error("shell", err);
    return send(res, 500, "<!doctype html><title>CarsUAE</title><p>حدث خطأ مؤقت. حاول بعد قليل.</p>", { cache: false });
  }

  try {
    if (!route) return send(res, 404, notFound(shell, raw));
    if (route.kind === "home") return send(res, 200, await homePage(shell));
    if (route.kind === "car") return send(res, ...(await carPage(shell, route)));
    if (route.kind === "vin") return send(res, 200, vinPage(shell));
    if (route.kind === "blog") return send(res, 200, blogPage(shell));
    if (route.kind === "info") return send(res, 200, infoPage(shell, infoPageIn(route.page, EN())));
    if (route.kind === "article") {
      const a = articleIn(articleBySlug(route.slug), EN());
      return a ? send(res, 200, articlePage(shell, a)) : send(res, 404, notFound(shell, raw));
    }
    return send(res, ...(await categoryPage(shell, route, page)));
  } catch (err) {
    console.error("page", raw, err);
    // Fall back to the plain app so visitors still get a working page.
    return send(res, 200, shell, { cache: false });
  }
}

// --- One listing -----------------------------------------------------------

async function carPage(shell, route) {
  // Listing ids are UUIDs; anything else cannot match, so skip the query.
  if (!/^[0-9a-f-]{8,40}$/i.test(route.id)) return [404, notFound(shell, P.car(route.id))];
  const { rows } = await queryListings([["select", LISTING_FIELDS], ["id", `eq.${route.id}`], ["limit", "1"]], { live: false });
  const l = rows[0];
  if (!l) return [404, notFound(shell, P.car(route.id))];

  const url = SITE_URL + P.car(l.id);
  const copy = carCopy(l);
  // Other live cars of the same make (same model first), linked from the page.
  const { rows: sameMake } = await queryListings([
    ["select", LISTING_FIELDS], ["make", `eq.${l.make}`], ["id", `neq.${l.id}`],
    ["order", "created_at.desc"], ["limit", "24"],
  ]).catch(() => ({ rows: [] }));
  const similar = [...sameMake.filter((r) => r.model === l.model), ...sameMake.filter((r) => r.model !== l.model)].slice(0, 6);
  const gallery = (Array.isArray(l.images) && l.images.length ? l.images : [l.image]).filter(Boolean);
  const facts = [
    [T("سنة الصنع", "Year"), l.year],
    [T("الممشى", "Mileage"), l.mileage ? T(`${fmt(l.mileage)} كم`, `${num(l.mileage)} km`) : null],
    [T("المواصفات", "Specs"), l.specs],
    [T("ناقل الحركة", "Transmission"), l.trans],
    [T("الوقود", "Fuel"), l.fuel],
    [T("نوع السيارة", "Body type"), l.body_type],
    [T("جهة المقود", "Steering"), l.steering],
    [T("الحالة", "Condition"), l.condition],
    [T("الإمارة", "Emirate"), l.city],
  ].map(([k, v]) => [k, v || "-"]);

  const crumbs = [
    [T("الرئيسية", "Home"), P.home()],
    [T("سيارات مستعملة", "Used cars"), P.all()],
    MAKE_SLUGS[l.make] ? [tr(l.make), P.make(l.make)] : null,
    MAKE_SLUGS[l.make] && modelSlug(l.model) ? [tr(`${l.make} ${l.model}`), P.model(l.make, l.model)] : null,
    [carTitle(l), P.car(l.id)],
  ].filter(Boolean);

  const structured = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: carTitle(l),
    brand: { "@type": "Brand", name: tr(l.make) },
    model: tr(l.model),
    vehicleModelDate: l.year ? String(l.year) : undefined,
    mileageFromOdometer: l.mileage ? { "@type": "QuantitativeValue", value: l.mileage, unitCode: "KMT" } : undefined,
    fuelType: l.fuel || undefined,
    vehicleTransmission: l.trans || undefined,
    bodyType: l.body_type || undefined,
    itemCondition: l.condition === "جديدة" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
    image: gallery.length ? gallery : undefined,
    description: l.description || copy.description,
    url,
    offers: {
      "@type": "Offer",
      price: l.price ? Number(l.price) : undefined,
      priceCurrency: "AED",
      availability: l.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url,
      areaServed: tr(l.city) || T("الإمارات العربية المتحدة", "United Arab Emirates"),
    },
  };

  const body = `
${siteHeader()}
<main class="max-w-6xl mx-auto px-4 py-6">
  ${breadcrumbs(crumbs)}
  <article class="cm-card rounded-2xl overflow-hidden">
    ${gallery.length ? `<img src="${esc(gallery[0])}" alt="${esc(carTitle(l))}" class="w-full object-cover cm-aspect-16-9">` : ""}
    <div class="p-5">
      ${l.sold ? `<p class="cm-badge cm-badge-red mb-2">${T("تم بيع هذه السيارة", "This car has been sold")}</p>` : ""}<h1 class="cm-display font-extrabold text-2xl">${esc(carTitle(l))}${l.sold ? "" : T(" للبيع", " for sale")}</h1>
      <p class="text-2xl font-black mt-2">${l.price ? aed(l.price) : T("السعر عند التواصل", "Price on request")}${l.negotiable ? ` <span class="cm-badge cm-badge-blue">${T("قابل للتفاوض", "Negotiable")}</span>` : ""}</p>
      ${l.previous_price && Number(l.previous_price) > Number(l.price) ? `<p class="text-sm cm-text-muted">${T("السعر السابق", "Previous price")}: <s>${aed(l.previous_price)}</s></p>` : ""}
      <dl class="grid grid-cols-2 gap-2 mt-4 text-sm">
        ${facts.map(([k, v]) => `<div class="cm-spec px-3 py-2"><dt class="text-xs cm-text-muted">${esc(k)}</dt><dd class="font-bold">${esc(v)}</dd></div>`).join("")}
      </dl>
      ${l.description ? `<h2 class="font-bold mt-5 mb-1">${T("الوصف", "Description")}</h2><p class="text-sm leading-relaxed">${esc(l.description)}</p>` : ""}
      <p class="text-sm cm-text-muted mt-5">${T(`للتواصل مع البائع، افتح الإعلان على ${SITE_NAME} وسجّل الدخول لعرض رقم الجوال.`, `To contact the seller, open the listing on ${SITE_NAME} and sign in to see the phone number.`)}</p>
    </div>
  </article>
  ${gallery.length > 1 ? `<div class="grid grid-cols-4 gap-2 mt-3">${gallery.slice(1, 8).map((src, i) => `<img src="${esc(src)}" alt="${esc(`${carTitle(l)} ${T("صورة", "photo")} ${i + 2}`)}" loading="lazy" class="rounded-lg object-cover cm-aspect-4-3">`).join("")}</div>` : ""}
  ${similar.length ? `<section class="mt-8"><h2 class="font-bold mb-3">${esc(T(`سيارات ${l.make} أخرى للبيع`, `More ${tr(l.make)} cars for sale`))}</h2><ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${similar.map(card).join("")}</ul></section>` : ""}
  <nav class="mt-6 text-sm">
    ${MAKE_SLUGS[l.make] ? `<a class="cm-link" href="${P.make(l.make)}">${esc(T(`كل سيارات ${l.make} المستعملة`, `All used ${tr(l.make)} cars`))}</a> · ` : ""}
    ${CITY_SLUGS[l.city] ? `<a class="cm-link" href="${P.city(l.city)}">${esc(T(`سيارات مستعملة في ${l.city}`, `Used cars in ${tr(l.city)}`))}</a> · ` : ""}
    <a class="cm-link" href="${P.all()}">${T("كل السيارات المستعملة", "All used cars")}</a>
  </nav>
</main>`;

  return [200, fillShell(shell, {
    title: copy.title,
    description: copy.description,
    canonical: url,
    image: gallery[0],
    headExtra: jsonLd(structured) + jsonLd(breadcrumbLd(crumbs))
      + (gallery[0] ? preloadImage(gallery[0], [640, 1080], "(min-width: 640px) 512px, 100vw") : "")
      + seedScript({ car: l }),
    body,
  })];
}

// --- Category pages --------------------------------------------------------

async function categoryPage(shell, route, page = 1) {
  // Model pages: find the model's display name among this make's listings.
  let models = [];
  if (route.kind === "model" || route.kind === "make") {
    ({ rows: models } = await queryListings([["select", "model"], ["make", `eq.${route.make}`], ["limit", "2000"]]));
  }
  if (route.kind === "model") {
    const hit = models.find((r) => modelSlug(r.model) === route.modelSlug);
    if (!hit) return [404, notFound(shell, `/used-cars/${encodeURIComponent(route.modelSlug)}`)];
    route = { ...route, model: hit.model };
  }
  if (route.kind === "dealer") {
    const [dealer] = await queryTable("dealers", [["select", "*"], ["slug", `eq.${route.slug}`], ["limit", "1"]]);
    if (!dealer) return [404, notFound(shell, P.dealer(route.slug))];
    route = { ...route, id: dealer.id, name: dealer.name, verified: dealer.verified, instagram: dealer.instagram };
  }
  const filters = [];
  if (route.kind === "model") filters.push(["make", `eq.${route.make}`], ["model", `eq.${route.model}`]);
  if (route.kind === "dealer") filters.push(["dealer_id", `eq.${route.id}`]);
  if (route.kind === "make") filters.push(["make", `eq.${route.make}`]);
  if (route.kind === "city") filters.push(["city", `eq.${route.city}`]);
  if (route.kind === "budget") filters.push(["price", `lte.${route.max}`]);

  const [{ rows, total }, facets] = await Promise.all([
    queryListings([
      ["select", LISTING_FIELDS], ...filters,
      ["order", "created_at.desc"], ["limit", String(PAGE_SIZE)], ["offset", String((page - 1) * PAGE_SIZE)],
    ], { count: true }),
    getFacets(),
  ]);

  const path = route.kind === "model" ? P.model(route.make, route.model)
    : route.kind === "dealer" ? P.dealer(route.slug)
    : route.kind === "make" ? P.make(route.make)
    : route.kind === "city" ? P.city(route.city)
    : route.kind === "budget" ? P.budget(route.max)
    : P.all();
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > pages) return [404, notFound(shell, path)];
  const pageHref = (n) => (n > 1 ? `${path}?page=${n}` : path);
  const url = SITE_URL + pageHref(page);
  const copy = categoryCopy(route, total);
  if (page > 1) { copy.title = `${copy.title} — ${T("صفحة", "Page")} ${page}`; copy.description = `${T("صفحة", "Page")} ${page}: ${copy.description}`; }
  const prices = rows.map((r) => Number(r.price)).filter(Boolean);

  const crumbs = [
    [T("الرئيسية", "Home"), P.home()],
    [T("سيارات مستعملة", "Used cars"), P.all()],
    route.kind === "model" ? [tr(route.make), P.make(route.make)] : null,
    route.kind !== "all" ? [copy.h1, path] : null,
  ].filter(Boolean);

  const directAr = "كل الإعلانات من البائعين مباشرة، بدون وسيط.";
  const directEn = "All listings come straight from the sellers.";
  const intro = EN()
    ? (total
      ? `${num(total)} listings right now${prices.length ? `, priced from AED ${num(Math.min(...prices))} to AED ${num(Math.max(...prices))}` : ""}. ${directEn}`
      : "There are no listings in this section right now. Browse the other cars or sell your car for free.")
    : (total
      ? `يوجد حاليًا ${fmt(total)} إعلان${prices.length ? `، بأسعار تبدأ من ${fmt(Math.min(...prices))} وتصل إلى ${fmt(Math.max(...prices))} درهم` : ""}. ${directAr}`
      : "لا توجد إعلانات في هذا القسم حاليًا. تصفح باقي السيارات أو انشر سيارتك مجانًا.");
  const dealerIntro = route.kind === "dealer"
    ? `<p class="text-sm mb-5">${route.verified ? `<span class="cm-badge cm-badge-mint">${T("وسيط معتمد", "Verified dealer")}</span> ` : ""}${route.instagram ? `<a class="cm-link" href="https://instagram.com/${esc(route.instagram.replace(/^@/, ""))}" rel="noopener">@${esc(route.instagram.replace(/^@/, ""))}</a>` : ""}</p>`
    : "";
  // Links to this make's model pages (other models when on a model page).
  const modelTally = {};
  models.forEach((r) => { if (r.model && modelSlug(r.model)) modelTally[r.model] = (modelTally[r.model] || 0) + 1; });
  const modelChips = Object.entries(modelTally)
    .filter(([m]) => !(route.kind === "model" && m === route.model))
    .sort((a, b) => b[1] - a[1]).slice(0, 30)
    .map(([m, n]) => `<li><a class="cm-chip" href="${P.model(route.make, m)}">${esc(tr(`${route.make} ${m}`))} (${fmt(n)})</a></li>`);

  const body = `
${siteHeader()}
<main class="max-w-6xl mx-auto px-4 py-6">
  ${breadcrumbs(crumbs)}
  <h1 class="cm-display font-extrabold text-2xl mb-2">${esc(copy.h1)}</h1>
  <p class="cm-text-muted text-sm mb-5">${esc(route.kind === "dealer" ? intro.replace(directAr, "").replace(directEn, "") : intro)}</p>
  ${dealerIntro}
  ${rows.length ? `<ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${rows.map(card).join("")}</ul>` : ""}
  ${pager(page, pages, pageHref)}
  ${modelChips.length ? `<section class="mt-8 text-sm"><h2 class="font-bold">${esc(T(`موديلات ${route.make}`, `${tr(route.make)} models`))}</h2><ul class="flex flex-wrap gap-2 mt-2">${modelChips.join("")}</ul></section>` : ""}
  ${relatedLinks(facets, route)}
</main>`;

  return [200, fillShell(shell, {
    title: copy.title,
    description: copy.description,
    canonical: url,
    image: rows.map(photo).find(Boolean),
    // Empty categories stay reachable but out of Google's index.
    noindex: total === 0,
    headExtra: jsonLd(breadcrumbLd(crumbs)) + (rows.length ? jsonLd({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: copy.h1,
      numberOfItems: total,
      itemListElement: rows.map((l, i) => ({ "@type": "ListItem", position: (page - 1) * PAGE_SIZE + i + 1, url: SITE_URL + P.car(l.id), name: carTitle(l) })),
    }) : ""),
    body,
  })];
}

// --- Home page -------------------------------------------------------------

async function homePage(shell) {
  // (also seeds the app with these rows; see seedScript)
  const [{ rows, total }, facets] = await Promise.all([
    queryListings([["select", LISTING_FIELDS], ["order", "created_at.desc"], ["limit", "24"]], { count: true }),
    getFacets(),
  ]);
  const title = T(`${SITE_NAME} — سوق السيارات المستعملة في الإمارات`, `${SITE_NAME} — Used cars for sale in the UAE`);
  const description = T(`${SITE_NAME} سوق السيارات المستعملة في الإمارات: تصفح ${total ? `${fmt(total)} ` : ""}سيارة للبيع في دبي وأبوظبي والشارقة وباقي الإمارات، أو انشر سيارتك مجانًا وتواصل مع المشترين مباشرة.`,
    `${SITE_NAME} is the UAE's used car marketplace: browse ${total ? `${num(total)} ` : ""}cars for sale in Dubai, Abu Dhabi, Sharjah and across the UAE, or sell your car for free and deal with buyers directly.`);
  const body = `
${siteHeader()}
<main class="max-w-6xl mx-auto px-4 py-6">
  <h1 class="cm-display font-extrabold text-2xl mb-2">${T("سوق السيارات المستعملة في الإمارات", "Used cars for sale in the UAE")}</h1>
  <p class="cm-text-muted text-sm mb-5">${T(`${total ? `${fmt(total)} سيارة معروضة للبيع الآن. ` : ""}تصفح السيارات المستعملة حسب الماركة أو الإمارة أو الميزانية، أو انشر إعلان سيارتك مجانًا.`, `${total ? `${num(total)} cars for sale right now. ` : ""}Browse used cars by make, emirate or budget, or list your car for free.`)}</p>
  <p class="mb-6"><a class="cm-link font-bold" href="${P.all()}">${T("تصفح كل السيارات المستعملة", "Browse all used cars")}</a></p>
  ${rows.length ? `<h2 class="font-bold mb-3">${T("أحدث السيارات", "Latest cars")}</h2><ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${rows.map(card).join("")}</ul>` : ""}
  ${relatedLinks(facets, { kind: "home" })}
</main>`;
  return fillShell(shell, {
    title,
    description,
    canonical: SITE_URL + P.home(),
    headExtra: seedScript({ listings: rows }) + (photo(rows[0] || {}) ? preloadImage(photo(rows[0]), [384, 640, 828], "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw") : "") + jsonLd({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: SITE_NAME, url: `${SITE_URL}/`, logo: `${SITE_URL}/icon-512.png`, email: "carsuae@carsuae.net", areaServed: "AE" },
        { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, alternateName: "كارز يو إيه إي", url: `${SITE_URL}/`, inLanguage: T("ar-AE", "en-AE"), publisher: { "@id": `${SITE_URL}/#org` } },
      ],
    }),
    body,
  });
}

// --- Articles --------------------------------------------------------------

function blocksHtml(body) {
  return body.map(([type, v]) => {
    if (type === "h2") return `<h2 class="cm-section-title mt-8 mb-3">${esc(v)}</h2>`;
    if (type === "p") return `<p class="mb-4">${esc(v)}</p>`;
    if (type === "ul" || type === "ol") return `<${type} class="cm-article-list mb-4">${v.map((x) => `<li>${esc(x)}</li>`).join("")}</${type}>`;
    if (type === "tip") return `<p class="cm-article-tip mb-4">${esc(v)}</p>`;
    if (type === "faq") return v.map(([q, ans]) => `<h3 class="font-bold mt-5 mb-1">${esc(q)}</h3><p class="mb-3">${esc(ans)}</p>`).join("");
    if (type === "contact") return `<p class="cm-sell-banner p-4 my-6">${T("البريد الإلكتروني", "Email")}: <a class="cm-link font-bold" dir="ltr" href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>`;
    if (type === "cta") return `<p class="cm-sell-banner p-4 my-6">${esc(v.text)} <a class="cm-link font-bold" href="${esc(v.href === "#sell" ? P.sell() : langPath(v.href, EN()))}">${esc(v.label)}</a></p>`;
    return "";
  }).join("\n");
}

function infoPage(shell, pg) {
  const crumbs = [[T("الرئيسية", "Home"), P.home()], [pg.title, langPath(pg.path, EN())]];
  const updated = !["/terms", "/privacy"].includes(pg.path) ? "" : `<p class="text-xs cm-text-muted mb-6">${T("آخر تحديث", "Last updated")}: ${esc(formatArticleDate(LEGAL_UPDATED))}</p>`;
  const body = `
${siteHeader()}
<main class="max-w-3xl mx-auto px-4 py-8">
  ${breadcrumbs(crumbs)}
  <article class="cm-article">
    <h1 class="cm-display font-extrabold text-2xl mb-2">${esc(pg.title)}</h1>
    ${updated}
    ${blocksHtml(pg.body)}
  </article>
</main>`;
  return fillShell(shell, {
    title: `${pg.title} | ${SITE_NAME}`,
    description: pg.description,
    canonical: SITE_URL + langPath(pg.path, EN()),
    headExtra: jsonLd(breadcrumbLd(crumbs)) + faqLd(pg.body),
    body,
  });
}

// FAQPage structured data from the page's "faq" blocks, so Google can show
// the answers in results.
function faqLd(body) {
  const qa = body.filter(([t]) => t === "faq").flatMap(([, v]) => v);
  if (!qa.length) return "";
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  });
}

function blogPage(shell) {
  const title = T(`مقالات ونصائح شراء وبيع السيارات في الإمارات | ${SITE_NAME}`, `Tips for buying and selling cars in the UAE | ${SITE_NAME}`);
  const description = T("نصائح عملية لشراء وبيع السيارات المستعملة في الإمارات: الفحص قبل الشراء، الفرق بين الخليجي والوارد، الأسعار ونقل الملكية.",
    "Practical tips for buying and selling used cars in the UAE: inspecting before you buy, GCC vs imported specs, pricing and ownership transfer.");
  const crumbs = [[T("الرئيسية", "Home"), P.home()], [T("المقالات", "Articles"), P.blog()]];
  const body = `
${siteHeader()}
<main class="max-w-3xl mx-auto px-4 py-8">
  ${breadcrumbs(crumbs)}
  <h1 class="cm-display font-extrabold text-2xl mb-2">${T("مقالات ونصائح", "Articles and tips")}</h1>
  <p class="cm-text-muted text-sm mb-6">${esc(description)}</p>
  <ul class="space-y-4">${articlesIn(EN()).map((a) => `<li class="cm-card rounded-xl p-5"><a href="${P.article(a.slug)}" class="block">
    <h2 class="cm-section-title">${esc(a.title)}</h2>
    <p class="text-sm cm-text-muted mt-1">${esc(a.description)}</p>
    <p class="text-xs cm-text-muted mt-2">${esc(formatArticleDate(a.date))} · ${fmt(a.readMinutes)} ${T("دقائق قراءة", "min read")}</p></a></li>`).join("")}</ul>
</main>`;
  return fillShell(shell, {
    title, description, canonical: SITE_URL + P.blog(),
    headExtra: jsonLd(breadcrumbLd(crumbs)),
    body,
  });
}

function articlePage(shell, a) {
  const url = SITE_URL + P.article(a.slug);
  const crumbs = [[T("الرئيسية", "Home"), P.home()], [T("المقالات", "Articles"), P.blog()], [a.title, P.article(a.slug)]];
  const body = `
${siteHeader()}
<main class="max-w-3xl mx-auto px-4 py-8">
  ${breadcrumbs(crumbs)}
  <article class="cm-article">
    <h1 class="cm-display font-extrabold text-2xl mb-2">${esc(a.title)}</h1>
    <p class="text-xs cm-text-muted mb-6">${esc(formatArticleDate(a.date))} · ${fmt(a.readMinutes)} ${T("دقائق قراءة", "min read")}</p>
    ${blocksHtml(a.body)}
  </article>
  <p class="mt-8"><a class="cm-link font-bold" href="${P.blog()}">${T("كل المقالات", "All articles")}</a></p>
</main>`;
  return fillShell(shell, {
    title: `${a.title} | ${SITE_NAME}`,
    description: a.description,
    canonical: url,
    headExtra: jsonLd({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.description,
      datePublished: a.date,
      dateModified: a.updated || a.date,
      inLanguage: T("ar-AE", "en-AE"),
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` },
      publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` } },
      image: `${SITE_URL}/og-image.png`,
    }) + jsonLd(breadcrumbLd(crumbs)),
    body,
  });
}

// --- VIN check tool --------------------------------------------------------

function vinPage(shell) {
  const title = T(`فحص رقم الشاصي مجانًا (VIN) | ${SITE_NAME}`, `Free VIN check (chassis number) | ${SITE_NAME}`);
  const description = T("افحص رقم الشاصي لأي سيارة مجانًا: بلد الصنع، الشركة المصنعة، سنة الموديل، مواصفات المحرك وناقل الحركة، ونداءات الاستدعاء. أداة مجانية من CarsUAE قبل شراء سيارتك المستعملة في الإمارات.",
    "Check any car's VIN for free: country of manufacture, maker, model year, engine and transmission specs, and safety recalls. A free CarsUAE tool before you buy a used car in the UAE.");
  const body = `
${siteHeader()}
<main class="max-w-3xl mx-auto px-4 py-8">
  <h1 class="cm-display font-extrabold text-2xl mb-2">${T("فحص رقم الشاصي مجانًا", "Free VIN check")}</h1>
  <p class="cm-text-muted text-sm mb-5">${T("اكتب رقم الشاصي (VIN) المكوّن من 17 حرفًا ورقمًا، واعرف بلد الصنع والشركة المصنعة وسنة الموديل ومواصفات المصنع، قبل ما تشتري السيارة.", "Enter the 17-character VIN (chassis number) to see the country of manufacture, maker, model year and factory specs before you buy the car.")}</p>
  <h2 class="font-bold mt-6 mb-2">${T("وين ألقى رقم الشاصي؟", "Where do I find the VIN?")}</h2>
  <p class="text-sm">${T("في ملكية السيارة (الكارت)، أو أسفل الزجاج الأمامي من جهة السائق، أو على باب السائق من الداخل.", "On the car's registration card (mulkiya), at the bottom of the windscreen on the driver's side, or inside the driver's door.")}</p>
  <p class="mt-6"><a class="cm-link font-bold" href="${P.all()}">${T("تصفح السيارات المستعملة للبيع", "Browse used cars for sale")}</a></p>
</main>`;
  return fillShell(shell, {
    title,
    description,
    canonical: SITE_URL + P.vin(),
    headExtra: jsonLd({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: T("فحص رقم الشاصي", "VIN check"),
      url: SITE_URL + P.vin(),
      applicationCategory: "UtilitiesApplication",
      inLanguage: T("ar-AE", "en-AE"),
      offers: { "@type": "Offer", price: "0", priceCurrency: "AED" },
    }),
    body,
  });
}

// --- Pieces ----------------------------------------------------------------

// Hands the rows already fetched for this page to the browser app
// (window.__SEED__), so it can draw them without a second round trip.
function seedScript(data) {
  return `<script>window.__SEED__=${JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028|\u2029/g, "")}</script>`;
}

// Lets the browser start downloading the page's main photo right away.
function preloadImage(src, widths, sizes) {
  const set = imgSrcSet(src, widths);
  return set
    ? `<link rel="preload" as="image" href="${esc(imgSrc(src, widths[0]))}" imagesrcset="${esc(set)}" imagesizes="${esc(sizes)}" fetchpriority="high">`
    : `<link rel="preload" as="image" href="${esc(src)}" fetchpriority="high">`;
}

function siteHeader() {
  return `<header class="cm-header"><div class="max-w-6xl mx-auto px-4 py-3"><a href="${P.home()}" class="cm-display font-extrabold text-lg" dir="ltr">Cars<span class="cm-grad-text">UAE</span></a></div></header>`;
}

function breadcrumbs(crumbs) {
  return `<nav aria-label="${T("مسار التصفح", "Breadcrumb")}" class="text-xs cm-text-muted mb-4">${crumbs
    .map(([name, href], i) => (i === crumbs.length - 1 ? `<span>${esc(name)}</span>` : `<a class="cm-link" href="${href}">${esc(name)}</a>`))
    .join(T(" ‹ ", " › "))}</nav>`;
}

function breadcrumbLd(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([name, href], i) => ({ "@type": "ListItem", position: i + 1, name: tr(name), item: SITE_URL + href })),
  };
}

function card(l) {
  const img = photo(l);
  const facts = [l.year || "-", l.mileage ? T(`${fmt(l.mileage)} كم`, `${num(l.mileage)} km`) : T("- كم", "- km"), l.specs || "-", l.city || "-"].join(" · ");
  return `<li class="cm-card rounded-xl overflow-hidden"><a href="${P.car(l.id)}" class="block">
    ${img ? `<img src="${esc(imgSrc(img, 640))}" srcset="${esc(imgSrcSet(img, [384, 640, 828]) || "")}" sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" width="640" height="400" alt="${esc(carTitle(l))}" loading="lazy" decoding="async" class="w-full object-cover cm-aspect-16-10">` : ""}
    <div class="p-3.5"><h2 class="cm-display font-bold text-sm">${esc(carTitle(l))}</h2>
    <p class="text-xs cm-text-muted mt-1">${esc(facts)}</p>
    <p class="font-bold mt-2">${l.price ? aed(l.price) : T("السعر عند التواصل", "Price on request")}${l.negotiable ? T(" · قابل للتفاوض", " · Negotiable") : ""}</p></div>
  </a></li>`;
}

// Crawlable page links: ‹ السابق · 1 2 3 … · التالي ›
function pager(page, pages, href) {
  if (pages <= 1) return "";
  const nums = [...new Set([1, page - 2, page - 1, page, page + 1, page + 2, pages])].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const items = [];
  if (page > 1) items.push(`<a class="cm-link" rel="prev" href="${href(page - 1)}">${T("السابق", "Previous")}</a>`);
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) items.push(`<span>…</span>`);
    items.push(n === page ? `<span class="font-bold" aria-current="page">${fmt(n)}</span>` : `<a class="cm-link" href="${href(n)}">${fmt(n)}</a>`);
  });
  if (page < pages) items.push(`<a class="cm-link" rel="next" href="${href(page + 1)}">${T("التالي", "Next")}</a>`);
  return `<nav aria-label="${T("الصفحات", "Pages")}" class="flex flex-wrap gap-3 items-center justify-center text-sm mt-6">${items.join("")}</nav>`;
}

function relatedLinks(facets, route) {
  const makes = facets.makes.filter(([m]) => !(route.kind === "make" && route.make === m)).slice(0, 20);
  const cities = facets.cities.filter(([c]) => !(route.kind === "city" && route.city === c));
  const budgets = BUDGET_STEPS.filter((b) => !(route.kind === "budget" && route.max === b));
  const list = (items) => `<ul class="flex flex-wrap gap-2 mt-2">${items.join("")}</ul>`;
  const chip = (href, text) => `<li><a class="cm-chip" href="${href}">${esc(text)}</a></li>`;
  return `<section class="mt-10 space-y-5 text-sm">
    ${makes.length ? `<div><h2 class="font-bold">${T("حسب الماركة", "By make")}</h2>${list(makes.map(([m, n]) => chip(P.make(m), `${m} (${fmt(n)})`)))}</div>` : ""}
    ${cities.length ? `<div><h2 class="font-bold">${T("حسب الإمارة", "By emirate")}</h2>${list(cities.map(([c, n]) => chip(P.city(c), `${c} (${fmt(n)})`)))}</div>` : ""}
    <div><h2 class="font-bold">${T("حسب الميزانية", "By budget")}</h2>${list(budgets.map((b) => chip(P.budget(b), T(`تحت ${fmt(b)} درهم`, `Under AED ${num(b)}`))))}</div>
  </section>`;
}

function notFound(shell, path) {
  return fillShell(shell, {
    title: T(`الصفحة غير موجودة | ${SITE_NAME}`, `Page not found | ${SITE_NAME}`),
    description: T("الإعلان أو الصفحة غير موجودة. ربما بيعت السيارة أو حُذف الإعلان.", "This listing or page does not exist. The car may have been sold or the listing removed."),
    canonical: SITE_URL + path,
    noindex: true,
    body: `${siteHeader()}<main class="max-w-6xl mx-auto px-4 py-16 text-center">
      <h1 class="cm-display font-extrabold text-xl mb-2">${T("الإعلان غير موجود", "Listing not found")}</h1>
      <p class="cm-text-muted text-sm mb-4">${T("ربما بيعت السيارة أو حذف البائع الإعلان.", "The car may have been sold or the seller removed the listing.")}</p>
      <a class="cm-link" href="${P.all()}">${T("تصفح السيارات المتاحة", "Browse available cars")}</a></main>`,
  });
}
