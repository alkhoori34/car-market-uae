// Reads a broker's Instagram caption and guesses the listing fields.
// Used by the admin Instagram importer (src/Importer.jsx). Every guess is
// shown to the admin for review before anything is published.

const MAKES = [
  ["مرسيدس", /مرسيدس|مرسدس|مارسيدس|مرسيدش|mercedes|benz|بنز|amg|g ?63|g ?500|s ?500|e ?300|c ?300|glc|gle|gls|cls|مايباخ/i],
  ["بي إم دبليو", /bmw|بي ?ام|بي إم|بيم|\bm[2-8]\b|\bx[3-7]\b/i],
  ["رولز رويس", /رولز|روز رايز|rolls|كولينان|cullinan|غوست|ghost|فانتوم/i],
  ["بي واي دي", /\bbyd\b|بي واي دي|ليوبارد|leopard/i],
  ["روكس", /\brox\b|روكس|رووكس|ادماس|admas|adamas/i],
  ["جي إم سي", /جمس|جي ام سي|gmc|يوكن|يوكون|yukon|سييرا|sierra|دينالي|denali/i],
  ["لكزس", /لكزس|ليكزس|lexus|\blx ?\d|\bes ?\d|\brc ?\d|\bis ?\d|\bls ?\d|\bgx ?\d|\brx ?\d/i],
  ["نيسان", /نيسان|nissan|باترول|بترول se|patrol|صني|sunny|التيما|altima|فتك|نيسمو|nismo|ارمادا|armada|باثفايندر|pathfinder|ماكسيما|maxima|سفاري|safari|gtr/i],
  ["تويوتا", /تويوتا|تيوتا|toyota|لاند ?كروزر|لاندكروز|landcruiser|land cruiser|استيشن|ستيشن|تندرا|تاندرا|tundra|تاكوما|tacoma|كامري|camry|فورتشنر|fortuner|برادو|prado|هايلكس|هايلوكس|hilux|كورولا|corolla|سيكويا|sequoia|يارس|راف ?فور|افالون|vxr|gxr/i],
  ["إنفينيتي", /انفنتي|انفينيتي|انفنيتي|infiniti|qx ?\d/i],
  ["كاديلاك", /كاديلاك|كادلك|cadillac|اسكاليد|escalade/i],
  ["شيفروليه", /شفر|شيفرو|شفرل|chevrolet|chevy|تاهو|tahoe|كابرس|caprice|سلفرادو|silverado|كمارو|camaro|كورفيت|كورفت|corvette|سوبربان|suburban|امبالا/i],
  ["فورد", /فورد|ford|موستنج|موستانج|mustang|رابتر|raptor|f-?150|اكسبلورر|explorer|برونكو|bronco|اكسبديشن|تورس|taurus/i],
  ["دودج", /دودج|dodge|تشارجر|charger|جالنجر|challenger|دورانجو|durango/i],
  ["رام", /\bram\b|رام \d|trx/i],
  ["جيب", /جيب|jeep|رانجلر|رانقلر|wrangler|جراند ?شيروكي|كراند شيروكي|grand cherokee|شيروكي/i],
  ["لاند روفر", /رنج|رينج|range|دفندر|ديفندر|defender|لاند ?روفر|land ?rover|ڤـوج|فوج|vogue|ايفوك|evoque|ديسكفري|discovery/i],
  ["بورش", /بورش|porsche|كايين|كاين|cayenne|ماكان|macan|باناميرا|panamera|911|كاريرا|بوكستر|boxster/i],
  ["أودي", /اودي|أودي|audi|\brs ?\d|\bq[5-8]\b|\ba[4-8]\b/i],
  ["فولكس واجن", /فولكس|volkswagen|\bvw\b|جولف|قولف|golf|طوارق|touareg|تيرامونت/i],
  ["كيا", /كيا|kia|سورينتو|sorento|سبورتاج|sportage|تيلورايد|ترولايت|telluride|كادينزا|اوبتيما|سيراتو|كارنفال/i],
  ["هيونداي", /هيونداي|هونداي|hyundai|النترا|elantra|سوناتا|sonata|توسان|tucson|سنتافي|santa fe|باليسيد|palisade|اكسنت|ازيرا/i],
  ["جينيسيس", /جينيسيس|جنسس|genesis|g80|g90|gv80/i],
  ["ميتسوبيشي", /ميتسوبيشي|متسوبيشي|mitsubishi|باجيرو|pajero|لانسر|lancer|l200/i],
  ["هوندا", /هوندا|honda|اكورد|accord|سيفيك|civic|بايلوت|pilot|crv|cr-v|اوديسي/i],
  ["مازدا", /مازدا|mazda|cx-?\d/i],
  ["لينكولن", /لينكولن|لنكولن|lincoln|نافيجيتور|navigator/i],
  ["بنتلي", /بنتلي|bentley|بنتايجا|بنتيايجا/i],["مِيني", /ميني كوبر|mini cooper/i],
  ["فيراري", /فيراري|ferrari/i],
  ["لامبورغيني", /لامبورغيني|لمبرقيني|لامبورجيني|lamborghini|اوروس|urus/i],
  ["مازيراتي", /مازيراتي|maserati/i],
  ["تسلا", /تسلا|tesla/i],
  ["هامر", /همر|هامر|hummer/i],
  ["سوزوكي", /سوزوكي|suzuki|جمني|jimny|سويفت/i],
  ["إيسوزو", /ايسوزو|إيسوزو|isuzu/i],
  ["جيتور", /جيتور|jetour/i],
  ["شانجان", /شانجان|changan/i],
  ["إم جي", /\bmg\b|ام جي/i],
  ["جيلي", /جيلي|geely/i],
  ["هافال", /هافال|haval/i],
  ["تانك", /\btank ?\d|تانك/i],
  ["جاكوار", /جاكوار|jaguar/i],
  ["فولفو", /فولفو|volvo/i],
  ["بيجو", /بيجو|peugeot/i],
  ["رينو", /رينو|renault/i],
];

const MODELS = {
  "تويوتا": [["برادو", /برادو|prado/i], ["لاند كروزر", /لاند ?كروزر|لاندكروز|land ?cruiser|استيشن|ستيشن|vxr|gxr|exr/i], ["تندرا", /تندرا|تاندرا|tundra/i], ["تاكوما", /تاكوما|tacoma/i], ["كامري", /كامري|camry/i], ["فورتشنر", /فورتشنر|fortuner/i], ["هايلكس", /هايلكس|هايلوكس|hilux/i], ["كورولا", /كورولا|corolla/i], ["سيكويا", /سيكويا|sequoia/i], ["يارس", /يارس|yaris/i], ["راف فور", /راف ?فور|rav ?4/i], ["أفالون", /افالون|avalon/i], ["إف جي كروزر", /اف ?جي|\bfj\b/i], ["سوبرا", /supra|سوبرا/i]],
  "نيسان": [["باترول سفاري", /سفاري|safari|فتك/i], ["باترول", /باترول|بترول se|patrol|نيسمو|nismo|بلاتينيوم|تيتانيوم|platinum|titanium/i], ["التيما", /التيما|altima/i], ["صني", /صني|sunny/i], ["أرمادا", /ارمادا|armada/i], ["باثفايندر", /باثفايندر|pathfinder/i], ["مكسيما", /ماكسيما|مكسيما|maxima/i], ["GT-R", /gtr|gt-r/i], ["إكس تريل", /تريل|x-?trail/i]],
  "لكزس": [["LX", /\blx|ال اكس/i], ["ES", /\bes ?\d/i], ["RC", /\brc ?\d|\brc\b/i], ["IS", /\bis ?\d|\bisf\b/i], ["LS", /\bls ?\d/i], ["GX", /\bgx ?\d/i], ["RX", /\brx ?\d/i], ["NX", /\bnx ?\d/i]],
  "مرسيدس": [["الفئة G", /\bg ?\d{2,3}\b|جي ?63|جي كلاس|g-?class|g ?wagon/i], ["AMG GT", /amg ?gt|\bgtr\b|gt r/i], ["CLS", /cls/i], ["GLC", /glc/i], ["GLE", /gle/i], ["GLS", /gls/i], ["GLA", /gla/i], ["CLA", /cla/i], ["الفئة S", /\bs ?\d{3}|s-?class|اس كلاس/i], ["الفئة E", /\be ?\d{3}|e-?class|اي كلاس/i], ["الفئة C", /\bc ?\d{3}|c-?class|سي كلاس/i], ["الفئة A", /\ba ?\d{3}\b|a-?class/i]],
  "بي إم دبليو": [["الفئة 7", /\b7\d\d|7 ?series|الفئة السابعة/i], ["الفئة 5", /\b5\d\d[a-z]|5 ?series|\bm5\b/i], ["الفئة 4", /\b4\d\d[a-z]|\bm4\b/i], ["الفئة 3", /\b3\d\d[a-z]|\bm3\b/i], ["X5", /x5/i], ["X6", /x6/i], ["X7", /x7/i], ["X3", /x3/i], ["X4", /x4/i]],
  "جي إم سي": [["يوكن", /يوكن|يوكون|yukon|دينالي|denali/i], ["سييرا", /سييرا|sierra/i], ["أكاديا", /اكاديا|acadia/i]],
  "شيفروليه": [["تاهو", /تاهو|tahoe/i], ["كابريس", /كابرس|كابريس|caprice/i], ["سيلفرادو", /سلفرادو|سيلفرادو|silverado/i], ["كامارو", /كمارو|كامارو|camaro/i], ["سوبربان", /سوبربان|suburban/i], ["كورفيت", /كورفيت|كورفت|corvette/i], ["SSR", /\bssr\b/i]],
  "فورد": [["F-150", /f-?150|رابتر|raptor/i], ["موستنج", /موستنج|موستانج|mustang/i], ["إكسبلورر", /اكسبلورر|explorer/i], ["إكسبيديشن", /اكسبديشن|اكسبيديشن|expedition/i], ["برونكو", /برونكو|bronco/i], ["تورس", /تورس|taurus/i]],
  "دودج": [["تشارجر", /تشارجر|charger/i], ["تشالنجر", /جالنجر|تشالنجر|challenger/i], ["دورانجو", /دورانجو|durango/i]],
  "رام": [["TRX", /trx/i], ["1500", /1500/], ["2500", /2500/]],
  "جيب": [["رانجلر", /رانجلر|رانقلر|wrangler/i], ["جراند شيروكي", /جراند|كراند|grand/i], ["غلاديتور", /غلاديتور|gladiator/i]],
  "لاند روفر": [["ديفندر", /دفندر|ديفندر|defender/i], ["رينج روفر سبورت", /رنج سبورت|رينج سبورت|range rover sport/i], ["إيفوك", /ايفوك|evoque/i], ["فيلار", /فيلار|velar/i], ["ديسكفري", /ديسكفري|discovery/i], ["رينج روفر", /رنج|رينج|range|فوج|vogue/i]],
  "بورش": [["كايين", /كايين|كاين|cayenne/i], ["ماكان", /ماكان|macan/i], ["باناميرا", /باناميرا|panamera/i], ["بوكستر", /بوكستر|boxster/i], ["911", /911|كاريرا|carrera/i], ["تايكان", /تايكان|taycan/i]],
  "كيا": [["تيلورايد", /تيلورايد|ترولايت|telluride/i], ["سورينتو", /سورينتو|sorento/i], ["سبورتاج", /سبورتاج|sportage/i], ["كارنيفال", /كارنفال|كارنيفال|carnival/i], ["K5", /k5|اوبتيما/i], ["سيراتو", /سيراتو|cerato/i]],
  "هيونداي": [["النترا", /النترا|elantra/i], ["سوناتا", /سوناتا|sonata/i], ["توسان", /توسان|tucson/i], ["سنتافي", /سنتافي|santa/i], ["باليسايد", /باليسيد|باليسايد|palisade/i]],
  "كاديلاك": [["إسكاليد", /اسكاليد|escalade/i]],
  "إنفينيتي": [["QX80", /qx ?80|qx56/i], ["QX60", /qx ?60/i], ["Q50", /q ?50/i]],
  "ميتسوبيشي": [["باجيرو", /باجيرو|pajero/i], ["لانسر", /لانسر|lancer/i], ["L200", /l200/i]],
  "هوندا": [["أكورد", /اكورد|accord/i], ["سيفيك", /سيفيك|civic/i], ["بايلوت", /بايلوت|pilot/i]],
  "أودي": [["A6", /\ba6/i], ["A8", /\ba8/i], ["Q7", /\bq7/i], ["Q8", /q8/i], ["RS6", /rs ?6/i]],
  "فولكس واجن": [["طوارق", /طوارق|touareg/i], ["جولف", /جولف|قولف|golf|gti/i], ["تيرامونت", /تيرامونت|teramont/i]],
  "رولز رويس": [["كولينان", /كولينان|cullinan/i], ["غوست", /غوست|ghost/i], ["فانتوم", /فانتوم|phantom/i]],
  "بي واي دي": [["ليوبارد 5", /ليوبارد|leopard/i], ["كين بلس", /qin/i], ["سيل 05", /seal/i], ["ديستروير 05", /destroyer/i]],
  "روكس": [["أداماس", /ادماس|admas|adamas/i], ["01", /\b01\b/]],
  "تسلا": [["Model 3", /model ?3|مودل 3/i], ["Model Y", /model ?y/i], ["Model S", /model ?s/i], ["Model X", /model ?x/i]],
  "جيتور": [["T2", /\bt2\b/i], ["X70", /x70/i], ["X90", /x90/i]],
  "بيجو": [["بارتنر", /بارتنر|partner/i]],
};

const SUV = "دفع رباعي (SUV)";
const BODY = [
  [/لاند كروزر|باترول|برادو|فورتشنر|سيكويا|LX|GX|RX|NX|الفئة G|GLC|GLA|GLE|GLS|يوكن|تاهو|سوبربان|ديفندر|رينج|إيفوك|فيلار|ديسكفري|كايين|ماكان|رانجلر|جراند شيروكي|أرمادا|باثفايندر|طوارق|تيرامونت|تيلورايد|سورينتو|سبورتاج|سنتافي|توسان|باليسايد|أداماس|^01$|T2|X70|X90|QX|ليوبارد|إسكاليد|كولينان|X\d|إكسبلورر|إكسبيديشن|برونكو|دورانجو|نافيجيتور|باجيرو|بايلوت|Q7|Q8/, SUV],
  [/تندرا|تاكوما|سييرا|سيلفرادو|هايلكس|TRX|SSR|F-150|1500|2500|L200|غلاديتور/, "بيك أب"],
  [/كورفيت|911|بوكستر|AMG GT|GT-R|كامارو|موستنج|سوبرا/, "رياضية"],
  [/RC|الفئة 4|تشالنجر/, "كوبيه"],
  [/بارتنر/, "فان"],
];

const toAsciiDigits = (s) => s.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
const num = (s) => parseFloat(String(s).replace(/[,٬،]/g, ""));

// Why a post should not become a listing ("" means it is a car for sale).
export function excludeReason(caption, imageCount) {
  const c = toAsciiDigits(caption || "");
  const carish = /موديل|مديل|الموديل|ماشي|ممشى|الممشى|كيلو|km|خليجي|وارد|سلندر|model|mileage|\b(19|20)\d\d\b/i;
  if (!imageCount) return "فيديو بدون صور";
  if (/تم البيع|\bsold\b|تم بيع/i.test(c)) return "تم البيع";
  if (/نشتري|we buy/i.test(c)) return "إعلان شراء";
  if (/(رنق|رنقات|جنوط|جنط|rims)/i.test(c) && !carish.test(c)) return "رنقات";
  if (/(رقم|لوح|plate)/i.test(c) && !carish.test(c)) return "رقم سيارة";
  if (/دباب|دراجة|motorcycle|قارب|طراد|جت ?سكي|jet ?ski|polaris|rzr|can-?am|بانشي|بانشى/i.test(c)) return "مو سيارة";
  if (/غسيل سيارات|رخصة تجارية|رخصه تجاريه/i.test(c)) return "مشروع تجاري";
  if (!carish.test(c)) return "بدون وصف";
  return "";
}

export function parseCaption(caption) {
  const c = toAsciiDigits(caption || "").replace(/[‎‏]/g, "");
  const make = (MAKES.find(([, r]) => r.test(c)) || [""])[0];
  const model = ((MODELS[make] || []).find(([, r]) => r.test(c)) || [""])[0];
  const years = (c.match(/\b(19[6-9]\d|20[0-2]\d)\b/g) || []).map(Number).filter((y) => y <= new Date().getFullYear() + 1);

  let price = null;
  let priceCheck = false;
  const p = c.match(/(?:السعر|سعر|مطلوب|المطلوب|price|بسعر|السوم)[^\d\n]{0,18}([\d][\d.,٬،]*)\s*(الف|ألف|آلاف|k|K|مليون)?/i);
  if (p) {
    price = num(p[1]);
    if (p[2] && /مليون/.test(p[2])) price *= 1e6;
    else if (price < 1000) price *= 1000;
    // "479.000" style thousands separators.
    if (/^\d{1,3}\.\d{3}$/.test(p[1])) price = num(p[1].replace(".", ""));
    if (price > 20e6) price = null;
    // "35000 الف" usually means 35,000 but "14300 الف" may mean 143,000: ask the admin to look.
    if (price && p[2] && /الف|ألف/.test(p[2]) && num(p[1]) >= 1000) priceCheck = true;
  }
  if (!p) priceCheck = true;

  let km = null;
  const k = c.match(/(?:ماشي|الممشى|الممشي|ممشى|ممشي|ممشاه|العداد|mileage|ماشيه|ماشية|المسافة|km:)[^\d\n]{0,14}([\d][\d.,٬،]*)\s*(الف|ألف|آلاف|k|K)?\s*(ميل|مايل|mile)?/i);
  if (k) {
    km = /^\d{1,3}\.\d{3}$/.test(k[1]) ? num(k[1].replace(".", "")) : num(k[1]);
    if (km < 1000) km *= 1000;
    if (k[3]) km = Math.round(km * 1.609);
  }
  if (/زيرو كيلو|صفر كيلو|zero km/i.test(c) && km === null) km = 0;

  const specs = /خليجي|خليجيه|خليجية|gcc/i.test(c) ? "خليجي"
    : /امريكي|أمريكي|امريكا|أمريكا|usa|us import|american/i.test(c) ? "أمريكي"
    : /كندي|كندا|canad/i.test(c) ? "كندي"
    : /ياباني|اليابان|japan/i.test(c) ? "ياباني"
    : /اوروبي|أوروبي|ألماني|الماني|europe/i.test(c) ? "أوروبي"
    : /كوري|كوريا/i.test(c) ? "كوري"
    : /صيني|الصين/i.test(c) ? "صيني"
    : /وارد/i.test(c) ? "أخرى" : "";

  const city = /دبي|dubai/i.test(c) ? "دبي"
    : /ابوظبي|أبوظبي|ابوظبـي|abu ?dhabi/i.test(c) ? "أبوظبي"
    : /العين|al ?ain/i.test(c) ? "العين"
    : /الشارقة|الشارقه|الشارجه|sharjah/i.test(c) ? "الشارقة"
    : /عجمان|ajman/i.test(c) ? "عجمان"
    : /ام القيوين|أم القيوين|أم القـيوين/i.test(c) ? "أم القيوين"
    : /الفجيرة|الفجيره|fujairah/i.test(c) ? "الفجيرة"
    : /راس الخيمة|رأس الخيمة|راس الخيمه|رأس الخيمه|ras al/i.test(c) ? "رأس الخيمة" : "";

  const phones = [...new Set((c.match(/(?<![\d.,])(?:(?:\+|00)?971[\s-]?0?|0)?5[024568](?:[\s-]?\d){7}(?![\d])/g) || []).map((x) => "0" + x.replace(/\D/g, "").slice(-9)))];
  const negotiable = /غير قابل|non.?negotiable|نهائي/i.test(c) ? false : /قابل|negotiable|تفاوض/i.test(c);
  const trans = /قير عادي|قير يدوي|مانيوال|manual|جير عادي/i.test(c) ? "مانيوال" : "أوتوماتيك";
  const fuel = /هايبرد|هجين|hybrid|بلقن/i.test(c) ? "هجين"
    : /كهربائي|كهربائيه|electric/i.test(c) && !/بترول/.test(c) ? "كهربائي"
    : /ديزل|diesel/i.test(c) ? "ديزل" : "بنزين";
  const condition = /زيرو كيلو|صفر كيلو|تسليم فوري|zero km|\bnew\b/i.test(c) ? "جديدة" : "مستعملة";
  const body = (BODY.find(([r]) => r.test(model)) || [null, model ? "سيدان" : ""])[1];

  return { make, model, year: years[0] || null, price, priceCheck, km, specs, city, phone: phones[0] || "", phones, negotiable, trans, fuel, condition, body };
}

// The broker's caption without their tracking codes and warnings, plus our credit line.
export function cleanDescription(caption, dealerLabel) {
  let d = (caption || "").replace(/[‎‏]/g, "");
  const w = d.search(/⚠️?\s*تحذير|تحذير هام/);
  if (w > 0) d = d.slice(0, w);
  d = d.replace(/uaecm_\S+/gi, "").replace(/#\S+/g, "").replace(/(\s*\.\s*){2,}[A-Za-z0-9_\-]{6,14}\s*\.?\s*$/, "").replace(/[\s.]+$/, "");
  d = d.split("\n").filter((l) => !/^[\s.#\-_—]*$/.test(l) || l === "").join("\n").replace(/\n{3,}/g, "\n\n").trim();
  return `${d}\n\n📢 الإعلان من حساب ${dealerLabel}\n\n⚠️ لا تحوّل أي عربون قبل ما تفحص السيارة وتشوفها بعينك.`;
}

// Runs on instagram.com from a bookmark. Collects the profile's posts from the
// last N days through Instagram's own web API (the admin's logged-in session),
// then opens carsuae.net/#import=<posts> in the same tab (a new tab would be
// blocked as a popup once the collection has taken a while).
export const BOOKMARKLET_SOURCE = `(async()=>{
const user=location.pathname.split('/').filter(Boolean)[0];
if(!/instagram\\.com$/.test(location.hostname)||!user){alert('افتح صفحة حساب الوسيط في إنستغرام ثم اضغط الزر');return}
const days=parseInt(prompt('كم يوم من الإعلانات تبي؟','7'),10)||7;
const cut=Date.now()/1000-days*86400;
const box=document.createElement('div');box.style.cssText='position:fixed;top:12px;left:12px;z-index:99999;background:#111;color:#fff;padding:12px 16px;border-radius:10px;font:15px sans-serif;direction:rtl';document.body.appendChild(box);
const say=t=>box.textContent='CarsUAE: '+t;
const A='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const id=s=>{let n=0n;for(const ch of s)n=n*64n+BigInt(A.indexOf(ch));return n.toString()};
const H={'x-ig-app-id':'936619743392459','x-requested-with':'XMLHttpRequest'};
const seen=new Set(),posts=[];let old=0,idle=0;
while(old<4&&idle<4){
const codes=[...document.querySelectorAll('a[href*="/p/"],a[href*="/reel/"]')].map(a=>(a.getAttribute('href').match(/\\/(?:p|reel)\\/([^/]+)/)||[])[1]).filter(c=>c&&!seen.has(c));
if(!codes.length)idle++;else idle=0;
for(let i=0;i<codes.length;i+=6){await Promise.all(codes.slice(i,i+6).map(async c=>{seen.add(c);try{const j=await fetch('/api/v1/media/'+id(c)+'/info/',{headers:H,credentials:'include'}).then(r=>r.json());const it=j.items[0];if(it.taken_at<cut){if(!(it.timeline_pinned_user_ids||[]).length)old++;return}const media=it.carousel_media||[it];posts.push({code:c,t:it.taken_at,caption:(it.caption&&it.caption.text)||'',images:media.filter(m=>m.media_type!==2).map(m=>m.image_versions2.candidates[0].url)})}catch(e){}}));say('جمعت '+posts.length+' إعلان...')}
window.scrollBy(0,3000);await new Promise(r=>setTimeout(r,1500))}
say('جمعت '+posts.length+' إعلان. جاري فتح CarsUAE...');
posts.forEach(p=>{p.caption=p.caption.slice(0,2500);p.images=p.images.slice(0,8)});
location.href='https://carsuae.net/#import='+encodeURIComponent(JSON.stringify({user,days,posts}));
})()`;
