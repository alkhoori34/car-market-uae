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
};

// Turns a URL path into what the page shows. Returns null for paths that are
// not ours (e.g. "/"), so callers can fall back to the home page.
//   { kind: "car", id } | { kind: "all" } | { kind: "make", make }
//   { kind: "city", city } | { kind: "budget", max }
//   { kind: "model", make, modelSlug } (the model's display name is looked up
//   from the listings) | { kind: "dealer", slug } | { kind: "vin" } (VIN check tool)
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
  if (INFO_SLUGS.includes(p.slice(1))) return { kind: "info", page: p.slice(1) };
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

export function carTitle(l) {
  return `${l.make} ${l.model} ${l.year}`;
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
