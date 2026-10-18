// VIN (رقم الشاصي) helpers shared by the browser app and api/vin.js.
// Everything here works offline: format checks, the country and maker from
// the first characters (WMI), and the model year from the 10th character.
// Factory specs come from the free NHTSA database through api/vin.js.

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/; // 17 characters, never I, O or Q

// Upper-cases, drops spaces/dashes and swaps the letters people often type by
// mistake (O→0, I→1, Q→0), which never appear in a real VIN.
export function cleanVin(raw) {
  return String(raw || "")
    .toUpperCase()
    .replace(/[\s-]/g, "")
    .replace(/O/g, "0").replace(/Q/g, "0").replace(/I/g, "1");
}

export const isVinFormat = (vin) => VIN_RE.test(vin);

// The 9th character is a check digit in North America (required there,
// optional elsewhere), so a mismatch only matters for cars built for that market.
const TRANSLIT = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9, S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9 };
const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
export function checkDigitOk(vin) {
  if (!isVinFormat(vin)) return false;
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const c = vin[i];
    const v = /\d/.test(c) ? Number(c) : TRANSLIT[c];
    sum += v * WEIGHTS[i];
  }
  const r = sum % 11;
  return vin[8] === (r === 10 ? "X" : String(r));
}

// Country of manufacture from the first one or two characters.
const COUNTRY_RANGES = [
  ["1", "الولايات المتحدة"], ["4", "الولايات المتحدة"], ["5", "الولايات المتحدة"],
  ["2", "كندا"], ["3", "المكسيك"],
  ["J", "اليابان"], ["KL", "كوريا الجنوبية"], ["KM", "كوريا الجنوبية"], ["KN", "كوريا الجنوبية"],
  ["L", "الصين"], ["MA", "الهند"], ["MB", "الهند"], ["MC", "الهند"], ["MD", "الهند"], ["ME", "الهند"],
  ["MH", "إندونيسيا"], ["ML", "تايلاند"], ["MM", "تايلاند"], ["MN", "تايلاند"], ["MP", "تايلاند"], ["MR", "تايلاند"],
  ["NM", "تركيا"], ["NL", "تركيا"], ["PL", "ماليزيا"], ["PM", "ماليزيا"],
  ["SA", "بريطانيا"], ["SB", "بريطانيا"], ["SC", "بريطانيا"], ["SD", "بريطانيا"], ["SE", "بريطانيا"], ["SF", "بريطانيا"], ["SG", "بريطانيا"], ["SH", "بريطانيا"], ["SJ", "بريطانيا"], ["SK", "بريطانيا"], ["SL", "بريطانيا"], ["SM", "بريطانيا"],
  ["TM", "التشيك"], ["TR", "المجر"], ["TS", "سلوفاكيا"], ["VF", "فرنسا"], ["VR", "فرنسا"], ["VS", "إسبانيا"], ["VW", "إسبانيا"],
  ["W", "ألمانيا"], ["YV", "السويد"], ["YS", "السويد"], ["ZA", "إيطاليا"], ["ZF", "إيطاليا"], ["ZH", "إيطاليا"],
  ["X", "روسيا"], ["9B", "البرازيل"], ["AA", "جنوب أفريقيا"], ["MS", "ميانمار"],
];
export function vinCountry(vin) {
  const two = vin.slice(0, 2);
  const hit = COUNTRY_RANGES.find(([p]) => p.length === 2 && p === two) || COUNTRY_RANGES.find(([p]) => p.length === 1 && p === vin[0]);
  return hit ? hit[1] : null;
}
export const isNorthAmericaBuilt = (vin) => /^[1-5]/.test(vin);

// Common makers in the UAE by their WMI (first three characters, or two).
const WMI = {
  JT: "تويوتا", JTD: "تويوتا", JTE: "تويوتا", JTM: "تويوتا", JTN: "تويوتا", JTJ: "لكزس", JTH: "لكزس", "2T": "تويوتا", "4T": "تويوتا", "5T": "تويوتا",
  JN: "نيسان", JN1: "نيسان", JN8: "نيسان", "1N": "نيسان", "5N": "نيسان", JNK: "إنفينيتي", "3N": "نيسان",
  JH: "هوندا", JHM: "هوندا", "1H": "هوندا", "2H": "هوندا", "5J": "هوندا", "19U": "أكيورا",
  JM: "مازدا", JA: "ميتسوبيشي", JF: "سوبارو", JS: "سوزوكي", MA3: "سوزوكي",
  KM: "هيونداي", KMH: "هيونداي", KMC: "هيونداي", "5NP": "هيونداي", KN: "كيا", KNA: "كيا", KND: "كيا", "5XY": "كيا", KL: "دايو / شيفروليه",
  "1G": "جنرال موتورز", "1GC": "شيفروليه", "1GN": "شيفروليه", "1GT": "جي إم سي", "1GK": "جي إم سي", "1GY": "كاديلاك", "3GN": "شيفروليه", "3GC": "شيفروليه",
  "1F": "فورد", "1FA": "فورد", "1FM": "فورد", "1FT": "فورد", "2F": "فورد", "3F": "فورد", "1L": "لينكولن", "5L": "لينكولن",
  "1C": "كرايسلر", "1C4": "جيب", "1J": "جيب", "2C": "دودج", "1C6": "رام", "3C6": "رام", "2C3": "دودج", "1B3": "دودج",
  "5YJ": "تسلا", "7SA": "تسلا", LRW: "تسلا",
  WBA: "بي إم دبليو", WBS: "بي إم دبليو M", WBX: "بي إم دبليو", "5UX": "بي إم دبليو", "4US": "بي إم دبليو",
  WDD: "مرسيدس بنز", WDB: "مرسيدس بنز", WDC: "مرسيدس بنز", W1K: "مرسيدس بنز", W1N: "مرسيدس بنز", "4JG": "مرسيدس بنز",
  WAU: "أودي", WA1: "أودي", WVW: "فولكس واجن", WVG: "فولكس واجن", "3VW": "فولكس واجن", WP0: "بورش", WP1: "بورش",
  SAL: "لاند روفر", SAJ: "جاكوار", SCF: "أستون مارتن", SCB: "بنتلي", SCA: "رولز رويس", SBM: "مكلارين",
  ZFF: "فيراري", ZHW: "لامبورغيني", ZAM: "مازيراتي", YV1: "فولفو", YV4: "فولفو",
  LVS: "فورد (الصين)", LGX: "بي واي دي", LS: "شانجان", LB3: "جيلي", LVV: "شيري", LFV: "فولكس واجن (الصين)",
};
export function vinMaker(vin) {
  return WMI[vin.slice(0, 3)] || WMI[vin.slice(0, 2)] || null;
}

// Model year from the 10th character. Only North American VINs are required
// to carry it (European and many Japanese/GCC VINs use that position for
// something else), so for other cars we return null rather than guess. The
// code repeats every 30 years; the 7th character tells the cycles apart
// (a letter means 2010 or later).
const YEAR_CODES = "ABCDEFGHJKLMNPRSTVWXY123456789";
export function vinModelYear(vin, now = new Date()) {
  if (!isNorthAmericaBuilt(vin)) return null;
  const idx = YEAR_CODES.indexOf(vin[9]);
  if (idx < 0) return null;
  const a = 1980 + idx, b = 2010 + idx;
  if (/[A-Z]/.test(vin[6]) && b <= now.getFullYear() + 1) return b;
  return a;
}

// Arabic labels for the NHTSA values we show.
const AR = {
  "Sedan/Saloon": "سيدان", "Sport Utility Vehicle (SUV)/Multi-Purpose Vehicle (MPV)": "دفع رباعي / SUV",
  "Pickup": "بيك أب", "Coupe": "كوبيه", "Convertible/Cabriolet": "مكشوفة", "Hatchback/Liftback/Notchback": "هاتشباك",
  "Wagon": "ستيشن", "Minivan": "ميني فان", "Van": "فان", "Crossover Utility Vehicle (CUV)": "كروس أوفر",
  Gasoline: "بنزين", Diesel: "ديزل", Electric: "كهرباء", "Flexible Fuel Vehicle (FFV)": "بنزين / إيثانول",
  Automatic: "أوتوماتيك", Manual: "عادي", "Continuously Variable Transmission (CVT)": "CVT أوتوماتيك", "Dual-Clutch Transmission (DCT)": "أوتوماتيك ثنائي القابض",
  "4WD/4-Wheel Drive/4x4": "دفع رباعي 4x4", "AWD/All-Wheel Drive": "دفع كلي AWD", "FWD/Front-Wheel Drive": "دفع أمامي",
  "RWD/Rear-Wheel Drive": "دفع خلفي", "4x2": "دفع ثنائي", "Left-Hand Drive (LHD)": "يسار", "Right-Hand Drive (RHD)": "يمين",
  "PASSENGER CAR": "سيارة ركاب", "MULTIPURPOSE PASSENGER VEHICLE (MPV)": "متعددة الأغراض", TRUCK: "شاحنة / بيك أب",
};
export const vinAr = (v) => (v && AR[v]) || v || "";
