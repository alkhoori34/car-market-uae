// URL slugs and page copy shared by the app (src/App.jsx) and the server
// functions that render pages for Google (api/). Plain JS, no JSX, so both
// sides can import it.

export const SITE_URL = "https://carsuae.net";
export const SITE_NAME = "CarsUAE";

// Arabic make name (as stored in listings.make) -> English URL slug.
export const MAKE_SLUGS = {
  "تويوتا": "toyota", "لكزس": "lexus", "نيسان": "nissan", "إنفينيتي": "infiniti",
  "هوندا": "honda", "أكيورا": "acura", "مازدا": "mazda", "ميتسوبيشي": "mitsubishi",
  "سوزوكي": "suzuki", "سوبارو": "subaru", "إيسوزو": "isuzu", "دايهاتسو": "daihatsu",
  "هيونداي": "hyundai", "كيا": "kia", "جينيسيس": "genesis", "شيفروليه": "chevrolet",
  "فورد": "ford", "جي إم سي": "gmc", "دودج": "dodge", "جيب": "jeep",
  "كرايسلر": "chrysler", "كاديلاك": "cadillac", "لينكولن": "lincoln", "رام": "ram",
  "بونتياك": "pontiac", "بويك": "buick", "مرسيدس": "mercedes-benz", "بي إم دبليو": "bmw",
  "أودي": "audi", "فولكس واجن": "volkswagen", "بورش": "porsche", "أوبل": "opel",
  "مِيني": "mini", "سمارت": "smart", "لاند روفر": "land-rover", "جاكوار": "jaguar",
  "بنتلي": "bentley", "رولز رويس": "rolls-royce", "أستون مارتن": "aston-martin",
  "مكلارين": "mclaren", "فيراري": "ferrari", "لامبورغيني": "lamborghini",
  "مازيراتي": "maserati", "ألفا روميو": "alfa-romeo", "فيات": "fiat", "بيجو": "peugeot",
  "رينو": "renault", "سيتروين": "citroen", "دي إس": "ds", "فولفو": "volvo",
  "سكودا": "skoda", "سيات": "seat", "إم جي": "mg", "جيلي": "geely", "شانجان": "changan",
  "جي إيه سي": "gac", "بي واي دي": "byd", "هافال": "haval", "شيري": "chery", "جاك": "jac",
  "أورا": "ora", "بايك": "baic", "بروتون": "proton", "غريت وول": "great-wall",
  "سانج يونج": "ssangyong", "فوتون": "foton", "دايو": "daewoo", "لوتس": "lotus",
  "بولستار": "polestar", "نيو": "nio", "زيكر": "zeekr", "تسلا": "tesla", "جيتور": "jetour",
  "إكسيد": "exeed", "أومودا": "omoda", "جايكو": "jaecoo", "تانك": "tank", "وي": "wey",
  "لينك آند كو": "lynk-and-co", "هونشي": "hongqi", "دونغفنغ": "dongfeng", "فاو": "faw",
  "لوسيد": "lucid", "ريفيان": "rivian", "هامر": "hummer", "ماهيندرا": "mahindra",
  "تاتا": "tata", "بوغاتي": "bugatti", "كوينيغسيغ": "koenigsegg", "روكس": "rox",
  "شاومي": "xiaomi", "لي أوتو": "li-auto", "أفاتر": "avatr", "إكس بينغ": "xpeng",
  "دينزا": "denza", "فوياه": "voyah", "ليب موتور": "leapmotor", "ديبال": "deepal",
  "سكاي ويل": "skywell", "أيتو": "aito", "سيريس": "seres", "يانغ وانغ": "yangwang",
  "إم هيرو": "m-hero", "باو": "baw", "إنيوس": "ineos", "بيستون": "bestune",
  "جي دبليو إم": "gwm", "سوي إيست": "soueast", "كايي": "kaiyi", "ماكسوس": "maxus",
  "آركفوكس": "arcfox", "رووي": "roewe", "فورثينغ": "forthing", "دي إف إس كيه": "dfsk",
  "فينغون": "fengon", "كاري": "karry", "ريدارا": "radar", "سايك": "saic", "أيون": "aion",
  "بريليانس": "brilliance", "أبارث": "abarth", "برابوس": "brabus", "شيلبي": "shelby",
  "مرسيدس مايباخ": "mercedes-maybach", "بي إم دبليو ألبينا": "bmw-alpina",
  "فيكتوري": "victory", "سبروس": "spruce", "هينو": "hino", "فوسو": "fuso",
  "إيفيكو": "iveco", "أشوك ليلاند": "ashok-leyland", "كاترهام": "caterham",
  "كان-آم": "can-am", "فورس": "force", "زد إكس أوتو": "zx-auto",
};

export const CITY_SLUGS = {
  "دبي": "dubai", "أبوظبي": "abu-dhabi", "الشارقة": "sharjah", "عجمان": "ajman",
  "رأس الخيمة": "ras-al-khaimah", "الفجيرة": "fujairah", "أم القيوين": "umm-al-quwain",
  "العين": "al-ain",
};

// Budget pages: /used-cars/under/<max>
export const BUDGET_STEPS = [25000, 50000, 100000, 200000];

const invert = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [v, k]));
export const MAKE_BY_SLUG = invert(MAKE_SLUGS);
export const CITY_BY_SLUG = invert(CITY_SLUGS);

export const makeSlug = (make) => MAKE_SLUGS[make] || null;
export const citySlug = (city) => CITY_SLUGS[city] || null;
// Model names are free text (Latin or Arabic): "LS" -> "ls", "لاند كروزر" -> "لاند-كروزر".
export const modelSlug = (model) =>
  String(model || "").trim().toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-").replace(/^-+|-+$/g, "") || null;

// Paths -------------------------------------------------------------------
export const paths = {
  home: () => "/",
  all: () => "/used-cars",
  make: (make) => (makeSlug(make) ? `/used-cars/${makeSlug(make)}` : "/used-cars"),
  city: (city) => (citySlug(city) ? `/used-cars/in/${citySlug(city)}` : "/used-cars"),
  budget: (max) => `/used-cars/under/${max}`,
  model: (make, model) => (makeSlug(make) && modelSlug(model) ? `/used-cars/${makeSlug(make)}/${modelSlug(model)}` : paths.make(make)),
  dealer: (slug) => `/dealer/${slug}`,
  car: (id) => `/car/${id}`,
  vin: () => "/vin-check",
  blog: () => "/blog",
  sell: () => "/sell",
  terms: () => "/terms",
  privacy: () => "/privacy",
  contact: () => "/contact",
  article: (slug) => `/blog/${slug}`,
  news: () => "/news",
  newsItem: (slug) => `/news/${slug}`,
};

// Turns a URL path into what the page shows. Returns null for paths that are
// not ours (e.g. "/"), so callers can fall back to the home page.
//   { kind: "car", id } | { kind: "all" } | { kind: "make", make }
//   { kind: "city", city } | { kind: "budget", max }
//   { kind: "model", make, modelSlug } (the model's display name is looked up
//   from the listings) | { kind: "dealer", slug } | { kind: "vin" } (VIN check tool)
import { newCarKeyForSlug, NEW_CAR_KEYS } from "./new-cars.js";

// Info pages (content in src/legal.js), served at /<slug>.
export const INFO_SLUGS = ["sell", "faq", "safety", "dealers", "about", "contact", "terms", "privacy"];

// English pages live under /en (e.g. /en/used-cars/toyota); same routes.
export const isEnPath = (pathname) => /^\/en(\/|$)/.test(pathname || "");
export const langPath = (path, en) => (!en ? path : path === "/" ? "/en" : `/en${path}`);

export function parsePath(pathname) {
  const p = decodeURIComponent(pathname || "/").replace(/\/+$/, "").replace(/^\/en(?=\/|$)/, "") || "/";
  let m;
  if ((m = p.match(/^\/car\/([^/]+)$/))) return { kind: "car", id: m[1] };
  if (p === "/used-cars") return { kind: "all" };
  if (p === "/vin-check") return { kind: "vin" };
  if (p === "/blog") return { kind: "blog" };
  if (p === "/news") return { kind: "news" };
  if ((m = p.match(/^\/news\/([a-z0-9-]{2,120})$/))) return { kind: "newsItem", slug: m[1] };
  if (INFO_SLUGS.includes(p.slice(1))) return { kind: "info", page: p.slice(1) };
  // New-car price pages (src/new-cars.js), shown with the info-page view.
  if (p === "/new-cars" && NEW_CAR_KEYS().length) return { kind: "info", page: "new-cars" };
  if ((m = p.match(/^\/new-cars\/([a-z0-9-]+)$/)) && newCarKeyForSlug(m[1])) return { kind: "info", page: newCarKeyForSlug(m[1]) };
  if ((m = p.match(/^\/blog\/([a-z0-9-]{2,80})$/))) return { kind: "article", slug: m[1] };
  if ((m = p.match(/^\/used-cars\/in\/([a-z-]+)$/)) && CITY_BY_SLUG[m[1]]) return { kind: "city", city: CITY_BY_SLUG[m[1]] };
  if ((m = p.match(/^\/used-cars\/under\/(\d{4,7})$/))) return { kind: "budget", max: Number(m[1]) };
  if ((m = p.match(/^\/used-cars\/([a-z0-9-]+)$/)) && MAKE_BY_SLUG[m[1]]) return { kind: "make", make: MAKE_BY_SLUG[m[1]] };
  if ((m = p.match(/^\/used-cars\/([a-z0-9-]+)\/([^/]+)$/)) && MAKE_BY_SLUG[m[1]] && modelSlug(m[2]) === m[2]) return { kind: "model", make: MAKE_BY_SLUG[m[1]], modelSlug: m[2] };
  if ((m = p.match(/^\/dealer\/([a-z0-9-]{2,40})$/))) return { kind: "dealer", slug: m[1] };
  return null;
}

// Page copy ---------------------------------------------------------------
const fmt = (n) => new Intl.NumberFormat("ar-AE").format(n);

export function categoryCopy(route, count) {
  const n = count ? `${fmt(count)} ` : "";
  switch (route.kind) {
    case "model": {
      const name = `${route.make} ${route.model || ""}`.trim();
      return {
        h1: `${name} مستعملة للبيع في الإمارات`,
        title: `${name} مستعملة للبيع في الإمارات | ${SITE_NAME}`,
        description: `تصفح ${n}سيارة ${name} مستعملة للبيع في أبوظبي ودبي والشارقة وباقي الإمارات. قارن الأسعار والموديلات والممشى، وتواصل مع البائع مباشرة على ${SITE_NAME}.`,
      };
    }
    case "dealer":
      return {
        h1: `سيارات ${route.name || "الوسيط"} للبيع`,
        title: `سيارات ${route.name || "الوسيط"} للبيع في الإمارات | ${SITE_NAME}`,
        description: `كل السيارات المعروضة من ${route.name || "الوسيط"}${route.verified ? "، وسيط معتمد على " + SITE_NAME : ""}. ${n ? `${n}سيارة ` : ""}بأسعار ومواصفات وصور، وتواصل مباشر.`,
      };
    case "make":
      return {
        h1: `${route.make} مستعملة للبيع في الإمارات`,
        title: `${route.make} مستعملة للبيع في الإمارات | ${SITE_NAME}`,
        description: `تصفح ${n}سيارة ${route.make} مستعملة للبيع في دبي وأبوظبي والشارقة وباقي الإمارات. أسعار ومواصفات وصور، وتواصل مباشر مع البائع بدون وسيط على ${SITE_NAME}.`,
      };
    case "city":
      return {
        h1: `سيارات مستعملة للبيع في ${route.city}`,
        title: `سيارات مستعملة للبيع في ${route.city} | ${SITE_NAME}`,
        description: `${n ? `${n}سيارة` : "سيارات"} مستعملة للبيع في ${route.city} من جميع الماركات. قارن الأسعار والممشى والمواصفات وتواصل مع البائع مباشرة على ${SITE_NAME}.`,
      };
    case "budget":
      return {
        h1: `سيارات مستعملة تحت ${fmt(route.max)} درهم`,
        title: `سيارات مستعملة تحت ${fmt(route.max)} درهم في الإمارات | ${SITE_NAME}`,
        description: `سيارات مستعملة للبيع بسعر أقل من ${fmt(route.max)} درهم في دبي وأبوظبي وباقي الإمارات. تصفح ${n ? `${n}إعلان` : "الإعلانات"} وتواصل مع البائع مباشرة على ${SITE_NAME}.`,
      };
    default:
      return {
        h1: "سيارات مستعملة للبيع في الإمارات",
        title: `سيارات مستعملة للبيع في الإمارات | ${SITE_NAME}`,
        description: `سوق ${SITE_NAME} للسيارات المستعملة في الإمارات: ${n ? `${n}إعلان` : "إعلانات"} من البائعين مباشرة في دبي وأبوظبي والشارقة وباقي الإمارات. انشر سيارتك مجانًا.`,
      };
  }
}

// Make, model and year; skips any that are missing (some imported ads have no model or year).
export function carTitle(l) {
  return [l.make, l.model, l.year].filter(Boolean).join(" ");
}

export function carCopy(l) {
  const bits = [
    l.year && `موديل ${l.year}`,
    l.mileage ? `ممشى ${fmt(l.mileage)} كم` : null,
    l.specs && `مواصفات ${l.specs}`,
    l.city && `في ${l.city}`,
  ].filter(Boolean);
  return {
    title: `${carTitle(l)} للبيع${l.price ? ` بسعر ${fmt(l.price)} درهم` : ""}${l.city ? ` في ${l.city}` : ""} | ${SITE_NAME}`,
    description: `${carTitle(l)} للبيع${l.price ? ` بسعر ${fmt(l.price)} درهم` : ""}، ${bits.join("، ")}. تواصل مع البائع مباشرة على ${SITE_NAME}.`,
  };
}

// A short plain-language summary of a listing, shown on the car page under
// the specs (server page and app). Many imported broker ads have a one-line
// description, so this gives each car page its own readable text.
// Arabic only; the English page gets it through translate() of the parts.
export function carSummary(l) {
  if (!l || !l.make) return "";
  const title = carTitle(l);
  const parts = [
    l.mileage ? `ممشاها ${fmt(l.mileage)} كم` : null,
    l.specs ? `بمواصفات ${l.specs}` : null,
    l.trans ? `وناقل حركة ${l.trans}` : null,
    l.fuel ? `ونوع الوقود ${l.fuel}` : null,
  ].filter(Boolean);
  const first = `${title} ${l.sold ? "كانت معروضة" : "معروضة"} للبيع${l.city ? ` في ${l.city}` : ""}${l.price ? ` بسعر ${fmt(l.price)} درهم` : ""}${l.negotiable ? " قابل للتفاوض" : ""}.`;
  const second = parts.length ? ` السيارة ${parts.join(" ")}.` : "";
  const tip = " قبل الشراء افحص رقم الشاصي مجانًا وطابقه مع الملكية، وافحص السيارة في مركز فحص معتمد.";
  return first + second + tip;
}

// Model pages with fewer live cars than this are kept out of Google (noindex)
// and out of the sitemap: a page with one or two cars is too thin for a new
// site, and Google left ~2,500 such URLs "discovered, not indexed" (Nov 2026).
export const MIN_MODEL_LISTINGS = 3;

// Seller descriptions as shown on the site. Broker ads are copied from
// Instagram captions, so the raw text repeats the same post word for word
// (hashtags, phone numbers, the broker's own disclaimers). On the page we show
// the car details only: hashtags, phone numbers (the call/WhatsApp buttons
// already carry the number) and copied disclaimers are dropped. The broker
// credit line and our own deposit warning stay. The stored row is unchanged.
const OUR_WARNING = "⚠️ لا تحوّل أي عربون قبل ما تفحص السيارة وتشوفها بعينك.";
const PHONE_RE = /(?:\+|00)?971[\s-]?\d(?:[\s-]?\d){7,8}|\b0\d(?:[\s-]?\d){7,8}\b/g;
const CONTACT_TAIL = /[📞📲📱☎️\s]*(?:رقم التواصل|للتواصل|للاتصال|اتصال(?: و ?واتساب)?|واتساب|للاستفسار)[^\p{L}\p{N}]*(?:مع واتساب|والمعاينة|والاستفسار|و ?واتساب)?[^\p{L}\p{N}]*$/u;
const DISCLAIMER = /عربون|جهة إعلانية|إعلانية فقط|دون تحمل|أدنى مسؤولية|غير مسؤول|الحرص|نصيحة|تبحث عن نفس|هنا{3,}|التجار الرجاء|المعارض و ?التجار/;

export function displayDescription(text) {
  if (!text) return "";
  const out = [];
  for (const raw of String(text).replace(/[\u200e\u200f\u2066-\u2069]/g, "").split("\n")) {
    const t = raw.trim();
    if (t === OUR_WARNING || t.startsWith("📢 الإعلان من حساب")) { out.push(t); continue; }
    if (DISCLAIMER.test(t)) continue;
    const line = raw.replace(/#[^\s#]+/g, "").replace(PHONE_RE, "").replace(CONTACT_TAIL, "").trimEnd();
    if (!/[\p{L}\p{N}]/u.test(line)) { if (t === "") out.push(""); continue; }
    out.push(line);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

// Buying guides for makes/models that have one (slugs in src/articles.js).
export const GUIDE_FOR = {
  "نيسان|باترول": "used-nissan-patrol-buying-guide",
  "نيسان|التيما": "used-nissan-altima-buying-guide",
  "تويوتا|لاند كروزر": "used-land-cruiser-buying-guide",
  "لكزس|LX": "used-lexus-lx-buying-guide",
};

// A short market summary for make, model and city pages, built from the live
// listings in that section: typical price, price range, the most common model
// years, the most listed models (make page) or makes (city page) and emirates.
// Gives each category page its own useful text instead of a bare list.
// rows: live listings of the section ({ price, year, make, model, city }).
export function categoryIntro(route, rows) {
  if (!route || !["make", "model", "city"].includes(route.kind) || !rows || rows.length < 2) return null;
  const prices = rows.map((r) => Number(r.price)).filter((p) => p >= 1000).sort((a, b) => a - b);
  const years = rows.map((r) => Number(r.year)).filter((y) => y > 1950).sort((a, b) => a - b);
  const top = (key, n) => {
    const c = {};
    rows.forEach((r) => { if (r[key]) c[r[key]] = (c[r[key]] || 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k);
  };
  const name = route.kind === "city" ? `السيارات المستعملة في ${route.city}`
    : route.kind === "model" ? `${route.make} ${route.model || ""}`.trim() : route.make;
  const parts = [];
  if (prices.length >= 2) {
    const median = prices[Math.floor(prices.length / 2)];
    const round = (n) => Math.round(n / 500) * 500;
    parts.push(`السعر المعتاد ${route.kind === "city" ? "للسيارات المعروضة هنا" : `لسيارات ${name} المعروضة`} حوالي ${fmt(round(median))} درهم، ويختلف حسب السنة والممشى والحالة.`);
  }
  if (years.length >= 2) {
    const mid = years.slice(Math.floor(years.length * 0.25), Math.ceil(years.length * 0.75));
    const lo = mid[0], hi = mid[mid.length - 1];
    parts.push(lo === hi ? `أغلب السيارات موديل ${lo}.` : `أغلب السيارات المعروضة من موديلات ${lo} إلى ${hi}.`);
  }
  if (route.kind === "make") {
    const m = top("model", 4);
    if (m.length > 1) parts.push(`أكثر الموديلات المعروضة: ${m.join("، ")}.`);
  }
  if (route.kind === "city") {
    const m = top("make", 5);
    if (m.length > 1) parts.push(`أكثر الماركات المعروضة: ${m.join("، ")}.`);
  } else {
    const c = top("city", 3);
    if (c.length > 1) parts.push(`وأغلبها في ${c.join(" و")}.`);
  }
  if (!parts.length) return null;
  const guide = route.kind === "city" ? null : GUIDE_FOR[`${route.make}|${route.model || ""}`]
    || Object.entries(GUIDE_FOR).find(([k]) => route.kind === "make" && k.startsWith(`${route.make}|`))?.[1] || null;
  return { text: parts.join(" "), guide };
}
