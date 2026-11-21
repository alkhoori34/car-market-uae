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
  // {
  //   make: "جيتور", slug: "jetour", usedSlug: "jetour", en: "Jetour",
  //   distributor: "ذا إيليت كارز (The Elite Cars)", site: "https://jetouruae.com",
  //   checked: "2026-11-21", vat: true,
  //   models: [{ name: "T2", from: 146000, note: "2.0 تيربو، دفع رباعي" }],
  // },
];

const live = () => NEW_CAR_BRANDS.filter((b) => b.models && b.models.length);
export const NEW_CAR_KEYS = () => live().map((b) => `new-${b.slug}`);
export const newCarKeyForSlug = (slug) => (live().some((b) => b.slug === slug) ? `new-${slug}` : null);
export const newCarPathForMake = (make) => { const b = live().find((x) => x.make === make); return b ? `/new-cars/${b.slug}` : null; };

const dateAr = (d) => new Intl.DateTimeFormat("ar-AE", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dubai" }).format(new Date(d));

function brandPage(b) {
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
      ["p", `هذي أسعار سيارات ${b.make} الجديدة في الإمارات كما يعرضها الوكيل الرسمي ${b.distributor}. أرخص موديل ${b.make} ${cheapest.name} يبدأ من ${fmt(cheapest.from)} درهم، وأغلى موديل ${b.make} ${top.name} يبدأ من ${fmt(top.from)} درهم.`],
      ["h2", `قائمة أسعار ${b.make} الجديدة`],
      ["ul", ms.map((m) => `${b.make} ${m.name}: يبدأ من ${fmt(m.from)} درهم${m.note ? ` (${m.note})` : ""}`)],
      ["tip", `الأسعار من الموقع الرسمي للوكيل بتاريخ ${dateAr(b.checked)}${b.vat ? "، شاملة ضريبة القيمة المضافة" : ""}. الأسعار والعروض تتغير، فتأكد من السعر النهائي مع الوكيل قبل الشراء.`],
      ["h2", `تبي ${b.make} مستعملة بسعر أقل؟`],
      ["p", `السيارة الجديدة تخسر جزء كبير من قيمتها في أول سنتين. شوف سيارات ${b.make} المستعملة المعروضة الحين في الإمارات، وقارن سعرها بسعر الوكالة فوق.`],
      ["cta", { text: `سيارات ${b.make} المستعملة للبيع في الإمارات.`, href: `/used-cars/${b.usedSlug}`, label: `تصفح ${b.make} المستعملة` }],
      ["faq", [
        [`كم سعر أرخص ${b.make} جديدة في الإمارات؟`, `${b.make} ${cheapest.name} يبدأ من ${fmt(cheapest.from)} درهم حسب الوكيل الرسمي بتاريخ ${dateAr(b.checked)}.`],
        [`من وكيل ${b.make} في الإمارات؟`, `الوكيل الرسمي لـ ${b.make} في الإمارات هو ${b.distributor}. الموقع: ${b.site}`],
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
