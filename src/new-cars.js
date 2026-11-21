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
