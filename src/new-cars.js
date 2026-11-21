// New-car prices (أسعار السيارات الجديدة) at /new-cars and /new-cars/<slug>.
// Owner's request 2026-11-21: price pages for the Chinese brands buyers search
// for in the UAE. RULE: every price comes from the brand's OFFICIAL UAE
// distributor site (or its own press release), with the date it was checked.
// Never copy prices from other marketplaces (YallaMotor, DubiCars …): they
// disagree with each other by tens of thousands of dirhams.
// A brand appears only once it has at least one checked model price.
// Pages are built as info pages (same block format as src/legal.js), Arabic
// only (/en copies are noindex), so the app and api/page.js render them.

const fmt = (n) => new Intl.NumberFormat("ar-AE").format(n);

// make = Arabic name exactly as in MODELS (App.jsx); usedSlug = MAKE_SLUGS slug.
export const NEW_CAR_BRANDS = [
  {
    make: "تويوتا", slug: "toyota", usedSlug: "toyota", en: "Toyota",
    distributor: "الفطيم للسيارات (Al-Futtaim Motors)", site: "https://www.toyota.ae",
    checked: "2026-11-21", priceNote: "",
    models: [
      { name: "Raize", from: 63899 },
      { name: "Yaris", from: 64900 },
      { name: "LiteAce", from: 69900 },
      { name: "Corolla", from: 76900 },
      { name: "Urban Cruiser", from: 79900 },
      { name: "Veloz", from: 81900 },
      { name: "Corolla Cross", from: 86900 },
      { name: "Corolla Hybrid", from: 89900, note: "هايبرد" },
      { name: "Corolla Cross Hybrid", from: 96900, note: "هايبرد" },
      { name: "Hiace", from: 99900 },
      { name: "RAV4", from: 105900 },
      { name: "RAV4 Hybrid", from: 114900, note: "هايبرد" },
      { name: "Hilux", from: 120900 },
      { name: "Camry", from: 122900 },
      { name: "Camry Hybrid", from: 125900, note: "هايبرد" },
      { name: "Innova Hybrid", from: 126900, note: "هايبرد" },
      { name: "Fortuner", from: 128900 },
      { name: "Land Cruiser FJ", from: 139900 },
      { name: "RAV4 PHEV", from: 154900, note: "هايبرد قابل للشحن" },
      { name: "GR86", from: 162900 },
      { name: "Land Cruiser 70", from: 177900 },
      { name: "GR Yaris", from: 177900 },
      { name: "GR Corolla", from: 182900 },
      { name: "bZ4X Touring", from: 184900, note: "كهربائية" },
      { name: "Land Cruiser Prado", from: 199900 },
      { name: "Crown Hybrid", from: 199900, note: "هايبرد" },
      { name: "Highlander Hybrid", from: 205900, note: "هايبرد" },
      { name: "Granvia", from: 216900 },
      { name: "Coaster", from: 218900 },
      { name: "GR Supra", from: 238900 },
      { name: "Land Cruiser", from: 239900 },
      { name: "Land Cruiser Hybrid", from: 345900, note: "هايبرد" },
    ],
  },
  {
    make: "لكزس", slug: "lexus", usedSlug: "lexus", en: "Lexus",
    distributor: "الفطيم للسيارات (Al-Futtaim Motors)", site: "https://www.lexus.ae",
    checked: "2026-11-21", priceNote: "",
    models: [
      { name: "UX300h", from: 172000 },
      { name: "IS300", from: 185000 },
      { name: "IS350", from: 199000 },
      { name: "NX350", from: 213000 },
      { name: "NX350h", from: 223000 },
      { name: "ES300h", from: 225000 },
      { name: "ES350h", from: 230000 },
      { name: "ES350", from: 240000 },
      { name: "RZ500e", from: 255000, note: "كهربائية" },
      { name: "RC350", from: 264000 },
      { name: "RX350h", from: 267000 },
      { name: "ES500e", from: 275000, note: "كهربائية" },
      { name: "RX350", from: 287000 },
      { name: "RX500h", from: 363000 },
      { name: "LS350/500", from: 367000 },
      { name: "RC F", from: 395000 },
      { name: "LS500h", from: 457000 },
      { name: "LC500", from: 462000 },
      { name: "LX600", from: 490000 },
      { name: "LC500 Convertible", from: 503000 },
      { name: "LX700h", from: 590000 },
    ],
  },
  {
    make: "نيسان", slug: "nissan", usedSlug: "nissan", en: "Nissan",
    distributor: "", site: "https://en.nissan-dubai.com",
    checked: "2026-11-21", priceNote: "شاملة ضريبة 5%، وهي أسعار موقع نيسان دبي، وقد تختلف قليلًا في أبوظبي",
    models: [
      { name: "Magnite", from: 59900 },
      { name: "Urvan", from: 91900 },
      { name: "X-Trail", from: 105900 },
      { name: "Altima", from: 110500 },
      { name: "X-Terra", from: 116900 },
      { name: "Z", from: 215900 },
      { name: "Patrol", from: 239900 },
    ],
  },
  {
    make: "شيفروليه", slug: "chevrolet", usedSlug: "chevrolet", en: "Chevrolet",
    distributor: "", site: "https://www.chevroletarabia.com/ae-en",
    checked: "2026-11-21", priceNote: "",
    models: [
      { name: "Groove", from: 64000 },
      { name: "Captiva", from: 75700 },
      { name: "Spark EUV", from: 79900, note: "كهربائية" },
      { name: "Captiva PHEV", from: 104900, note: "هايبرد قابل للشحن" },
      { name: "Captiva EV", from: 109900, note: "كهربائية" },
      { name: "Silverado LD", from: 162700 },
      { name: "Equinox EV", from: 169900, note: "كهربائية" },
      { name: "Traverse", from: 173400 },
      { name: "Silverado HD", from: 197800 },
      { name: "Tahoe", from: 231600 },
      { name: "Suburban", from: 242000 },
      { name: "Corvette Stingray", from: 352400 },
      { name: "Corvette E-Ray", from: 603400 },
      { name: "Corvette Z06", from: 646700 },
      { name: "Corvette ZR1", from: 871000 },
    ],
  },
  {
    make: "جي إم سي", slug: "gmc", usedSlug: "gmc", en: "GMC",
    distributor: "", site: "https://www.gmcarabia.com/ae-en",
    checked: "2026-11-21", priceNote: "",
    models: [
      { name: "Terrain", from: 117100 },
      { name: "Sierra LD", from: 167400 },
      { name: "Acadia", from: 190800 },
      { name: "Sierra HD", from: 198700 },
      { name: "Canyon AT4X", from: 204100 },
      { name: "Yukon", from: 252100 },
      { name: "Hummer EV SUV", from: 519000, note: "كهربائية" },
      { name: "Hummer EV Pickup", from: 529100, note: "كهربائية" },
    ],
  },
  {
    make: "مازدا", slug: "mazda", usedSlug: "mazda", en: "Mazda",
    distributor: "", site: "https://mazda-uae.com",
    checked: "2026-11-21", priceNote: "",
    models: [
      { name: "Mazda3 Sedan", from: 79000 },
      { name: "Mazda CX-3", from: 79000 },
      { name: "Mazda6 Sedan", from: 90000 },
      { name: "Mazda CX-30", from: 95000 },
      { name: "Mazda CX-5", from: 105000 },
      { name: "Mazda3 Hatchback", from: 110000 },
      { name: "Mazda MX-5", from: 149000 },
      { name: "Mazda CX-60", from: 165000 },
      { name: "Mazda CX-90", from: 169000 },
    ],
  },
  {
    make: "بي واي دي", slug: "byd", usedSlug: "byd", en: "BYD",
    distributor: "الفطيم للتنقل الكهربائي (Al-Futtaim Electric Mobility)", site: "https://www.byduae.ae",
    checked: "2026-11-21", priceNote: "شاملة ضريبة القيمة المضافة، وتضاف لها رسوم الشحن والتجهيز حسب الوكيل",
    models: [
      { name: "Sealion 5", from: 89900, note: "سوبر هايبرد" },
      { name: "Seal 6", from: 92900, note: "سوبر هايبرد" },
      { name: "Seal 7", from: 115900, note: "سوبر هايبرد" },
      { name: "Song Plus", from: 125900, note: "سوبر هايبرد" },
      { name: "Seal", from: 149900, note: "كهربائية بالكامل" },
      { name: "Ti 7", from: 157900, note: "سوبر هايبرد، 7 مقاعد" },
      { name: "Sealion 7", from: 158900, note: "كهربائية بالكامل" },
      { name: "Atto 8", from: 166900, note: "سوبر هايبرد" },
      { name: "Shark 6", from: 167900, note: "سوبر هايبرد" },
    ],
  },
  {
    make: "شيري", slug: "chery", usedSlug: "chery", en: "Chery",
    distributor: "عبدالواحد الرستماني للسيارات (AW Rostamani Automotive)", site: "https://www.cheryuae.com",
    checked: "2026-11-21", priceNote: "",
    models: [
      { name: "Arrizo 5", from: 57900 },
      { name: "Tiggo 4", from: 69900 },
      { name: "Tiggo 7 Champion", from: 74500 },
      { name: "Arrizo 8 Plug-in Hybrid", from: 79900, note: "هايبرد قابل للشحن" },
      { name: "Himava", from: 79900, note: "بيك أب" },
      { name: "Tiggo 7", from: 94900 },
      { name: "Tiggo 8", from: 94900 },
      { name: "Tiggo 7 Super Hybrid", from: 105000, note: "سوبر هايبرد" },
      { name: "Tiggo 8 Super Hybrid", from: 119900, note: "سوبر هايبرد" },
      { name: "Tiggo 9 Super Hybrid", from: 135000, note: "سوبر هايبرد" },
      { name: "Tiggo 9", from: 142900 },
    ],
  },
  {
    make: "إم جي", slug: "mg", usedSlug: "mg", en: "MG",
    distributor: "", site: "https://www.mg-uae.com",
    checked: "2026-11-21", priceNote: "",
    models: [
      { name: "MG3", from: 45893, note: "هاتشباك" },
      { name: "MG5", from: 51126 },
      { name: "MG ZS", from: 59453 },
      { name: "MG GT", from: 68448 },
      { name: "MG ONE", from: 70309 },
      { name: "MG HS", from: 91950 },
      { name: "MG HS Hybrid+", from: 92027, note: "هايبرد" },
      { name: "MG7", from: 98547 },
      { name: "MG Rakan", from: 110662 },
      { name: "MG RX9", from: 115530 },
      { name: "MG Cyberster", from: 237803 },
    ],
  },
];

const live = () => NEW_CAR_BRANDS.filter((b) => b.models && b.models.length);
export const NEW_CAR_KEYS = () => live().map((b) => `new-${b.slug}`);
export const newCarKeyForSlug = (slug) => (live().some((b) => b.slug === slug) ? `new-${slug}` : null);
export const newCarPathForMake = (make) => { const b = live().find((x) => x.make === make); return b ? `/new-cars/${b.slug}` : null; };

const dateAr = (d) => new Intl.DateTimeFormat("ar-AE", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dubai" }).format(new Date(d));

function brandPage(b) {
  const label = (m) => (m.name.toUpperCase().startsWith(b.en.toUpperCase()) ? m.name : `${b.make} ${m.name}`);
  const ms = [...b.models].sort((a, c) => a.from - c.from);
  const cheapest = ms[0];
  const top = ms[ms.length - 1];
  const year = new Date(b.checked).getFullYear();
  return {
    path: `/new-cars/${b.slug}`,
    title: `أسعار سيارات ${b.make} الجديدة في الإمارات ${year}`,
    short: `أسعار ${b.make}`,
    priority: "0.7",
    arOnly: true,
    description: `أسعار ${b.make} الجديدة في الإمارات من الوكيل الرسمي: ${ms.length} موديل تبدأ من ${fmt(cheapest.from)} درهم. قارن مع أسعار ${b.make} المستعملة على CarsUAE.`,
    body: [
      ["p", `هذي أسعار سيارات ${b.make} الجديدة في الإمارات كما يعرضها ${b.distributor ? `الوكيل الرسمي ${b.distributor}` : "الموقع الرسمي للماركة في الإمارات"}. أرخص موديل ${label(cheapest)} يبدأ من ${fmt(cheapest.from)} درهم، وأغلى موديل ${label(top)} يبدأ من ${fmt(top.from)} درهم.`],
      ["h2", `قائمة أسعار ${b.make} الجديدة`],
      ["ul", ms.map((m) => `${label(m)}: يبدأ من ${fmt(m.from)} درهم${m.note ? ` (${m.note})` : ""}`)],
      ["tip", `الأسعار «تبدأ من» كما في الموقع الرسمي (${b.site.replace("https://", "")}) بتاريخ ${dateAr(b.checked)}${b.priceNote ? `، ${b.priceNote}` : ""}. الأسعار والعروض تتغير، فتأكد من السعر النهائي مع الوكيل قبل الشراء.`],
      ["h2", `تبي ${b.make} مستعملة بسعر أقل؟`],
      ["p", `السيارة الجديدة تخسر جزء كبير من قيمتها في أول سنتين. شوف سيارات ${b.make} المستعملة المعروضة الحين في الإمارات، وقارن سعرها بسعر الوكالة فوق.`],
      ["cta", { text: `سيارات ${b.make} المستعملة للبيع في الإمارات.`, href: `/used-cars/${b.usedSlug}`, label: `تصفح ${b.make} المستعملة` }],
      ["faq", [
        [`كم سعر أرخص ${b.make} جديدة في الإمارات؟`, `${label(cheapest)} يبدأ من ${fmt(cheapest.from)} درهم حسب الموقع الرسمي بتاريخ ${dateAr(b.checked)}.`],
        ...(b.distributor ? [[`من وكيل ${b.make} في الإمارات؟`, `الوكيل الرسمي لـ ${b.make} في الإمارات هو ${b.distributor}. الموقع: ${b.site}`]] : []),
        [`هل أشتري ${b.make} جديدة ولا مستعملة؟`, `الجديدة تجي بضمان الوكيل كامل، والمستعملة أرخص بكثير. إذا اشتريت مستعملة افحص رقم الشاصي وتأكد إن الضمان باقي ويتحول لك.`],
      ]],
      ["cta", { text: "قبل ما تشتري مستعملة، افحص رقم الشاصي مجانًا.", href: "/vin-check", label: "فحص رقم الشاصي" }],
    ],
  };
}

function indexPage() {
  const bs = live();
  return {
    path: "/new-cars",
    title: "أسعار السيارات الجديدة في الإمارات",
    short: "أسعار السيارات الجديدة",
    priority: "0.7",
    arOnly: true,
    description: `أسعار السيارات الجديدة في الإمارات من الوكلاء الرسميين: ${bs.map((b) => b.make).join("، ")}. مع روابط للسيارات المستعملة من نفس الماركة.`,
    body: [
      ["p", "أسعار السيارات الجديدة من الوكلاء الرسميين في الإمارات، مع تاريخ آخر تحديث لكل ماركة. اختر الماركة:"],
      ["ul", bs.map((b) => `${b.make}: من ${fmt(Math.min(...b.models.map((m) => m.from)))} درهم`)],
      ...bs.map((b) => ["cta", { text: `أسعار ${b.make} الجديدة (${b.models.length} موديل).`, href: `/new-cars/${b.slug}`, label: `أسعار ${b.make}` }]),
    ],
  };
}

// Info-page entries keyed like INFO_PAGES ("new-cars", "new-<slug>").
export function newCarInfoPages() {
  const bs = live();
  if (!bs.length) return {};
  return { "new-cars": indexPage(), ...Object.fromEntries(bs.map((b) => [`new-${b.slug}`, brandPage(b)])) };
}
