// Server-rendered pages for search engines and link previews:
//   /car/<id>                 one listing
//   /used-cars                all listings
//   /used-cars/<make>         e.g. /used-cars/toyota
//   /used-cars/in/<city>      e.g. /used-cars/in/dubai
//   /used-cars/under/<max>    e.g. /used-cars/under/50000
//   /used-cars/<make>/<model> e.g. /used-cars/lexus/ls
//   /dealer/<slug>            one dealer's cars
//   /vin-check                free VIN (رقم الشاصي) check tool
//   /                         home page (sent here by middleware.js)
// Category pages take ?page=2, 3 … so every live car is reachable by links.
// vercel.json rewrites those paths here as ?route=<path>. Each response is the
// normal app shell with real <head> tags and the page content already in
// #root; the React app then takes over in the browser.

import {
  SITE_URL, SITE_NAME, BUDGET_STEPS, MAKE_SLUGS, CITY_SLUGS,
  parsePath, paths, categoryCopy, carCopy, carTitle, modelSlug,
} from "../src/seo-data.js";
import {
  LISTING_FIELDS, queryListings, queryTable, getShell, fillShell, send, esc, jsonLd, fmt, photo,
} from "./_lib.js";

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

export default async function handler(req, res) {
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
  if (!/^[0-9a-f-]{8,40}$/i.test(route.id)) return [404, notFound(shell, paths.car(route.id))];
  const { rows } = await queryListings([["select", LISTING_FIELDS], ["id", `eq.${route.id}`], ["limit", "1"]], { live: false });
  const l = rows[0];
  if (!l) return [404, notFound(shell, paths.car(route.id))];

  const url = SITE_URL + paths.car(l.id);
  const copy = carCopy(l);
  // Other live cars of the same make (same model first), linked from the page.
  const { rows: sameMake } = await queryListings([
    ["select", LISTING_FIELDS], ["make", `eq.${l.make}`], ["id", `neq.${l.id}`],
    ["order", "created_at.desc"], ["limit", "24"],
  ]).catch(() => ({ rows: [] }));
  const similar = [...sameMake.filter((r) => r.model === l.model), ...sameMake.filter((r) => r.model !== l.model)].slice(0, 6);
  const gallery = (Array.isArray(l.images) && l.images.length ? l.images : [l.image]).filter(Boolean);
  const facts = [
    ["سنة الصنع", l.year],
    ["الممشى", l.mileage ? `${fmt(l.mileage)} كم` : null],
    ["المواصفات", l.specs],
    ["ناقل الحركة", l.trans],
    ["الوقود", l.fuel],
    ["نوع السيارة", l.body_type],
    ["جهة المقود", l.steering],
    ["الحالة", l.condition],
    ["الإمارة", l.city],
  ].map(([k, v]) => [k, v || "-"]);

  const crumbs = [
    ["الرئيسية", "/"],
    ["سيارات مستعملة", paths.all()],
    MAKE_SLUGS[l.make] ? [l.make, paths.make(l.make)] : null,
    MAKE_SLUGS[l.make] && modelSlug(l.model) ? [`${l.make} ${l.model}`, paths.model(l.make, l.model)] : null,
    [carTitle(l), paths.car(l.id)],
  ].filter(Boolean);

  const structured = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: carTitle(l),
    brand: { "@type": "Brand", name: l.make },
    model: l.model,
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
      price: Number(l.price),
      priceCurrency: "AED",
      availability: l.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url,
      areaServed: l.city || "الإمارات العربية المتحدة",
    },
  };

  const body = `
${siteHeader()}
<main class="max-w-6xl mx-auto px-4 py-6">
  ${breadcrumbs(crumbs)}
  <article class="cm-card rounded-2xl overflow-hidden">
    ${gallery.length ? `<img src="${esc(gallery[0])}" alt="${esc(carTitle(l))}" class="w-full object-cover cm-aspect-16-9">` : ""}
    <div class="p-5">
      ${l.sold ? `<p class="cm-badge cm-badge-red mb-2">تم بيع هذه السيارة</p>` : ""}<h1 class="cm-display font-extrabold text-2xl">${esc(carTitle(l))}${l.sold ? "" : " للبيع"}</h1>
      <p class="text-2xl font-black mt-2">${fmt(l.price)} د.إ${l.negotiable ? ` <span class="cm-badge cm-badge-blue">قابل للتفاوض</span>` : ""}</p>
      ${l.previous_price && Number(l.previous_price) > Number(l.price) ? `<p class="text-sm cm-text-muted">السعر السابق: <s>${fmt(l.previous_price)} د.إ</s></p>` : ""}
      <dl class="grid grid-cols-2 gap-2 mt-4 text-sm">
        ${facts.map(([k, v]) => `<div class="cm-spec px-3 py-2"><dt class="text-xs cm-text-muted">${esc(k)}</dt><dd class="font-bold">${esc(v)}</dd></div>`).join("")}
      </dl>
      ${l.description ? `<h2 class="font-bold mt-5 mb-1">الوصف</h2><p class="text-sm leading-relaxed">${esc(l.description)}</p>` : ""}
      <p class="text-sm cm-text-muted mt-5">للتواصل مع البائع، افتح الإعلان على ${SITE_NAME} وسجّل الدخول لعرض رقم الجوال.</p>
    </div>
  </article>
  ${gallery.length > 1 ? `<div class="grid grid-cols-4 gap-2 mt-3">${gallery.slice(1, 8).map((src, i) => `<img src="${esc(src)}" alt="${esc(`${carTitle(l)} صورة ${i + 2}`)}" loading="lazy" class="rounded-lg object-cover cm-aspect-4-3">`).join("")}</div>` : ""}
  ${similar.length ? `<section class="mt-8"><h2 class="font-bold mb-3">سيارات ${esc(l.make)} أخرى للبيع</h2><ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${similar.map(card).join("")}</ul></section>` : ""}
  <nav class="mt-6 text-sm">
    ${MAKE_SLUGS[l.make] ? `<a class="cm-link" href="${paths.make(l.make)}">كل سيارات ${esc(l.make)} المستعملة</a> · ` : ""}
    ${CITY_SLUGS[l.city] ? `<a class="cm-link" href="${paths.city(l.city)}">سيارات مستعملة في ${esc(l.city)}</a> · ` : ""}
    <a class="cm-link" href="${paths.all()}">كل السيارات المستعملة</a>
  </nav>
</main>`;

  return [200, fillShell(shell, {
    title: copy.title,
    description: copy.description,
    canonical: url,
    image: gallery[0],
    headExtra: jsonLd(structured) + jsonLd(breadcrumbLd(crumbs)),
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
    if (!dealer) return [404, notFound(shell, paths.dealer(route.slug))];
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

  const path = route.kind === "model" ? paths.model(route.make, route.model)
    : route.kind === "dealer" ? paths.dealer(route.slug)
    : route.kind === "make" ? paths.make(route.make)
    : route.kind === "city" ? paths.city(route.city)
    : route.kind === "budget" ? paths.budget(route.max)
    : paths.all();
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > pages) return [404, notFound(shell, path)];
  const pageHref = (n) => (n > 1 ? `${path}?page=${n}` : path);
  const url = SITE_URL + pageHref(page);
  const copy = categoryCopy(route, total);
  if (page > 1) { copy.title = `${copy.title} — صفحة ${page}`; copy.description = `صفحة ${page}: ${copy.description}`; }
  const prices = rows.map((r) => Number(r.price)).filter(Boolean);

  const crumbs = [
    ["الرئيسية", "/"],
    ["سيارات مستعملة", paths.all()],
    route.kind === "model" ? [route.make, paths.make(route.make)] : null,
    route.kind !== "all" ? [copy.h1, path] : null,
  ].filter(Boolean);

  const intro = total
    ? `يوجد حاليًا ${fmt(total)} إعلان${prices.length ? `، بأسعار تبدأ من ${fmt(Math.min(...prices))} وتصل إلى ${fmt(Math.max(...prices))} درهم` : ""}. كل الإعلانات من البائعين مباشرة، بدون وسيط.`
    : "لا توجد إعلانات في هذا القسم حاليًا. تصفح باقي السيارات أو انشر سيارتك مجانًا.";
  const dealerIntro = route.kind === "dealer"
    ? `<p class="text-sm mb-5">${route.verified ? `<span class="cm-badge cm-badge-mint">وسيط معتمد</span> ` : ""}${route.instagram ? `<a class="cm-link" href="https://instagram.com/${esc(route.instagram.replace(/^@/, ""))}" rel="noopener">@${esc(route.instagram.replace(/^@/, ""))}</a>` : ""}</p>`
    : "";
  // Links to this make's model pages (other models when on a model page).
  const modelTally = {};
  models.forEach((r) => { if (r.model && modelSlug(r.model)) modelTally[r.model] = (modelTally[r.model] || 0) + 1; });
  const modelChips = Object.entries(modelTally)
    .filter(([m]) => !(route.kind === "model" && m === route.model))
    .sort((a, b) => b[1] - a[1]).slice(0, 30)
    .map(([m, n]) => `<li><a class="cm-chip" href="${paths.model(route.make, m)}">${esc(`${route.make} ${m}`)} (${fmt(n)})</a></li>`);

  const body = `
${siteHeader()}
<main class="max-w-6xl mx-auto px-4 py-6">
  ${breadcrumbs(crumbs)}
  <h1 class="cm-display font-extrabold text-2xl mb-2">${esc(copy.h1)}</h1>
  <p class="cm-text-muted text-sm mb-5">${esc(route.kind === "dealer" ? intro.replace("كل الإعلانات من البائعين مباشرة، بدون وسيط.", "") : intro)}</p>
  ${dealerIntro}
  ${rows.length ? `<ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${rows.map(card).join("")}</ul>` : ""}
  ${pager(page, pages, pageHref)}
  ${modelChips.length ? `<section class="mt-8 text-sm"><h2 class="font-bold">موديلات ${esc(route.make)}</h2><ul class="flex flex-wrap gap-2 mt-2">${modelChips.join("")}</ul></section>` : ""}
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
      itemListElement: rows.map((l, i) => ({ "@type": "ListItem", position: (page - 1) * PAGE_SIZE + i + 1, url: SITE_URL + paths.car(l.id), name: carTitle(l) })),
    }) : ""),
    body,
  })];
}

// --- Home page -------------------------------------------------------------

async function homePage(shell) {
  const [{ rows, total }, facets] = await Promise.all([
    queryListings([["select", LISTING_FIELDS], ["order", "created_at.desc"], ["limit", "24"]], { count: true }),
    getFacets(),
  ]);
  const title = `${SITE_NAME} — سوق السيارات المستعملة في الإمارات`;
  const description = `${SITE_NAME} سوق السيارات المستعملة في الإمارات: تصفح ${total ? `${fmt(total)} ` : ""}سيارة للبيع في دبي وأبوظبي والشارقة وباقي الإمارات، أو انشر سيارتك مجانًا وتواصل مع المشترين مباشرة.`;
  const body = `
${siteHeader()}
<main class="max-w-6xl mx-auto px-4 py-6">
  <h1 class="cm-display font-extrabold text-2xl mb-2">سوق السيارات المستعملة في الإمارات</h1>
  <p class="cm-text-muted text-sm mb-5">${total ? `${fmt(total)} سيارة معروضة للبيع الآن. ` : ""}تصفح السيارات المستعملة حسب الماركة أو الإمارة أو الميزانية، أو انشر إعلان سيارتك مجانًا.</p>
  <p class="mb-6"><a class="cm-link font-bold" href="${paths.all()}">تصفح كل السيارات المستعملة</a></p>
  ${rows.length ? `<h2 class="font-bold mb-3">أحدث السيارات</h2><ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${rows.map(card).join("")}</ul>` : ""}
  ${relatedLinks(facets, { kind: "home" })}
</main>`;
  return fillShell(shell, {
    title,
    description,
    canonical: SITE_URL + "/",
    headExtra: jsonLd({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: SITE_NAME, url: `${SITE_URL}/`, logo: `${SITE_URL}/icon-512.png`, email: "carsuae@carsuae.net", areaServed: "AE" },
        { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, alternateName: "كارز يو إيه إي", url: `${SITE_URL}/`, inLanguage: "ar-AE", publisher: { "@id": `${SITE_URL}/#org` } },
      ],
    }),
    body,
  });
}

// --- VIN check tool --------------------------------------------------------

function vinPage(shell) {
  const title = `فحص رقم الشاصي مجانًا (VIN) | ${SITE_NAME}`;
  const description = "افحص رقم الشاصي لأي سيارة مجانًا: بلد الصنع، الشركة المصنعة، سنة الموديل، مواصفات المحرك وناقل الحركة، ونداءات الاستدعاء. أداة مجانية من CarsUAE قبل شراء سيارتك المستعملة في الإمارات.";
  const body = `
${siteHeader()}
<main class="max-w-3xl mx-auto px-4 py-8">
  <h1 class="cm-display font-extrabold text-2xl mb-2">فحص رقم الشاصي مجانًا</h1>
  <p class="cm-text-muted text-sm mb-5">اكتب رقم الشاصي (VIN) المكوّن من 17 حرفًا ورقمًا، واعرف بلد الصنع والشركة المصنعة وسنة الموديل ومواصفات المصنع، قبل ما تشتري السيارة.</p>
  <h2 class="font-bold mt-6 mb-2">وين ألقى رقم الشاصي؟</h2>
  <p class="text-sm">في ملكية السيارة (الكارت)، أو أسفل الزجاج الأمامي من جهة السائق، أو على باب السائق من الداخل.</p>
  <p class="mt-6"><a class="cm-link font-bold" href="${paths.all()}">تصفح السيارات المستعملة للبيع</a></p>
</main>`;
  return fillShell(shell, {
    title,
    description,
    canonical: SITE_URL + paths.vin(),
    headExtra: jsonLd({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "فحص رقم الشاصي",
      url: SITE_URL + paths.vin(),
      applicationCategory: "UtilitiesApplication",
      inLanguage: "ar-AE",
      offers: { "@type": "Offer", price: "0", priceCurrency: "AED" },
    }),
    body,
  });
}

// --- Pieces ----------------------------------------------------------------

function siteHeader() {
  return `<header class="cm-header"><div class="max-w-6xl mx-auto px-4 py-3"><a href="/" class="cm-display font-extrabold text-lg" dir="ltr">Cars<span class="cm-grad-text">UAE</span></a></div></header>`;
}

function breadcrumbs(crumbs) {
  return `<nav aria-label="مسار التصفح" class="text-xs cm-text-muted mb-4">${crumbs
    .map(([name, href], i) => (i === crumbs.length - 1 ? `<span>${esc(name)}</span>` : `<a class="cm-link" href="${href}">${esc(name)}</a>`))
    .join(" ‹ ")}</nav>`;
}

function breadcrumbLd(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([name, href], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE_URL + href })),
  };
}

function card(l) {
  const img = photo(l);
  const facts = [l.year || "-", l.mileage ? `${fmt(l.mileage)} كم` : "- كم", l.specs || "-", l.city || "-"].join(" · ");
  return `<li class="cm-card rounded-xl overflow-hidden"><a href="${paths.car(l.id)}" class="block">
    ${img ? `<img src="${esc(img)}" alt="${esc(carTitle(l))}" loading="lazy" class="w-full object-cover cm-aspect-16-10">` : ""}
    <div class="p-3.5"><h2 class="cm-display font-bold text-sm">${esc(carTitle(l))}</h2>
    <p class="text-xs cm-text-muted mt-1">${esc(facts)}</p>
    <p class="font-bold mt-2">${fmt(l.price)} د.إ${l.negotiable ? " · قابل للتفاوض" : ""}</p></div>
  </a></li>`;
}

// Crawlable page links: ‹ السابق · 1 2 3 … · التالي ›
function pager(page, pages, href) {
  if (pages <= 1) return "";
  const nums = [...new Set([1, page - 2, page - 1, page, page + 1, page + 2, pages])].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const items = [];
  if (page > 1) items.push(`<a class="cm-link" rel="prev" href="${href(page - 1)}">السابق</a>`);
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) items.push(`<span>…</span>`);
    items.push(n === page ? `<span class="font-bold" aria-current="page">${fmt(n)}</span>` : `<a class="cm-link" href="${href(n)}">${fmt(n)}</a>`);
  });
  if (page < pages) items.push(`<a class="cm-link" rel="next" href="${href(page + 1)}">التالي</a>`);
  return `<nav aria-label="الصفحات" class="flex flex-wrap gap-3 items-center justify-center text-sm mt-6">${items.join("")}</nav>`;
}

function relatedLinks(facets, route) {
  const makes = facets.makes.filter(([m]) => !(route.kind === "make" && route.make === m)).slice(0, 20);
  const cities = facets.cities.filter(([c]) => !(route.kind === "city" && route.city === c));
  const budgets = BUDGET_STEPS.filter((b) => !(route.kind === "budget" && route.max === b));
  const list = (items) => `<ul class="flex flex-wrap gap-2 mt-2">${items.join("")}</ul>`;
  const chip = (href, text) => `<li><a class="cm-chip" href="${href}">${esc(text)}</a></li>`;
  return `<section class="mt-10 space-y-5 text-sm">
    ${makes.length ? `<div><h2 class="font-bold">حسب الماركة</h2>${list(makes.map(([m, n]) => chip(paths.make(m), `${m} (${fmt(n)})`)))}</div>` : ""}
    ${cities.length ? `<div><h2 class="font-bold">حسب الإمارة</h2>${list(cities.map(([c, n]) => chip(paths.city(c), `${c} (${fmt(n)})`)))}</div>` : ""}
    <div><h2 class="font-bold">حسب الميزانية</h2>${list(budgets.map((b) => chip(paths.budget(b), `تحت ${fmt(b)} درهم`)))}</div>
  </section>`;
}

function notFound(shell, path) {
  return fillShell(shell, {
    title: `الصفحة غير موجودة | ${SITE_NAME}`,
    description: "الإعلان أو الصفحة غير موجودة. ربما بيعت السيارة أو حُذف الإعلان.",
    canonical: SITE_URL + path,
    noindex: true,
    body: `${siteHeader()}<main class="max-w-6xl mx-auto px-4 py-16 text-center">
      <h1 class="cm-display font-extrabold text-xl mb-2">الإعلان غير موجود</h1>
      <p class="cm-text-muted text-sm mb-4">ربما بيعت السيارة أو حذف البائع الإعلان.</p>
      <a class="cm-link" href="${paths.all()}">تصفح السيارات المتاحة</a></main>`,
  });
}
