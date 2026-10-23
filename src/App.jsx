import React, { useState, useEffect, useMemo, useRef } from "react";
import { Car, Plus, Search, MapPin, Gauge, Calendar, Fuel, Settings2, Phone, X, ImagePlus, Trash2, ChevronRight, BadgeCheck, Loader2, Store, Sparkles, ShieldCheck, CheckCircle2, LogIn, LogOut, User, Flag, Heart, Pencil, Share2, MessageCircle, RefreshCw, CircleCheck, Undo2, Eye, Maximize2, ScanLine, AlertTriangle, Info, BookOpen, ArrowRight, Menu as MenuIcon } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { paths, parsePath, makeSlug, citySlug, modelSlug, BUDGET_STEPS, categoryCopy } from "./seo-data.js";
import { cleanVin, isVinFormat } from "./vin.js";
import { imgSrc, imgSrcSet } from "./img.js";
import { ARTICLES, articleBySlug, formatArticleDate } from "./articles.js";
import { INFO_PAGES, FOOTER_PAGES, CONTACT_EMAIL, LEGAL_UPDATED } from "./legal.js";
import Importer from "./Importer.jsx";
import { translate, getLang, switchLang, otherLangHref } from "./i18n.js";

// Environment variables are injected at build time by Vite from .env.local
// (or from the "Environment Variables" settings in your Vercel project).
// Never commit real keys to .env.local — it's already in .gitignore.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CITIES = ["دبي", "أبوظبي", "الشارقة", "عجمان", "رأس الخيمة", "الفجيرة", "أم القيوين", "العين"];
const FUELS = ["بنزين", "ديزل", "هجين", "كهربائي"];
const TRANS = ["أوتوماتيك", "مانيوال"];
const SPECS = ["خليجي", "أمريكي", "أوروبي", "ياباني", "كندي", "صيني", "كوري", "أخرى"];
const STEERING = ["يسار", "يمين"];
const CONDITIONS = ["جديدة", "مستعملة"];
const BODY_TYPES = ["سيدان", "دفع رباعي (SUV)", "بيك أب", "هاتشباك", "كوبيه", "فان", "رياضية"];
const OTHER = "__OTHER__";
const MAX_IMAGES = 8;
// A listing disappears from the site once this many people report it, pending review.
const REPORT_THRESHOLD = 3;
// A listing stays up this many days; the seller can renew it from "إعلاناتي".
const LISTING_DAYS = 30;
const isExpired = (l) => Boolean(l.expires_at) && Date.parse(l.expires_at) <= Date.now();
const isLive = (l) => !l.sold && !isExpired(l);
const daysLeft = (l) => (l.expires_at ? Math.ceil((Date.parse(l.expires_at) - Date.now()) / 86400000) : null);
const renewedExpiry = () => new Date(Date.now() + LISTING_DAYS * 86400000).toISOString();
// "05xxxxxxxx" / "+9715xxxxxxxx" -> "9715xxxxxxxx" for wa.me links.
const waNumber = (phone) => {
  let d = String(phone || "").replace(/\D/g, "").replace(/^00/, "");
  if (d.startsWith("971")) return d;
  if (d.startsWith("0")) return "971" + d.slice(1);
  if (d.length === 9) return "971" + d;
  return d;
};
// Where a visitor came from, for the admin's visitor stats.
function visitSource() {
  try {
    // Tagged links: ?utm_source=… or the short form ?s=… (e.g. ig_story, dealer_70x).
    const q = new URLSearchParams(window.location.search);
    const utm = q.get("utm_source") || q.get("s");
    if (utm) return utm.toLowerCase().replace(/[^a-z0-9_.-]/g, "").slice(0, 40) || "direct";
    const ua = navigator.userAgent || "";
    if (/Instagram/i.test(ua)) return "instagram";
    if (/FBAN|FBAV/i.test(ua)) return "facebook";
    if (/musical_ly|BytedanceWebview|TikTok/i.test(ua)) return "tiktok";
    if (/Snapchat/i.test(ua)) return "snapchat";
    const ref = document.referrer ? new URL(document.referrer).hostname : "";
    if (!ref || ref === window.location.hostname) return "direct";
    if (/google\./.test(ref)) return "google";
    if (/instagram/.test(ref)) return "instagram";
    if (/facebook|fb\./.test(ref)) return "facebook";
    if (/whatsapp|wa\.me/.test(ref)) return "whatsapp";
    if (/tiktok/.test(ref)) return "tiktok";
    if (/bing|yahoo|duckduckgo/.test(ref)) return "search";
    return ref.replace(/^www\./, "").slice(0, 40);
  } catch { return "direct"; }
}
const firstSource = typeof window !== "undefined" ? visitSource() : "direct";
// One count per page per browser tab; admins are not counted.
function trackVisit(client, path, listingId = null) {
  try {
    if (localStorage.getItem("cm_admin") === "1") return;
    // Crawlers and automated browsers are not visitors.
    if (navigator.webdriver || /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit/i.test(navigator.userAgent || "")) return;
    const key = "cm_seen:" + path;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch { /* storage blocked: still count */ }
  client.rpc("track_visit", { p_path: path, p_source: firstSource, p_listing: listingId }).then(() => {}, () => {});
}

// Twilio blocks SMS to unverified UAE numbers until the account has an approved
// compliance profile. Until then, verification is offered but not required.
const REQUIRE_PHONE_VERIFICATION = false;

const MODELS = {
  "تويوتا": ["كامري", "كورولا", "يارس", "راف فور", "لاند كروزر", "برادو", "هايلكس", "أفالون", "سيكويا", "فورتشنر", "هايس"],
  "لكزس": ["ES", "LS", "LX", "GX", "RX", "NX", "IS", "LC", "UX"],
  "نيسان": ["التيما", "صني", "باترول", "إكس تريل", "كيكس", "مكسيما", "أرمادا", "باثفايندر"],
  "إنفينيتي": ["Q50", "QX50", "QX60", "QX80"],
  "هوندا": ["سيفيك", "أكورد", "سي آر في", "بايلوت", "HR-V", "أوديسي"],
  "أكيورا": ["MDX", "TLX", "RDX"],
  "مازدا": ["مازدا 3", "مازدا 6", "CX-5", "CX-9", "CX-30"],
  "ميتسوبيشي": ["لانسر", "باجيرو", "أوتلاندر", "إكليبس كروس", "L200"],
  "سوزوكي": ["سويفت", "فيتارا", "جيمني", "إرتيقا", "سياز"],
  "سوبارو": ["فورستر", "XV", "ليجاسي", "أوتباك", "إمبريزا"],
  "إيسوزو": ["D-Max", "MU-X"],
  "دايهاتسو": ["تيريوس", "أبكس"],
  "هيونداي": ["النترا", "سوناتا", "توسان", "سنتافي", "أكسنت", "باليسايد", "فينيو", "كريتا"],
  "كيا": ["سيراتو", "K5", "سبورتاج", "سورينتو", "بيكانتو", "تيلورايد", "كارنيفال", "سيلتوس"],
  "جينيسيس": ["G70", "G80", "G90", "GV70", "GV80"],
  "شيفروليه": ["كامارو", "ماليبو", "تاهو", "سوبربان", "سيلفرادو", "تراكس", "إمبالا", "كابريس"],
  "فورد": ["F-150", "إكسبلورر", "موستنج", "إيدج", "إكسبيديشن", "إيكوسبورت", "رينجر"],
  "جي إم سي": ["يوكن", "سييرا", "أكاديا", "تيرين"],
  "دودج": ["تشارجر", "تشالنجر", "دورانجو"],
  "جيب": ["رانجلر", "جراند شيروكي", "كومباس", "شيروكي", "غلاديتور"],
  "كرايسلر": ["300", "بسيفيكا"],
  "كاديلاك": ["إسكاليد", "CT5", "XT5", "XT6"],
  "لينكولن": ["نافيجيتور", "أفياتور", "كورسير"],
  "رام": ["1500", "2500"],
  "بونتياك": ["أخرى"],
  "بويك": ["إنكليف", "إنكور"],
  "مرسيدس": ["الفئة A", "الفئة C", "الفئة E", "الفئة S", "GLA", "GLC", "GLE", "GLS", "الفئة G", "CLA", "CLS", "AMG GT"],
  "بي إم دبليو": ["الفئة 1", "الفئة 2", "الفئة 3", "الفئة 5", "الفئة 7", "X1", "X2", "X3", "X4", "X5", "X6", "X7"],
  "أودي": ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "RS6"],
  "فولكس واجن": ["جولف", "باسات", "تيجوان", "أطلس", "جيتا", "بولو"],
  "بورش": ["كايين", "ماكان", "باناميرا", "911", "تايكان", "718"],
  "أوبل": ["أسترا", "إنسينيا", "كورسا", "غرانتلاند"],
  "مِيني": ["كوبر", "كانتري مان", "كلوبمان"],
  "سمارت": ["فورتو"],
  "لاند روفر": ["ديفندر", "ديسكفري", "رينج روفر", "رينج روفر سبورت", "إيفوك", "فيلار", "ديسكفري سبورت"],
  "جاكوار": ["XE", "XF", "F-PACE", "E-PACE", "F-TYPE"],
  "بنتلي": ["كونتيننتال", "بنتايجا", "فلاينج سبير"],
  "رولز رويس": ["غوست", "فانتوم", "كولينان", "رايث"],
  "أستون مارتن": ["فانتاج", "DB11", "DBX"],
  "مكلارين": ["570S", "720S", "GT"],
  "فيراري": ["488", "روما", "بورتوفينو", "296"],
  "لامبورغيني": ["هوراكان", "أوروس", "أفينتادور"],
  "مازيراتي": ["جيبلي", "ليفانتي", "كواتروبورتي"],
  "ألفا روميو": ["جوليا", "ستيلفيو", "توناليه"],
  "فيات": ["500", "تيبو", "دوبلو"],
  "بيجو": ["208", "2008", "3008", "508", "5008"],
  "رينو": ["دستر", "كوليوس", "ميغان", "كادجار"],
  "سيتروين": ["C3", "C4", "C5 إكروس"],
  "دي إس": ["DS 7"],
  "فولفو": ["XC40", "XC60", "XC90", "S60", "S90"],
  "سكودا": ["أوكتافيا", "كودياك", "سوبيرب", "كاروك"],
  "سيات": ["ليون", "أتيكا", "إبيزا"],
  "إم جي": ["MG5", "ZS", "HS", "RX5", "GT"],
  "جيلي": ["إمجراند", "كولراي", "عذراء"],
  "شانجان": ["CS35", "CS75", "أليسون"],
  "جي إيه سي": ["GS3", "GS8", "إمكوو"],
  "بي واي دي": ["هان", "تانج", "أتو 3", "سونج بلس"],
  "هافال": ["H6", "جوليون", "داراغون"],
  "شيري": ["تيجو", "أريزو"],
  "جاك": ["JS4", "JS6"],
  "أورا": ["جود كات", "فنكس"],
  "بايك": ["X55", "X7", "X3"],
  "بروتون": ["X50", "X70", "ساجا"],
  "غريت وول": ["بوير", "كانون"],
  "سانج يونج": ["توفولاند", "ركستون", "تيفولي"],
  "فوتون": ["توانو", "فيو"],
  "دايو": ["لانوس", "نوبيرا"],
  "لوتس": ["إليس", "إيميرا", "إيفيجا"],
  "بولستار": ["Polestar 2", "Polestar 3", "Polestar 4"],
  "نيو": ["ET5", "ES6", "EC6"],
  "زيكر": ["001", "X"],
  "تسلا": ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
  "جيتور": ["X70", "X90", "داشينغ", "T2", "تريفل"],
  "إكسيد": ["TXL", "VX", "LX", "RX", "إكسلانتكس"],
  "أومودا": ["5", "7", "C5"],
  "جايكو": ["7", "8", "5"],
  "تانك": ["300", "400", "500", "700"],
  "وي": ["05", "80V"],
  "لينك آند كو": ["01", "03", "05", "06", "09"],
  "هونشي": ["H5", "H9", "HS5", "HS7", "E-HS9"],
  "دونغفنغ": ["T5", "580", "AX7", "نامي"],
  "فاو": ["بيستون T77", "بيستون T99", "T9"],
  "لوسيد": ["إير", "غرافيتي"],
  "ريفيان": ["R1T", "R1S"],
  "هامر": ["H1", "H2", "H3", "EV"],
  "ماهيندرا": ["سكوربيو", "XUV700", "ثار"],
  "تاتا": ["نيكسون", "هارير", "سافاري"],
  "بوغاتي": ["شيرون", "فيرون"],
  "كوينيغسيغ": ["جيسكو", "ريجيرا"],
  "روكس": ["01", "أداماس"],
  "شاومي": ["SU7", "YU7"],
  "لي أوتو": ["L7", "L8", "L9", "ميغا"],
  "أفاتر": ["11", "12"],
  "إكس بينغ": ["G6", "G9", "P7"],
  "دينزا": ["D9", "N7", "Z9"],
  "فوياه": ["فري", "دريم", "باشن"],
  "ليب موتور": ["C10", "C11", "T03"],
  "ديبال": ["S05", "S07", "L07"],
  "سكاي ويل": ["ET5"],
  "أيتو": ["M5", "M7", "M9"],
  "سيريس": ["3", "5"],
  "يانغ وانغ": ["U8", "U9"],
  "إم هيرو": ["917"],
  "باو": ["212"],
  "إنيوس": ["غرينادير"],
  "بيستون": ["T77", "T99", "B70"],
  "جي دبليو إم": ["بوير", "وينغل"],
  "سوي إيست": ["S06", "S07"],
  "كايي": ["X3", "X7"],
  "ماكسوس": ["T60", "D90", "G50"],
  "آركفوكس": ["ألفا S", "ألفا T"],
  "رووي": ["RX5", "i5"],
  "فورثينغ": ["T5", "U-Tour"],
  "دي إف إس كيه": ["غلوري 500", "غلوري 580"],
  "فينغون": ["ix5", "ix7"],
  "كاري": ["يويا"],
  "ريدارا": ["RD6"],
  "سايك": ["MG RX5"],
  "أيون": ["Y", "S", "V"],
  "بريليانس": ["V5", "H330"],
  "أبارث": ["595", "695", "500e"],
  "برابوس": ["G800", "700", "900"],
  "شيلبي": ["GT500", "كوبرا"],
  "مرسيدس مايباخ": ["S580", "GLS600"],
  "بي إم دبليو ألبينا": ["B7", "XB7", "B8"],
  "فيكتوري": ["VS"],
  "سبروس": ["S3"],
  "هينو": ["300", "500", "700"],
  "فوسو": ["كانتر", "فايتر"],
  "إيفيكو": ["دايلي", "ستراليس"],
  "أشوك ليلاند": ["دوست", "بارتنر"],
  "كاترهام": ["سفن"],
  "كان-آم": ["مافريك", "أوتلاندر"],
  "فورس": ["غوركا", "ترافلر"],
  "زد إكس أوتو": ["تيرالورد", "غراند تايغر"],
};

const MAKES = [...Object.keys(MODELS), "أخرى"];

// Budget choices in the filters (and /used-cars/under/<max> pages).
const BUDGETS = [
  { label: "تحت 25 ألف", max: 25000 },
  { label: "تحت 50 ألف", max: 50000 },
  { label: "تحت 100 ألف", max: 100000 },
  { label: "تحت 200 ألف", max: 200000 },
];
const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() + 1 - i);
const MILEAGE_OPTIONS = [25000, 50000, 100000, 150000, 200000];

// Rough monthly payment for a typical UAE car loan: 20% down, 5 years,
// 3% flat rate a year. Only meant as a guide; banks quote their own figures.
const LOAN = { down: 0.2, years: 5, flatRate: 0.03 };
function monthlyInstallment(price) {
  const principal = Number(price) * (1 - LOAN.down);
  if (!principal) return 0;
  return Math.round((principal * (1 + LOAN.flatRate * LOAN.years)) / (LOAN.years * 12));
}

// Percentage the seller has cut from their earlier asking price, if any.
function discountPercent(l) {
  if (!l.previous_price || l.previous_price <= l.price) return 0;
  return Math.round(((l.previous_price - l.price) / l.previous_price) * 100);
}

function isRecent(ts, days = 3) {
  const parsed = Date.parse(ts);
  return !Number.isNaN(parsed) && Date.now() - parsed < days * 86400000;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function formatNumber(n) {
  return new Intl.NumberFormat("ar-AE").format(n);
}

function timeAgo(ts) {
  if (!ts) return "";
  const parsed = typeof ts === "number" ? ts : Date.parse(ts);
  if (Number.isNaN(parsed)) return "";
  const diff = Date.now() - parsed;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} د`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} س`;
  const days = Math.floor(hrs / 24);
  return `منذ ${days} يوم`;
}

function resizeImage(file, maxW = 640, quality = 0.62) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


// ---------------------------------------------------------------------------
// Vehicle check. Runs entirely in the visitor's browser with MobileNet, loaded
// on demand from a CDN the first time someone picks a photo. It only answers
// "is there a vehicle in this picture" — it cannot tell a real car from a car
// in a video game. If the model fails to load we let the photo through rather
// than blocking a genuine seller.
// ---------------------------------------------------------------------------
const VEHICLE_LABELS = [
  "sports car", "convertible", "limousine", "cab", "jeep", "minivan", "beach wagon",
  "pickup", "racer", "car wheel", "grille", "tow truck", "moving van", "police van",
  "ambulance", "fire engine", "garbage truck", "trailer truck", "school bus", "minibus",
  "recreational vehicle", "golfcart", "go-kart", "snowplow", "forklift", "half track",
  "motor scooter", "moped", "mountain bike", "tricycle", "unicycle", "amphibian",
  "model t", "streetcar", "trolleybus", "tractor", "thresher", "harvester",
];

let mobilenetModel = null;
let mobilenetFailed = false;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const el = document.createElement("script");
    el.src = src;
    el.onload = resolve;
    el.onerror = () => reject(new Error("script failed"));
    document.head.appendChild(el);
  });
}

async function getVehicleModel() {
  if (mobilenetModel || mobilenetFailed) return mobilenetModel;
  try {
    await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js");
    await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js");
    mobilenetModel = await window.mobilenet.load({ version: 2, alpha: 1.0 });
  } catch {
    mobilenetFailed = true;
  }
  return mobilenetModel;
}

// Returns true when the picture appears to contain a vehicle, or when the check
// could not run at all.
async function looksLikeVehicle(dataUrl) {
  const model = await getVehicleModel();
  if (!model) return true;
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = "anonymous";
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = dataUrl;
    });
    const results = await model.classify(img, 5);
    return results.some((r) =>
      r.probability > 0.12 &&
      r.className.toLowerCase().split(",").some((name) => VEHICLE_LABELS.includes(name.trim()))
    );
  } catch {
    return true;
  }
}

// Supabase Auth answers in English; turn the common cases into plain Arabic.
function authErrorMessage(err) {
  const m = (err && err.message) || "";
  if (/invalid login credentials/i.test(m)) return "البريد أو كلمة المرور غير صحيحة";
  if (/already registered|already exists/i.test(m)) return "هذا البريد مسجّل مسبقًا. جرّب تسجيل الدخول.";
  if (/password should be at least/i.test(m)) return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
  if (/rate limit|too many|security purposes|seconds/i.test(m)) return "محاولات كثيرة. انتظر دقيقة ثم حاول مرة أخرى.";
  if (/sending|smtp|email.*(send|deliver)/i.test(m)) return "تعذر إرسال رسالة التأكيد الآن. حاول بعد قليل.";
  if (/valid email|invalid email|email address/i.test(m)) return "اكتب بريدًا إلكترونيًا صحيحًا";
  return m || "حدث خطأ، حاول مرة أخرى";
}

// Older listings stored the seller's account email as their name. Never show an
// email address publicly: fall back to a neutral label instead.
function sellerLabel(name) {
  if (!name || name.includes("@")) return "البائع";
  return name;
}

// Uploads a photo to Supabase Storage at full display quality and returns its public URL.
async function uploadImage(file, userId) {
  const canvasBlob = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 1200 / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("فشل تحويل الصورة"))), "image/jpeg", 0.82);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const path = `${userId}/${Date.now()}.jpg`;
  const { error } = await supabase.storage
    .from("car-images")
    .upload(path, canvasBlob, { contentType: "image/jpeg" });
  if (error) throw error;

  const { data } = supabase.storage.from("car-images").getPublicUrl(path);
  return data.publicUrl;
}

// All colors/effects are implemented as plain named CSS classes below (never as
// Tailwind arbitrary-bracket utilities), since this environment renders a fixed
// pre-built Tailwind stylesheet without a JIT compiler for arbitrary values.

function Badge({ children, tone = "blue" }) {
  const cls = tone === "mint" ? "cm-badge-mint" : tone === "muted" ? "cm-badge-muted" : tone === "red" ? "cm-badge-red" : "cm-badge-blue";
  return <span className={`cm-badge ${cls}`}>{children}</span>;
}

// Shown under the seller's own cards: sold, expired, or days left.
function ListingStatus({ l }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <ListingState l={l} />
      <Badge tone="muted"><Eye size={11} /> {formatNumber(l.views || 0)} مشاهدة</Badge>
    </div>
  );
}

function ListingState({ l }) {
  if (l.sold) return <Badge tone="muted">مُباعة{l.sold_at ? ` · ${new Date(l.sold_at).toLocaleDateString("ar-AE")}` : ""}</Badge>;
  if (isExpired(l)) return <Badge tone="red">منتهي · جدّده عشان يرجع يظهر</Badge>;
  const d = daysLeft(l);
  if (d === null) return <Badge tone="mint">ظاهر للمشترين</Badge>;
  return <Badge tone={d <= 7 ? "red" : "mint"}>ظاهر · ينتهي بعد {d} {d === 1 ? "يوم" : "يوم"}</Badge>;
}

function PricePlate({ price, size = "md" }) {
  return (
    <span className={`cm-price ${size === "lg" ? "text-3xl" : "text-xl"}`}>
      {price ? <>{formatNumber(price)} <small>د.إ</small></> : <small>السعر عند التواصل</small>}
    </span>
  );
}

export default function CarMarket() {
  // The page the visitor landed on, e.g. /used-cars/toyota (null for "/").
  const [initialRoute] = useState(() => {
    if (typeof window === "undefined") return null;
    // Links shared before the switch to real paths looked like /#/car/<id>.
    const legacy = window.location.hash.match(/^#\/car\/([^&/]+)$/);
    if (legacy) window.history.replaceState({}, "", paths.car(legacy[1]));
    return parsePath(window.location.pathname);
  });
  // The server page embeds the first listings (window.__SEED__) so cards show
  // at once instead of after the Supabase round trip. They lack the phone
  // column; loadListings() replaces them with full rows a moment later.
  const [seed] = useState(() => (typeof window !== "undefined" && Array.isArray(window.__SEED__?.listings) ? window.__SEED__.listings : null));
  const [listings, setListings] = useState(() => seed || []);
  const [loaded, setLoaded] = useState(() => Boolean(seed && seed.length));
  const [view, setView] = useState(
    initialRoute?.kind === "vin" ? "vin"
      : initialRoute?.kind === "blog" || initialRoute?.kind === "article" ? "blog"
      : initialRoute?.kind === "info" ? "info"
      : initialRoute ? "browse" : "home"
  ); // home | browse | mine | saved | add | vin | blog | info
  // Which info page is open on the "info" view: terms | privacy | contact.
  const [infoPage, setInfoPage] = useState(initialRoute?.kind === "info" ? initialRoute.page : "terms");
  // Open article on the blog view ("" = the article list).
  const [articleSlug, setArticleSlug] = useState(initialRoute?.kind === "article" ? initialRoute.slug : "");

  // Auth (Supabase email/password accounts)
  const [session, setSession] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login | signup
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authLoading, setAuthLoading] = useState(false);
  // Set after sign-up (or a login blocked by an unconfirmed email): the address
  // waiting for its confirmation link.
  const [pendingEmail, setPendingEmail] = useState("");
  const [resendWait, setResendWait] = useState(0);
  const [active, setActive] = useState(null);
  const [photoIdx, setPhotoIdx] = useState(0);
  // Full-screen photo viewer (tap a listing photo to open, pinch / double-tap to zoom).
  const [viewerOpen, setViewerOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const [q, setQ] = useState("");
  const [makeFilter, setMakeFilter] = useState(["make", "model"].includes(initialRoute?.kind) ? initialRoute.make : "الكل");
  // Model is matched by its URL slug, since model names are free text.
  const [modelFilter, setModelFilter] = useState(initialRoute?.kind === "model" ? initialRoute.modelSlug : "");
  const [dealerFilter, setDealerFilter] = useState(initialRoute?.kind === "dealer" ? initialRoute.slug : "");
  const [dealers, setDealers] = useState([]);
  const [cityFilter, setCityFilter] = useState(initialRoute?.kind === "city" ? initialRoute.city : "الكل");
  const [bodyTypeFilter, setBodyTypeFilter] = useState("الكل");
  const [maxPrice, setMaxPrice] = useState(initialRoute?.kind === "budget" ? String(initialRoute.max) : "");
  const [minPrice, setMinPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [specsFilter, setSpecsFilter] = useState("الكل");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [maxKm, setMaxKm] = useState("");
  const [negotiableOnly, setNegotiableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false); // site menu (pages and tools)

  // Admin (rows in public.admins; checked again by the database on every write).
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRows, setAdminRows] = useState([]);
  const [adminReports, setAdminReports] = useState([]);
  const [adminTab, setAdminTab] = useState("all"); // all | live | sold | expired | reported
  // Instagram importer panel; opened by the "CarsUAE استيراد" bookmark via carsuae.net/#import.
  const [importOpen, setImportOpen] = useState(() => typeof window !== "undefined" && window.location.hash.startsWith("#import"));
  const [adminQ, setAdminQ] = useState("");
  const [stats, setStats] = useState(null);
  const [dealerForm, setDealerForm] = useState({ name: "", slug: "", instagram: "", phone: "", city: "" });

  const emptyForm = {
    make: MAKES[0], makeOther: "", model: MODELS[MAKES[0]][0], modelOther: "",
    bodyType: BODY_TYPES[0], year: new Date().getFullYear(), price: "", mileage: "",
    city: CITIES[0], fuel: FUELS[0], trans: TRANS[0], condition: CONDITIONS[1],
    specs: SPECS[0], steering: STEERING[0], negotiable: false,
    description: "", phone: "", sellerName: "", previews: [], imageFiles: [],
  };
  const [form, setForm] = useState(emptyForm);
  const fileRef = useRef(null);

  // Mock OTP verification (no SMS backend connected in this prototype)
  const [otp, setOtp] = useState({ sent: false, code: "", input: "", verifiedFor: "", sending: false });

  async function loadListings() {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .lt("reports_count", REPORT_THRESHOLD)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setListings(data || []);
    } catch (e) {
      // leave existing state as-is on a transient fetch error
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    // Track the logged-in user across the whole app.
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));

    loadListings();
    loadFavorites();
    supabase.from("dealers").select("*").order("name").then(({ data }) => setDealers(data || []));
    if (!/^\/car\//.test(window.location.pathname)) trackVisit(supabase, window.location.pathname);
    // Light polling so new listings from other visitors show up without a manual refresh.
    // Skips the fetch while the tab is in the background — no point loading for nobody.
    const id = setInterval(() => {
      if (document.visibilityState === "visible") loadListings();
    }, 60000);
    return () => { clearInterval(id); listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(false); return; }
    supabase.from("admins").select("user_id").eq("user_id", session.user.id).maybeSingle()
      .then(({ data }) => {
        setIsAdmin(Boolean(data));
        try { if (data) localStorage.setItem("cm_admin", "1"); } catch { /* ignore */ }
      });
  }, [session]);

  async function loadAdmin() {
    const [{ data: rows }, { data: reps }] = await Promise.all([
      supabase.from("listings").select("*").order("created_at", { ascending: false }),
      supabase.from("reports").select("*").order("created_at", { ascending: false }),
    ]);
    setAdminRows(rows || []);
    setAdminReports(reps || []);
    const { data: st } = await supabase.rpc("visit_stats", { p_days: 30 });
    setStats(st || null);
    const { data: ds } = await supabase.from("dealers").select("*").order("name");
    setDealers(ds || []);
  }

  async function addDealer(e) {
    e.preventDefault();
    const slug = dealerForm.slug.trim().toLowerCase();
    if (!dealerForm.name.trim() || !/^[a-z0-9-]{2,40}$/.test(slug)) {
      showToast("اكتب الاسم ورابط بالإنجليزي (حروف وأرقام وشرطة فقط)", "red"); return;
    }
    const { error } = await supabase.from("dealers").insert({
      name: dealerForm.name.trim(), slug,
      instagram: dealerForm.instagram.trim().replace(/^@/, "") || null,
      phone: dealerForm.phone.trim() || null, city: dealerForm.city || null,
    });
    if (error) { showToast(error.code === "23505" ? "هذا الرابط مستخدم" : "تعذر الحفظ: " + error.message, "red"); return; }
    showToast("تمت إضافة الوسيط");
    setDealerForm({ name: "", slug: "", instagram: "", phone: "", city: "" });
    loadAdmin();
  }

  async function removeDealer(d) {
    if (!window.confirm(`حذف الوسيط ${d.name}؟ إعلاناته تبقى بدون وسيط.`)) return;
    const { error } = await supabase.from("dealers").delete().eq("id", d.id);
    if (error) showToast("تعذر الحذف: " + error.message, "red"); else { showToast("تم حذف الوسيط", "muted"); loadAdmin(); loadListings(); }
  }

  const setListingDealer = (l, dealerId) =>
    updateListing(l.id, { dealer_id: dealerId || null }, dealerId ? "تم ربط الإعلان بالوسيط" : "تم فك الربط");

  useEffect(() => { if (view === "admin" && isAdmin) loadAdmin(); }, [view, isAdmin]);
  useEffect(() => { if (importOpen && isAdmin) setView("admin"); }, [importOpen, isAdmin]);


  // --- URL routing ---------------------------------------------------------
  // Real paths (see src/seo-data.js): /used-cars, /used-cars/<make>,
  // /used-cars/in/<city>, /used-cars/under/<max>, /car/<id>. The same paths
  // are rendered on the server for Google (api/page.js).
  const [pendingCarId, setPendingCarId] = useState(() => (initialRoute?.kind === "car" ? initialRoute.id : null));
  const activeRef = useRef(null);
  useEffect(() => {
    activeRef.current = active;
    if (!active) openedInApp.current = false;
  }, [active]);
  // True when the open listing was opened from inside the app, so closing it
  // can simply step back in history to the list it came from.
  const openedInApp = useRef(false);
  const prevViewRef = useRef(view);

  function applyRoute(route) {
    if (!route) { setActive(null); setView("home"); return; }
    if (route.kind === "car") { setView("browse"); setPendingCarId(route.id); return; }
    if (route.kind === "vin") { setActive(null); setView("vin"); return; }
    if (route.kind === "info") {
      setActive(null); setInfoPage(route.page); setView("info");
      window.scrollTo(0, 0);
      return;
    }
    if (route.kind === "blog" || route.kind === "article") {
      setActive(null); setArticleSlug(route.kind === "article" ? route.slug : ""); setView("blog");
      window.scrollTo(0, 0);
      return;
    }
    setActive(null);
    setMakeFilter(["make", "model"].includes(route.kind) ? route.make : "الكل");
    setModelFilter(route.kind === "model" ? route.modelSlug : "");
    setDealerFilter(route.kind === "dealer" ? route.slug : "");
    setCityFilter(route.kind === "city" ? route.city : "الكل");
    setMinPrice("");
    setMaxPrice(route.kind === "budget" ? String(route.max) : "");
    setBodyTypeFilter("الكل"); setSpecsFilter("الكل"); setMinYear(""); setMaxYear(""); setMaxKm(""); setNegotiableOnly(false); setQ("");
    setView("browse");
  }

  useEffect(() => {
    function onPop() {
      const route = parsePath(window.location.pathname);
      // Back from a listing to its list: close it but keep the visitor's filters.
      if (activeRef.current && (!route || route.kind !== "car")) {
        openedInApp.current = false;
        setActive(null);
        return;
      }
      applyRoute(route);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Opens the listing named in the URL once it is available.
  const fetchingCar = useRef(null);
  useEffect(() => {
    if (!pendingCarId) return;
    const found = listings.find((l) => l.id === pendingCarId);
    if (found && "phone" in found && fetchingCar.current !== pendingCarId) { setActive(found); setPhotoIdx(0); setPendingCarId(null); trackVisit(supabase, paths.car(found.id), found.id); return; }
    // The server page of a car embeds it (window.__SEED__.car): show it now,
    // then swap in the full row (with the phone) from the fetch below.
    const seededCar = window.__SEED__?.car;
    if (seededCar && seededCar.id === pendingCarId && !activeRef.current) { setActive(seededCar); setPhotoIdx(0); }
    else if (found && !activeRef.current) { setActive(found); setPhotoIdx(0); }
    if (!loaded && !seededCar && !found) return;
    // Not in the loaded set (hidden by reports, or a direct visit): fetch it once.
    const id = pendingCarId;
    if (fetchingCar.current === id) return;
    fetchingCar.current = id;
    supabase.from("listings").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      fetchingCar.current = null;
      if (data) { setActive(data); setPhotoIdx(0); trackVisit(supabase, paths.car(data.id), data.id); }
      else showToast("الإعلان غير موجود، ربما بيعت السيارة", "muted");
      setPendingCarId((cur) => (cur === id ? null : cur));
    });
  }, [pendingCarId, listings, loaded]);

  // The browse page's address follows its make / city / budget filters, so it
  // can be bookmarked and shared, and matches the page Google indexed.
  function browsePath() {
    const make = makeFilter !== "الكل" ? makeFilter : null;
    const city = cityFilter !== "الكل" ? cityFilter : null;
    if (dealerFilter) return paths.dealer(dealerFilter);
    if (make && modelFilter && !city && !minPrice && !maxPrice && makeSlug(make)) return `/used-cars/${makeSlug(make)}/${modelFilter}`;
    if (make && !city && !minPrice && !maxPrice && makeSlug(make)) return paths.make(make);
    if (city && !make && !minPrice && !maxPrice && citySlug(city)) return paths.city(city);
    if (!make && !city && !minPrice && BUDGET_STEPS.includes(Number(maxPrice))) return paths.budget(Number(maxPrice));
    return paths.all();
  }

  // The section the browse page currently matches, for its heading and tab title.
  const dealerById = useMemo(() => Object.fromEntries(dealers.map((d) => [d.id, d])), [dealers]);
  // A broker's own account (dealers.user_id): their new listings post under the dealer name.
  const myDealer = session ? dealers.find((d) => d.user_id === session.user.id) || null : null;
  const currentDealer = dealers.find((d) => d.slug === dealerFilter) || null;
  // Display name for the model slug in the URL: from listings, else the catalogue.
  const modelName = modelFilter
    ? (listings.find((l) => l.make === makeFilter && modelSlug(l.model) === modelFilter)?.model
      || (MODELS[makeFilter] || []).find((m) => modelSlug(m) === modelFilter) || modelFilter.replace(/-/g, " "))
    : "";
  const sectionRoute = (() => {
    const r = parsePath(browsePath()) || { kind: "all" };
    if (r.kind === "model") return { ...r, model: modelName };
    if (r.kind === "dealer") return { ...r, name: currentDealer?.name, verified: currentDealer?.verified };
    return r;
  })();
  const sectionTitle = categoryCopy(sectionRoute).title;

  useEffect(() => {
    const viewChanged = prevViewRef.current !== view;
    prevViewRef.current = view;
    if (active || pendingCarId) return;
    const target = view === "browse" ? browsePath()
      : view === "vin" ? paths.vin()
      : view === "blog" ? (articleSlug ? paths.article(articleSlug) : paths.blog())
      : view === "info" ? INFO_PAGES[infoPage].path
      : "/";
    if (target === window.location.pathname) return;
    if (viewChanged) window.history.pushState({}, "", target);
    else window.history.replaceState({}, "", target);
  }, [view, articleSlug, infoPage, makeFilter, modelFilter, dealerFilter, cityFilter, minPrice, maxPrice, active, pendingCarId]);

  // Keep the tab title useful when a listing is open — it's what WhatsApp and
  // browsers show, and what someone sees in their history.
  useEffect(() => {
    document.title = active
      ? `${active.make} ${active.model} ${active.year} — ${active.price ? formatNumber(active.price) + " د.إ" : "للبيع"} | CarsUAE`
      : view === "browse"
        ? sectionTitle
        : view === "vin"
        ? "فحص رقم الشاصي مجانًا | CarsUAE"
        : view === "blog"
        ? (articleBySlug(articleSlug)?.title || "مقالات ونصائح") + " | CarsUAE"
        : view === "info"
        ? `${INFO_PAGES[infoPage].title} | CarsUAE`
        : "CarsUAE — سوق السيارات المستعملة في الإمارات";
  }, [active, view, sectionTitle]);

  // Follows a link inside the site (from an article) without reloading the page.
  function goTo(href) {
    if (href === "#sell") { goAdd(); window.scrollTo(0, 0); return; }
    window.history.pushState({}, "", href);
    applyRoute(parsePath(href));
    window.scrollTo(0, 0);
  }

  function showToast(msg, tone = "mint") {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 2600);
  }

  function requireAuth(next) {
    if (!session) { setAuthOpen(true); return false; }
    return true;
  }

  function goAdd() {
    setEditingId(null);
    if (!requireAuth()) { showToast("سجّل الدخول أولًا لإضافة سيارتك", "red"); return; }
    setView("add");
  }

  // The confirmation link brings people back to whichever address they signed
  // up on (carsuae.net, or a preview URL), not Supabase's default Site URL.
  const authRedirect = () => window.location.origin;

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setAuthLoading(true);
    const email = authForm.email.trim();
    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: authForm.password,
          options: { emailRedirectTo: authRedirect() },
        });
        if (error) throw error;
        if (data.session) {
          // Email confirmation is switched off: the account is ready now.
          showToast("تم إنشاء الحساب وتسجيل دخولك");
          setAuthOpen(false);
        } else {
          // Keep the dialog open on a "check your inbox" screen with a resend button.
          setPendingEmail(email);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: authForm.password });
        if (error) throw error;
        showToast("تم تسجيل الدخول بنجاح");
        setAuthOpen(false);
      }
      setAuthForm({ email: "", password: "" });
    } catch (err) {
      if (/not confirmed/i.test(err.message || "")) {
        setPendingEmail(email);
        showToast("لم يتم تأكيد بريدك بعد. أرسلنا لك خيار إعادة إرسال رابط التأكيد.", "red");
      } else {
        showToast(authErrorMessage(err), "red");
      }
    } finally {
      setAuthLoading(false);
    }
  }

  async function resendConfirmation() {
    if (!pendingEmail || resendWait > 0) return;
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: pendingEmail,
        options: { emailRedirectTo: authRedirect() },
      });
      if (error) throw error;
      showToast("أعدنا إرسال رابط التأكيد إلى بريدك");
      setResendWait(60);
    } catch (err) {
      showToast(authErrorMessage(err), "red");
    } finally {
      setAuthLoading(false);
    }
  }

  // Count down the resend cooldown so people can't hammer the button.
  useEffect(() => {
    if (resendWait <= 0) return;
    const t = setTimeout(() => setResendWait((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendWait]);

  function closeAuth() {
    setAuthOpen(false);
    setPendingEmail("");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    showToast("تم تسجيل الخروج", "muted");
  }

  async function handleGoogleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) showToast("تعذر تسجيل الدخول عبر Google: " + error.message, "red");
  }

  async function handleAppleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: window.location.origin },
    });
    if (error) showToast("تعذر تسجيل الدخول عبر Apple: " + error.message, "red");
  }

  function onMakeChange(make) {
    const opts = MODELS[make];
    setForm((f) => ({ ...f, make, makeOther: "", model: opts ? opts[0] : OTHER, modelOther: "" }));
  }

  // Turns local UAE formats (05x, 5x, 9715x) into the +9715xxxxxxxx form Twilio needs.
  function toE164(raw) {
    const digits = String(raw || "").replace(/\D/g, "");
    if (digits.startsWith("971")) return "+" + digits;
    if (digits.startsWith("0")) return "+971" + digits.slice(1);
    if (digits.length === 9) return "+971" + digits;
    return "+" + digits;
  }

  async function sendOtp() {
    const phone = toE164(form.phone);
    if (!/^\+971\d{9}$/.test(phone)) {
      showToast("أدخل رقم جوال إماراتي صحيح (مثال: 0501234567)", "red");
      return;
    }
    if (!session) { showToast("سجّل الدخول أولًا", "red"); setAuthOpen(true); return; }
    setOtp({ sent: false, code: "", input: "", verifiedFor: "", sending: true });
    try {
      // Attaches the number to the signed-in account and texts a code.
      const { error } = await supabase.auth.updateUser({ phone });
      if (error) throw error;
      setOtp({ sent: true, code: "", input: "", verifiedFor: "", sending: false });
      showToast("أرسلنا رمز التحقق إلى جوالك");
    } catch (err) {
      setOtp({ sent: false, code: "", input: "", verifiedFor: "", sending: false });
      showToast("تعذر إرسال الرمز: " + err.message, "red");
    }
  }

  async function confirmOtp() {
    const phone = toE164(form.phone);
    if (!otp.input || otp.input.length < 4) {
      showToast("أدخل الرمز المرسل إليك", "red");
      return;
    }
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp.input,
        type: "phone_change",
      });
      if (error) throw error;
      setOtp((o) => ({ ...o, verifiedFor: form.phone, sending: false }));
      showToast("تم تأكيد رقم الجوال");
    } catch (err) {
      showToast("رمز التحقق غير صحيح أو منتهي", "red");
    }
  }

  const phoneVerified = Boolean(otp.verifiedFor) && otp.verifiedFor === form.phone;

  async function handleImage(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const room = MAX_IMAGES - (form.imageFiles?.length || 0);
    if (room <= 0) {
      showToast(`الحد الأقصى ${MAX_IMAGES} صور للإعلان`, "red");
      return;
    }
    const picked = files.slice(0, room);
    if (files.length > room) showToast(`تمت إضافة ${room} صور فقط (الحد ${MAX_IMAGES})`, "red");
    try {
      setChecking(true);
      const previews = await Promise.all(picked.map((f) => resizeImage(f)));

      const verdicts = await Promise.all(previews.map((p) => looksLikeVehicle(p)));
      const keptPreviews = previews.filter((_, i) => verdicts[i]);
      const keptFiles = picked.filter((_, i) => verdicts[i]);
      const rejected = verdicts.filter((v) => !v).length;

      if (rejected) {
        showToast(
          rejected === picked.length
            ? "لم نتعرف على سيارة في الصورة. يرجى رفع صورة واضحة للسيارة."
            : `تم تجاهل ${rejected} صورة لم نتعرف فيها على سيارة`,
          "red"
        );
      }
      if (!keptFiles.length) return;

      setForm((f) => ({
        ...f,
        previews: [...(f.previews || []), ...keptPreviews],
        imageFiles: [...(f.imageFiles || []), ...keptFiles],
      }));
    } catch {
      showToast("تعذر تحميل الصورة", "red");
    } finally {
      setChecking(false);
    }
    e.target.value = "";
  }

  function removeImage(index) {
    setForm((f) => ({
      ...f,
      previews: f.previews.filter((_, i) => i !== index),
      imageFiles: f.imageFiles.filter((_, i) => i !== index),
    }));
  }

  async function submitListing(e) {
    e.preventDefault();
    if (!requireAuth()) { showToast("سجّل الدخول أولًا لنشر إعلان", "red"); return; }
    const finalMake = form.make === "أخرى" ? form.makeOther.trim() : form.make;
    const finalModel = form.model === OTHER ? form.modelOther.trim() : form.model;
    if (!finalMake || !finalModel || !form.price || !form.phone) {
      showToast("يرجى تعبئة الماركة والموديل والسعر ورقم الجوال", "red");
      return;
    }
    const priceNum = Number(form.price);
    if (priceNum < 1000 || priceNum > 5000000) {
      showToast("يجب أن يكون السعر بين 1,000 و5,000,000 د.إ", "red");
      return;
    }
    if (REQUIRE_PHONE_VERIFICATION && !phoneVerified) {
      showToast("يرجى تأكيد رقم الجوال عبر رمز التحقق أولًا", "red");
      return;
    }
    setSaving(true);

    // Upload every picked photo to Storage; the row keeps only their URLs.
    let imageUrls = [];
    if (form.imageFiles?.length) {
      try {
        imageUrls = await Promise.all(
          form.imageFiles.map((f) => uploadImage(f, session.user.id))
        );
      } catch (err) {
        showToast("تعذر رفع الصور: " + err.message, "red");
        setSaving(false);
        return;
      }
    }

    const row = {
      seller_id: session.user.id,
      make: finalMake,
      model: finalModel,
      body_type: form.bodyType,
      year: Number(form.year),
      price: Number(form.price),
      mileage: Number(form.mileage) || 0,
      city: form.city,
      fuel: form.fuel,
      trans: form.trans,
      condition: form.condition,
      description: form.description,
      phone: toE164(form.phone),
      phone_verified: phoneVerified,
      specs: form.specs,
      steering: form.steering,
      negotiable: Boolean(form.negotiable),
      seller_name: form.sellerName.trim() || "البائع",
      image: imageUrls[0] || null,
      images: imageUrls,
    };
    if (myDealer && !editingId) { row.dealer_id = myDealer.id; row.seller_name = myDealer.name; }

    // The negotiable / previous_price columns are added by a SQL migration. If
    // it hasn't been run yet, save without them instead of failing the listing.
    const NEW_COLUMNS = ["negotiable", "previous_price"];
    const missingColumn = (err) => err && (err.code === "PGRST204" || /column/i.test(err.message || "")) &&
      NEW_COLUMNS.some((c) => (err.message || "").includes(c));
    const withoutNewColumns = (obj) => { const o = { ...obj }; NEW_COLUMNS.forEach((c) => delete o[c]); return o; };

    try {
      if (editingId) {
        // Keep the existing photos when the seller didn't pick new ones.
        const patch = { ...row };
        if (!imageUrls.length) { delete patch.image; delete patch.images; }
        delete patch.seller_id;

        // A lower price than before keeps the highest earlier price so buyers
        // see the cut; raising it back above that clears the discount.
        const before = listings.find((l) => l.id === editingId);
        if (before) {
          const reference = Math.max(Number(before.previous_price) || 0, Number(before.price) || 0);
          patch.previous_price = priceNum < reference ? reference : null;
        }

        let { error } = await supabase.from("listings").update(patch).eq("id", editingId);
        if (missingColumn(error)) ({ error } = await supabase.from("listings").update(withoutNewColumns(patch)).eq("id", editingId));
        if (error) throw error;
        showToast("تم تحديث الإعلان");
      } else {
        let { error } = await supabase.from("listings").insert(row);
        if (missingColumn(error)) ({ error } = await supabase.from("listings").insert(withoutNewColumns(row)));
        if (error) throw error;
        showToast("تم نشر إعلانك بنجاح");
      }
      await loadListings();
      setForm(emptyForm);
      setEditingId(null);
      setOtp({ sent: false, code: "", input: "", verifiedFor: "", sending: false });
      setView("browse");
    } catch (err) {
      showToast((editingId ? "تعذر تحديث الإعلان: " : "تعذر نشر الإعلان: ") + err.message, "red");
    } finally {
      setSaving(false);
    }
  }




  // Opening a listing puts /car/<id> in the address bar so it can be shared or bookmarked.
  function openListing(l) {
    setActive(l);
    // A seeded row has no phone yet: fetch the full row for the contact buttons.
    if (!("phone" in l)) {
      supabase.from("listings").select("*").eq("id", l.id).maybeSingle()
        .then(({ data }) => { if (data) setActive((cur) => (cur && cur.id === data.id ? data : cur)); });
    }
    setPhotoIdx(0);
    openedInApp.current = true;
    window.history.pushState({}, "", paths.car(l.id));
    trackVisit(supabase, paths.car(l.id), l.id);
  }

  function closeListing() {
    setViewerOpen(false);
    if (openedInApp.current) {
      // Step back to the list it was opened from; the popstate handler closes it.
      window.history.back();
      return;
    }
    // Landed straight on /car/<id>: close and let the URL follow the list.
    setActive(null);
  }

  function listingUrl(id) {
    return `${window.location.origin}${paths.car(id)}`;
  }

  async function shareListing(l) {
    const url = l.dealerSlug ? `${window.location.origin}${paths.dealer(l.dealerSlug)}` : listingUrl(l.id);
    const title = l.dealerSlug ? `سيارات ${l.make} على CarsUAE` : `${l.make} ${l.model} ${l.year} — ${l.price ? formatNumber(l.price) + " د.إ" : "للبيع"}`;
    if (navigator.share) {
      try { await navigator.share({ title, url }); return; } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("تم نسخ رابط الإعلان");
    } catch {
      showToast("تعذر نسخ الرابط", "red");
    }
  }

  async function loadFavorites() {
    const { data: s } = await supabase.auth.getSession();
    if (!s.session) { setFavorites([]); return; }
    const { data } = await supabase.from("favorites").select("listing_id");
    setFavorites((data || []).map((r) => r.listing_id));
  }

  async function toggleFavorite(id) {
    if (!session) { showToast("سجّل الدخول لحفظ المفضلة", "red"); setAuthOpen(true); return; }
    const isFav = favorites.includes(id);
    setFavorites((f) => (isFav ? f.filter((x) => x !== id) : [...f, id]));
    try {
      if (isFav) {
        await supabase.from("favorites").delete().eq("listing_id", id).eq("user_id", session.user.id);
      } else {
        await supabase.from("favorites").insert({ listing_id: id, user_id: session.user.id });
      }
    } catch {
      loadFavorites();
      showToast("تعذر تحديث المفضلة", "red");
    }
  }

  // Loads an existing listing back into the form for editing.
  function startEdit(l) {
    const known = MODELS[l.make];
    setForm({
      make: known ? l.make : OTHER,
      makeOther: known ? "" : l.make,
      model: known?.includes(l.model) ? l.model : OTHER,
      modelOther: known?.includes(l.model) ? "" : l.model,
      bodyType: l.body_type || BODY_TYPES[0],
      year: l.year, price: String(l.price), mileage: String(l.mileage || ""),
      city: l.city || CITIES[0], fuel: l.fuel || FUELS[0], trans: l.trans || TRANS[0],
      condition: l.condition || CONDITIONS[1],
      specs: l.specs || SPECS[0], steering: l.steering || STEERING[0],
      negotiable: Boolean(l.negotiable),
      description: l.description || "", phone: l.phone || "", sellerName: l.seller_name || "",
      previews: (l.images?.length ? l.images : [l.image]).filter(Boolean),
      imageFiles: [],
    });
    setEditingId(l.id);
    setActive(null);
    setView("add");
  }

  async function reportListing(id) {
    if (!session) { showToast("سجّل الدخول للإبلاغ", "red"); setAuthOpen(true); return; }
    const reason = window.prompt("ما سبب الإبلاغ؟ (مثال: رقم تواصل خاطئ)");
    if (reason === null) return;
    try {
      const { error } = await supabase.from("reports").insert({
        listing_id: id,
        reporter_id: session.user.id,
        reason: reason.trim() || null,
      });
      if (error) {
        if (error.code === "23505") { showToast("سبق أن أبلغت عن هذا الإعلان", "muted"); return; }
        throw error;
      }
      showToast("تم استلام بلاغك، شكرًا لك");
      setActive(null);
      await loadListings();
    } catch (err) {
      showToast("تعذر إرسال البلاغ: " + err.message, "red");
    }
  }

  // Sold / back on sale, and renewing for another LISTING_DAYS days. The
  // database lets the owner (and admins) make these changes.
  async function updateListing(id, patch, okMsg) {
    const { error } = await supabase.from("listings").update(patch).eq("id", id);
    if (error) { showToast("تعذر التحديث: " + error.message, "red"); return false; }
    showToast(okMsg);
    await loadListings();
    if (isAdmin) loadAdmin();
    setActive((a) => (a && a.id === id ? { ...a, ...patch } : a));
    return true;
  }
  const markSold = (l, sold = true) =>
    updateListing(l.id, { sold, sold_at: sold ? new Date().toISOString() : null }, sold ? "تم تعليم السيارة كمُباعة" : "رجع الإعلان للبيع");
  const renewListing = (l) =>
    updateListing(l.id, { expires_at: renewedExpiry() }, `تم تجديد الإعلان ${LISTING_DAYS} يومًا`);

  async function dismissReports(listingId) {
    const { error } = await supabase.from("reports").delete().eq("listing_id", listingId);
    if (!error) await supabase.from("listings").update({ reports_count: 0 }).eq("id", listingId);
    if (error) showToast("تعذر حذف البلاغات: " + error.message, "red");
    else showToast("تم تجاهل البلاغات ورجع الإعلان");
    loadAdmin(); loadListings();
  }

  async function deleteListing(id) {
    if (!window.confirm("متأكد تبي تحذف هذا الإعلان نهائيًا؟")) return;
    try {
      // Work out which files in Storage belong to this listing before the row goes.
      const row = listings.find((l) => l.id === id) || adminRows.find((l) => l.id === id);
      const urls = (row?.images?.length ? row.images : [row?.image]).filter(Boolean);
      const paths = urls
        .map((u) => u.split("/car-images/")[1])
        .filter(Boolean)
        .map((p) => decodeURIComponent(p));

      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (error) throw error;

      // Best effort: a failure here leaves unused files behind but the listing is gone.
      if (paths.length) {
        const { data: removed, error: rmError } = await supabase.storage
          .from("car-images")
          .remove(paths);
        if (rmError) {
          showToast("حُذف الإعلان، لكن تعذر حذف الصور: " + rmError.message, "red");
        } else if (!removed?.length) {
          showToast("حُذف الإعلان، لكن لم تُحذف أي صورة (تحقق من الصلاحيات)", "red");
        }
      }

      await loadListings();
      if (isAdmin) loadAdmin();
      setActive(null);
      showToast("تم حذف الإعلان", "muted");
    } catch (err) {
      showToast("تعذر حذف الإعلان: " + err.message, "red");
    }
  }


  // Sold and expired listings stay in the database but leave the public pages.
  const liveListings = useMemo(() => listings.filter(isLive), [listings]);

  const filtered = useMemo(() => {
    const rows = liveListings.filter((l) => {
      const text = `${l.make} ${l.model}`.toLowerCase();
      if (q && !text.includes(q.toLowerCase())) return false;
      if (makeFilter !== "الكل" && l.make !== makeFilter) return false;
      if (modelFilter && modelSlug(l.model) !== modelFilter) return false;
      if (dealerFilter && (!currentDealer || l.dealer_id !== currentDealer.id)) return false;
      if (cityFilter !== "الكل" && l.city !== cityFilter) return false;
      if (bodyTypeFilter !== "الكل" && l.body_type !== bodyTypeFilter) return false;
      if (maxPrice && l.price > Number(maxPrice)) return false;
      if (minPrice && l.price < Number(minPrice)) return false;
      if (specsFilter !== "الكل" && l.specs !== specsFilter) return false;
      if (minYear && l.year < Number(minYear)) return false;
      if (maxYear && l.year > Number(maxYear)) return false;
      if (maxKm && (l.mileage || 0) > Number(maxKm)) return false;
      if (negotiableOnly && !l.negotiable) return false;
      return true;
    });

    const sorters = {
      newest: (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
      priceAsc: (a, b) => a.price - b.price,
      priceDesc: (a, b) => b.price - a.price,
      yearDesc: (a, b) => b.year - a.year,
      kmAsc: (a, b) => (a.mileage || 0) - (b.mileage || 0),
    };
    return rows.sort(sorters[sortBy] || sorters.newest);
  }, [liveListings, q, makeFilter, modelFilter, dealerFilter, currentDealer, cityFilter, bodyTypeFilter, maxPrice, minPrice, sortBy, specsFilter, minYear, maxYear, maxKm, negotiableOnly]);

  const clearFilters = () => { setModelFilter(""); setDealerFilter(""); setMakeFilter("الكل"); setCityFilter("الكل"); setBodyTypeFilter("الكل"); setMaxPrice(""); setMinPrice(""); setSortBy("newest"); setSpecsFilter("الكل"); setMinYear(""); setMaxYear(""); setMaxKm(""); setNegotiableOnly(false); setQ(""); };
  const filtersActive = Boolean(modelFilter) || Boolean(dealerFilter) || makeFilter !== "الكل" || cityFilter !== "الكل" || bodyTypeFilter !== "الكل" || maxPrice || minPrice || specsFilter !== "الكل" || minYear || maxYear || maxKm || negotiableOnly || q;

  // Filters in use, shown as a number on the filters button.
  const filterCount = [
    makeFilter !== "الكل",
    Boolean(modelFilter),
    cityFilter !== "الكل",
    Boolean(maxPrice) || Boolean(minPrice),
    bodyTypeFilter !== "الكل",
    specsFilter !== "الكل",
    Boolean(minYear) || Boolean(maxYear),
    Boolean(maxKm),
    negotiableOnly,
  ].filter(Boolean).length;

  const modelOptions = MODELS[form.make];

  return (
    <div dir="rtl" className="cm-root cm-scroll">

      {/* Header */}
      <header className="cm-header">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3 relative">
          <button onClick={() => setView("home")} aria-label="CarsUAE الصفحة الرئيسية" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg cm-logo flex items-center justify-center">
              <Car size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <span dir="ltr" className="cm-display font-extrabold text-lg tracking-tight hidden sm:block">Cars<span className="cm-grad-text">UAE</span></span>
          </button>

          <nav className="flex items-center gap-1 sm:gap-2 min-w-0">
            <button
              onClick={() => setView("browse")}
              aria-label="السيارات"
              className={`text-sm font-bold px-2 sm:px-3 py-2 rounded-lg transition flex items-center gap-1.5 cm-navbtn ${view === "browse" ? "cm-navbtn-active" : ""}`}
            >
              <Search size={15} /> <span className="hidden sm:inline">السيارات</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setNavOpen((o) => !o)}
                aria-expanded={navOpen}
                aria-label="القائمة"
                className={`text-sm font-bold px-2 sm:px-3 py-2 rounded-lg transition flex items-center gap-1.5 cm-navbtn ${["vin", "blog", "info"].includes(view) ? "cm-navbtn-active" : ""}`}
              >
                <MenuIcon size={15} /> <span className="hidden sm:inline">القائمة</span>
              </button>
              {navOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNavOpen(false)} />
                  <div className="fixed inset-x-4 top-16 sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-60 cm-card-solid rounded-xl shadow-xl p-2 z-50">
                    {[
                      [<Search size={15} />, "تصفح السيارات", paths.all()],
                      [<Plus size={15} />, "بيع سيارتك", "#sell"],
                      [<ScanLine size={15} />, "فحص رقم الشاصي", paths.vin()],
                      [<BookOpen size={15} />, "المقالات والنصائح", paths.blog()],
                      [<Info size={15} />, "الأسئلة الشائعة", INFO_PAGES.faq.path],
                      [<ShieldCheck size={15} />, "نصائح الأمان", INFO_PAGES.safety.path],
                      [<Store size={15} />, "للمعارض والوسطاء", INFO_PAGES.dealers.path],
                      [<MessageCircle size={15} />, "تواصل معنا", INFO_PAGES.contact.path],
                    ].map(([icon, label, href]) => (
                      <a
                        key={href}
                        href={href === "#sell" ? "/sell" : href}
                        onClick={(e) => { e.preventDefault(); setNavOpen(false); goTo(href); }}
                        className="w-full text-right flex items-center gap-2 text-sm font-bold px-2 py-2.5 rounded-lg cm-navbtn"
                      >
                        <span className="cm-text-accent">{icon}</span> {label}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
            <a
              href={otherLangHref()}
              onClick={(e) => { e.preventDefault(); switchLang(); }}
              data-no-i18n=""
              lang={getLang() === "en" ? "ar" : "en"}
              aria-label={getLang() === "en" ? "العربية" : "English"}
              className="cm-lang-btn text-sm font-bold px-2 sm:px-3 py-2 rounded-lg transition cm-navbtn text-center"
            >
              {getLang() === "en" ? "عربي" : "EN"}
            </a>
            {session && (
              <button
                onClick={() => setView("mine")}
                aria-label="إعلاناتي"
                className={`text-sm font-bold px-2 sm:px-3 py-2 rounded-lg transition flex items-center gap-1.5 cm-navbtn ${view === "mine" ? "cm-navbtn-active" : ""}`}
              >
                <Store size={15} /> <span className="hidden sm:inline">إعلاناتي</span>
              </button>
            )}
            {session && (
              <button
                onClick={() => setView("saved")}
                aria-label="المفضلة"
                className={`text-sm font-bold px-2 sm:px-3 py-2 rounded-lg transition flex items-center gap-1.5 cm-navbtn ${view === "saved" ? "cm-navbtn-active" : ""}`}
              >
                <Heart size={15} /> <span className="hidden sm:inline">المفضلة</span>
              </button>
            )}
            <button
              onClick={goAdd}
              className="flex items-center gap-1.5 font-bold text-sm px-3 sm:px-3.5 py-2 rounded-lg transition cm-btn-primary whitespace-nowrap"
            >
              <Plus size={16} />
              <span>بيع سيارتك</span>
            </button>
            {session ? (
              <div className="relative">
                <button onClick={() => setMenuOpen((o) => !o)} aria-label="حسابي" className="cm-btn-ghost flex items-center gap-1.5 font-bold text-sm px-2 sm:px-3 py-2 rounded-lg transition">
                  <User size={15} className="cm-text-accent" />
                  <span className="hidden md:inline text-xs" style={{ maxWidth: "8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {session.user.user_metadata?.full_name || session.user.email.split("@")[0]}
                  </span>
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute left-0 mt-2 w-56 cm-card-solid rounded-xl shadow-xl p-2 z-50">
                      <p className="text-xs cm-text-muted px-2 py-1.5 truncate">{session.user.email}</p>
                      {isAdmin && (
                        <button onClick={() => { setMenuOpen(false); setView("admin"); }} className="w-full text-right flex items-center gap-2 text-sm font-bold px-2 py-2 rounded-lg cm-navbtn">
                          <ShieldCheck size={15} /> لوحة الإدارة
                        </button>
                      )}
                      <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="w-full text-right flex items-center gap-2 text-sm font-bold px-2 py-2 rounded-lg cm-navbtn">
                        <LogOut size={15} /> تسجيل الخروج
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={() => setAuthOpen(true)} aria-label="تسجيل الدخول" className="cm-btn-ghost flex items-center gap-1.5 font-bold text-sm px-3 py-2 rounded-lg transition">
                <LogIn size={15} />
                <span className="hidden sm:inline">تسجيل الدخول</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 inset-x-0 z-50 flex justify-center px-4">
          <div className={`px-4 py-2.5 rounded-lg text-sm font-bold shadow-xl ${toast.tone === "red" ? "cm-toast-red" : toast.tone === "muted" ? "cm-toast-muted" : "cm-toast-mint"}`}>
            {toast.msg}
          </div>
        </div>
      )}

      {/* HOME: search first, then shortcuts, then the newest cars. */}
      {view === "home" && (
        <>
          <section className="cm-hero">
            <div className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
              <h1 className="cm-display font-extrabold text-3xl sm:text-4xl mb-2">ابحث عن سيارتك</h1>
              <p className="cm-text-muted mb-6">سيارات مستعملة للبيع في كل الإمارات، من البائع مباشرة.</p>
              <form onSubmit={(e) => { e.preventDefault(); setView("browse"); }} className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={20} className="absolute top-1/2 -translate-y-1/2 right-3 cm-text-muted" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="مثال: تويوتا كامري"
                    className="cm-input cm-input-lg"
                    style={{ paddingRight: "2.75rem" }}
                  />
                </div>
                <button type="submit" className="cm-btn-primary cm-btn-lg font-bold whitespace-nowrap">بحث</button>
              </form>
            </div>
          </section>

          <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
            <div className="cm-sell-banner p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="cm-section-title">عندك سيارة للبيع؟</p>
                <p className="text-sm cm-text-muted mt-1">انشر إعلانك مجانًا خلال دقيقة.</p>
              </div>
              <button onClick={goAdd} className="cm-btn-primary font-bold text-sm px-5 py-2.5 rounded-lg flex items-center gap-1.5">
                <Plus size={16} /> بيع سيارتك
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="cm-section-title">أحدث السيارات</h2>
                {liveListings.length > 0 && (
                  <button onClick={() => setView("browse")} className="text-sm cm-link font-bold">عرض الكل</button>
                )}
              </div>
              {!loaded ? (
                // Placeholder cards the same size as real ones, so nothing jumps when they load.
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy="true" aria-label="جارِ التحميل">
                  {[0, 1, 2, 3, 4, 5].map((i) => <CardSkeleton key={i} />)}
                </div>
              ) : liveListings.length === 0 ? (
                <div className="text-center py-16 rounded-xl cm-soft">
                  <Car size={36} className="cm-icon-empty mx-auto mb-3" />
                  <p className="font-bold mb-1">لا توجد سيارات معروضة بعد</p>
                  <p className="text-sm cm-text-muted mb-4">كن أول من ينشر سيارته.</p>
                  <button onClick={goAdd} className="cm-btn-primary font-bold text-sm px-5 py-2.5 rounded-lg">بيع سيارتك</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveListings.slice(0, 6).map((l, i) => (
                    <ListingCard
                      key={l.id}
                      eager={i < 2}
                      l={l}
                      dealer={dealerById[l.dealer_id]}
                      onOpen={() => { setView("browse"); openListing(l); }}
                      isFav={favorites.includes(l.id)}
                      onFav={() => toggleFavorite(l.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </>
      )}

      {view === "vin" && <VinCheck onBrowse={() => setView("browse")} />}

      {view === "blog" && <Blog slug={articleSlug} goTo={goTo} />}

      {view === "info" && (
        <main className="max-w-3xl mx-auto px-4 py-8">
          <article className="cm-article" data-no-i18n="" lang="ar" dir="rtl">
            <h1 className="cm-display font-extrabold text-2xl mb-2">{INFO_PAGES[infoPage].title}</h1>
            {(infoPage === "terms" || infoPage === "privacy") && <p className="text-xs cm-text-muted mb-6">آخر تحديث: {formatArticleDate(LEGAL_UPDATED)}</p>}
            {!(infoPage === "terms" || infoPage === "privacy") && <div className="mb-4" />}
            <ArticleBlocks body={INFO_PAGES[infoPage].body} goTo={goTo} />
          </article>
        </main>
      )}

      {/* BUYER / BROWSE PAGE */}
      {(view === "mine" || view === "saved") && (
        <main className="max-w-6xl mx-auto px-4 py-6">
          {(() => {
            const rows = view === "mine"
              ? listings.filter((l) => session && l.seller_id === session.user.id)
              : listings.filter((l) => favorites.includes(l.id));
            return (
              <>
                <div className="mb-5">
                  <h1 className="cm-display font-extrabold text-2xl">
                    {view === "mine" ? "إعلاناتي" : "المفضلة"}
                  </h1>
                  <p className="cm-text-muted text-sm mt-1">{rows.length} إعلان</p>
                </div>

                {rows.length === 0 ? (
                  <div className="text-center py-16 rounded-xl cm-soft">
                    <Car size={36} className="cm-icon-empty mx-auto mb-3" />
                    <p className="cm-text-muted text-sm mb-4">
                      {view === "mine" ? "لم تنشر أي إعلان بعد." : "لم تضف أي إعلان إلى المفضلة بعد."}
                    </p>
                    <button onClick={() => setView(view === "mine" ? "add" : "browse")} className="cm-btn-primary font-bold text-sm px-4 py-2 rounded-lg">
                      {view === "mine" ? "أضف سيارتك" : "تصفح السيارات"}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rows.map((l) => (
                      <div key={l.id} className="flex flex-col">
                        <ListingCard
                          l={l}
                          dealer={dealerById[l.dealer_id]}
                          onOpen={() => openListing(l)}
                          isFav={favorites.includes(l.id)}
                          onFav={() => toggleFavorite(l.id)}
                        />
                        {view === "mine" && (
                          <>
                            <div className="pt-2">
                              <ListingStatus l={l} />
                            </div>
                            <div className="flex gap-2 pt-2">
                              {l.sold ? (
                                <button onClick={() => markSold(l, false)} className="flex-1 flex items-center justify-center gap-1.5 cm-btn-ghost text-xs font-bold py-2 rounded-lg">
                                  <Undo2 size={13} /> إرجاع للبيع
                                </button>
                              ) : (
                                <button onClick={() => markSold(l)} className="flex-1 flex items-center justify-center gap-1.5 cm-btn-ghost text-xs font-bold py-2 rounded-lg">
                                  <CircleCheck size={13} /> تم البيع
                                </button>
                              )}
                              {!l.sold && (daysLeft(l) ?? 99) <= 7 && (
                                <button onClick={() => renewListing(l)} className="flex-1 flex items-center justify-center gap-1.5 cm-btn-primary text-xs font-bold py-2 rounded-lg">
                                  <RefreshCw size={13} /> تجديد
                                </button>
                              )}
                              <button onClick={() => startEdit(l)} title="تعديل" className="flex items-center justify-center cm-btn-ghost px-3 py-2 rounded-lg">
                                <Pencil size={13} />
                              </button>
                              <button onClick={() => deleteListing(l.id)} title="حذف" className="flex items-center justify-center cm-danger-outline px-3 py-2 rounded-lg">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </main>
      )}

      {view === "admin" && isAdmin && (() => {
        const status = (l) => (l.reports_count >= REPORT_THRESHOLD ? "reported" : l.sold ? "sold" : isExpired(l) ? "expired" : "live");
        const counts = { all: adminRows.length, live: 0, sold: 0, expired: 0, reported: 0 };
        adminRows.forEach((l) => { counts[status(l)] += 1; });
        const reportedIds = new Set(adminReports.map((r) => r.listing_id));
        const needle = adminQ.trim().toLowerCase();
        const rows = adminRows.filter((l) => {
          if (adminTab === "reported" ? !(reportedIds.has(l.id) || l.reports_count > 0) : adminTab !== "all" && status(l) !== adminTab) return false;
          if (!needle) return true;
          return `${l.make} ${l.model} ${l.year} ${l.seller_name || ""} ${l.phone || ""} ${l.city || ""}`.toLowerCase().includes(needle);
        });
        const tabs = [["all", "الكل"], ["live", "ظاهرة"], ["sold", "مُباعة"], ["expired", "منتهية"], ["reported", "بلاغات"]];
        const label = { live: ["ظاهرة", "mint"], sold: ["مُباعة", "muted"], expired: ["منتهية", "red"], reported: ["مخفية بسبب البلاغات", "red"] };
        return (
          <main className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h1 className="cm-display font-extrabold text-2xl">لوحة الإدارة</h1>
              <div className="flex gap-2">
                <button onClick={() => setImportOpen(!importOpen)} className="cm-btn-ghost text-sm font-bold px-3 py-2 rounded-lg">استيراد من إنستغرام</button>
                <button onClick={loadAdmin} className="cm-btn-ghost text-sm font-bold px-3 py-2 rounded-lg flex items-center gap-1.5"><RefreshCw size={14} /> تحديث</button>
              </div>
            </div>

            {importOpen && (
              <Importer supabase={supabase} session={session} makes={Object.keys(MODELS)} cities={CITIES} specsList={SPECS} bodies={BODY_TYPES}
                onPublished={() => { loadAdmin(); loadListings(); }}
                onClose={() => { setImportOpen(false); if (window.location.hash.startsWith("#import")) window.history.replaceState({}, "", window.location.pathname); }} />
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              <div className="cm-stat"><b className="cm-tabular">{counts.all}</b><span>كل الإعلانات</span></div>
              <div className="cm-stat"><b className="cm-tabular">{counts.live}</b><span>ظاهرة للمشترين</span></div>
              <div className="cm-stat"><b className="cm-tabular">{counts.sold}</b><span>مُباعة</span></div>
              <div className="cm-stat"><b className="cm-tabular">{adminReports.length}</b><span>بلاغات</span></div>
            </div>

            {stats && (() => {
              const days = (stats.by_day || []).slice(-14);
              const peak = Math.max(1, ...days.map((d) => d.n));
              const srcName = { direct: "مباشر", instagram: "إنستقرام", facebook: "فيسبوك", google: "قوقل", whatsapp: "واتساب", tiktok: "تيك توك", search: "محركات بحث" };
              return (
                <section className="cm-card-solid rounded-xl p-4 mb-4">
                  <div className="flex items-baseline justify-between gap-2 mb-3">
                    <h2 className="cm-section-title">الزوار</h2>
                    <p className="text-xs cm-text-muted">اليوم <b className="cm-tabular">{formatNumber(stats.today || 0)}</b> · آخر 30 يوم <b className="cm-tabular">{formatNumber(stats.total || 0)}</b></p>
                  </div>
                  {days.length > 0 ? (
                    <div className="flex items-end gap-1 h-24 mb-1" dir="ltr">
                      {days.map((d) => (
                        <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full" title={`${d.day}: ${d.n}`}>
                          <span className="text-[10px] cm-text-muted cm-tabular">{d.n}</span>
                          <div className="w-full rounded-t cm-bar" style={{ height: `${Math.max(4, (d.n / peak) * 72)}px` }} />
                          <span className="text-[10px] cm-text-muted cm-tabular">{d.day.slice(8)}</span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm cm-text-muted">ما في زيارات مسجلة بعد. العداد بدأ مع هذا التحديث.</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs font-bold cm-text-muted mb-1.5">من وين جاء الزوار</p>
                      {(stats.by_source || []).slice(0, 6).map((r) => (
                        <div key={r.source} className="flex justify-between text-sm py-0.5"><span>{srcName[r.source] || r.source}</span><b className="cm-tabular">{formatNumber(r.n)}</b></div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-bold cm-text-muted mb-1.5">أكثر الإعلانات مشاهدة</p>
                      {(stats.top_listings || []).slice(0, 6).map((r) => (
                        <div key={r.listing_id} className="flex justify-between gap-2 text-sm py-0.5"><span className="truncate">{r.title}</span><b className="cm-tabular">{formatNumber(r.n)}</b></div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })()}

            <div className="relative mb-3">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 cm-text-muted" />
              <input value={adminQ} onChange={(e) => setAdminQ(e.target.value)} placeholder="ابحث بالماركة، الموديل، اسم البائع أو الرقم" className="cm-input" style={{ paddingRight: "2.4rem" }} />
            </div>
            <div className="flex gap-2 overflow-x-auto cm-chip-row pb-1 mb-4">
              {tabs.map(([k, t]) => (
                <button key={k} onClick={() => setAdminTab(k)} className={`cm-tab ${adminTab === k ? "cm-tab-on" : ""}`}>{t} ({k === "reported" ? reportedIds.size : counts[k]})</button>
              ))}
            </div>

            {rows.length === 0 ? (
              <div className="text-center py-12 rounded-xl cm-soft cm-text-muted text-sm">لا توجد إعلانات هنا.</div>
            ) : (
              <div className="space-y-2.5">
                {rows.map((l) => {
                  const st = status(l);
                  const reps = adminReports.filter((r) => r.listing_id === l.id);
                  const photo = l.image || l.images?.[0];
                  return (
                    <div key={l.id} className="cm-row p-3">
                      <div className="flex gap-3 items-start">
                        {photo ? <img src={imgSrc(photo, 384)} alt="" loading="lazy" className="cm-thumb" /> : <div className="cm-thumb flex items-center justify-center"><Car size={20} className="cm-icon-empty" /></div>}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="font-bold truncate">{l.make} {l.model} {l.year}</p>
                            <Badge tone={label[st][1]}>{label[st][0]}</Badge>
                          </div>
                          <p className="text-sm cm-tabular mt-0.5"><b>{l.price ? formatNumber(l.price) : "-"}</b> د.إ · {l.city || "-"} · {timeAgo(l.created_at)}</p>
                          <p className="text-xs cm-text-muted mt-0.5 cm-tabular truncate">{sellerLabel(l.seller_name)} · <span dir="ltr">{l.phone}</span>{st === "live" && daysLeft(l) !== null ? ` · ينتهي بعد ${daysLeft(l)} يوم` : ""}</p>
                        </div>
                      </div>
                      {reps.length > 0 && (
                        <div className="mt-2 rounded-lg cm-soft p-2 text-xs space-y-1">
                          <p className="font-bold cm-text-danger flex items-center gap-1"><Flag size={12} /> {reps.length} بلاغ</p>
                          {reps.slice(0, 3).map((r) => <p key={r.id} className="cm-text-muted">• {r.reason || "بدون سبب"} ({timeAgo(r.created_at)})</p>)}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2.5">
                        <button onClick={() => openListing(l)} className="cm-btn-ghost text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"><Eye size={13} /> عرض</button>
                        <button onClick={() => markSold(l, !l.sold)} className="cm-btn-ghost text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">{l.sold ? <><Undo2 size={13} /> إرجاع للبيع</> : <><CircleCheck size={13} /> تم البيع</>}</button>
                        {!l.sold && <button onClick={() => renewListing(l)} className="cm-btn-ghost text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"><RefreshCw size={13} /> تجديد {LISTING_DAYS} يوم</button>}
                        {reps.length > 0 && <button onClick={() => dismissReports(l.id)} className="cm-btn-ghost text-xs font-bold px-3 py-1.5 rounded-lg">تجاهل البلاغات</button>}
                        {dealers.length > 0 && (
                          <select value={l.dealer_id || ""} onChange={(e) => setListingDealer(l, e.target.value)} className="cm-input text-xs" style={{ width: "auto", padding: "0.3rem 0.5rem" }}>
                            <option value="">بدون وسيط</option>
                            {dealers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                          </select>
                        )}
                        <button onClick={() => deleteListing(l.id)} className="cm-danger-outline text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"><Trash2 size={13} /> حذف</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <section className="cm-card-solid rounded-xl p-4 mt-6">
              <h2 className="cm-section-title mb-1">الوسطاء (السماسرة)</h2>
              <p className="text-xs cm-text-muted mb-3">لكل وسيط صفحة فيها كل سياراته، وشارة «وسيط معتمد» على إعلاناته. اربط الإعلانات بالوسيط من القائمة فوق.</p>
              {dealers.length > 0 && (
                <div className="space-y-2 mb-4">
                  {dealers.map((d) => {
                    const n = adminRows.filter((l) => l.dealer_id === d.id && isLive(l)).length;
                    return (
                      <div key={d.id} className="cm-row p-2.5 flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-sm flex items-center gap-1">{d.verified && <BadgeCheck size={13} className="cm-text-mint" />}{d.name} <span className="cm-text-muted font-normal">· {n} سيارة</span></p>
                          <p className="text-xs cm-text-muted" dir="ltr">carsuae.net{paths.dealer(d.slug)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { applyRoute({ kind: "dealer", slug: d.slug }); }} className="cm-btn-ghost text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"><Eye size={13} /> الصفحة</button>
                          <button onClick={() => { navigator.clipboard?.writeText(`https://carsuae.net${paths.dealer(d.slug)}`); showToast("تم نسخ رابط صفحة الوسيط"); }} className="cm-btn-ghost text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"><Share2 size={13} /> نسخ الرابط</button>
                          <button onClick={() => removeDealer(d)} className="cm-danger-outline text-xs font-bold px-2.5 py-1.5 rounded-lg"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <form onSubmit={addDealer} className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input value={dealerForm.name} onChange={(e) => setDealerForm({ ...dealerForm, name: e.target.value })} placeholder="اسم الوسيط" className="cm-input" />
                <input value={dealerForm.slug} onChange={(e) => setDealerForm({ ...dealerForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} placeholder="الرابط بالإنجليزي مثل smsar" className="cm-input" dir="ltr" />
                <input value={dealerForm.instagram} onChange={(e) => setDealerForm({ ...dealerForm, instagram: e.target.value })} placeholder="حساب إنستقرام" className="cm-input" dir="ltr" />
                <select value={dealerForm.city} onChange={(e) => setDealerForm({ ...dealerForm, city: e.target.value })} className="cm-input">
                  <option value="">الإمارة</option>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <button type="submit" className="cm-btn-primary text-sm font-bold py-2 rounded-lg col-span-2 sm:col-span-4 flex items-center justify-center gap-1.5"><Plus size={15} /> إضافة وسيط</button>
              </form>
            </section>
          </main>
        );
      })()}

      {view === "browse" && (
        <main className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="cm-display font-extrabold text-2xl mb-2">{categoryCopy(sectionRoute).h1}</h1>
          {currentDealer && (
            <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
              {currentDealer.verified && <Badge tone="mint"><BadgeCheck size={12} /> وسيط معتمد</Badge>}
              {currentDealer.city && <span className="cm-text-muted flex items-center gap-1"><MapPin size={13} />{currentDealer.city}</span>}
              {currentDealer.instagram && <a href={`https://instagram.com/${currentDealer.instagram}`} target="_blank" rel="noopener noreferrer" className="cm-link font-bold" dir="ltr">@{currentDealer.instagram}</a>}
              <button onClick={() => shareListing({ id: null, dealerSlug: currentDealer.slug, make: currentDealer.name })} className="cm-btn-ghost text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"><Share2 size={13} /> مشاركة الصفحة</button>
            </div>
          )}
          {!currentDealer && <div className="mb-2" />}

          <div className="relative mb-4">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 cm-text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن ماركة أو موديل"
              className="cm-input cm-input-lg"
              style={{ paddingRight: "2.5rem" }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className="cm-btn-ghost font-bold text-sm px-3.5 py-2 rounded-lg flex items-center gap-1.5"
              >
                <Settings2 size={15} /> الفلاتر
                {filterCount > 0 && <span className="cm-filter-count">{filterCount}</span>}
              </button>
              {filtersActive && (
                <button onClick={clearFilters} className="text-sm cm-link">مسح الكل</button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm cm-text-muted">{formatNumber(filtered.length)} سيارة</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="cm-input" style={{ width: "auto" }} aria-label="الترتيب">
                <option value="newest">الأحدث</option>
                <option value="priceAsc">الأقل سعرًا</option>
                <option value="priceDesc">الأعلى سعرًا</option>
                <option value="yearDesc">الأحدث موديلًا</option>
                <option value="kmAsc">الأقل ممشى</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="cm-filter-panel mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field label="الماركة">
                <ComboBox value={makeFilter} options={["الكل", ...MAKES]} onChange={(v) => { setMakeFilter(v); setModelFilter(""); }} placeholder="كل الماركات" />
              </Field>
              {makeFilter !== "الكل" && (() => {
                const names = [...new Set([...(MODELS[makeFilter] || []), ...liveListings.filter((l) => l.make === makeFilter).map((l) => l.model)])].filter((m) => modelSlug(m));
                return (
                  <Field label="الموديل">
                    <select value={modelFilter} onChange={(e) => setModelFilter(e.target.value)} className="cm-input">
                      <option value="">كل الموديلات</option>
                      {names.map((m) => <option key={m} value={modelSlug(m)}>{m}</option>)}
                    </select>
                  </Field>
                );
              })()}
              <Field label="الإمارة">
                <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="cm-input">
                  <option value="الكل">كل الإمارات</option>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="الميزانية">
                <select value={minPrice ? "" : maxPrice} onChange={(e) => { setMinPrice(""); setMaxPrice(e.target.value); }} className="cm-input">
                  <option value="">أي سعر</option>
                  {BUDGETS.map((b) => <option key={b.max} value={String(b.max)}>{b.label} درهم</option>)}
                </select>
              </Field>
              <Field label="نوع السيارة">
                <select value={bodyTypeFilter} onChange={(e) => setBodyTypeFilter(e.target.value)} className="cm-input">
                  <option value="الكل">الكل</option>
                  {BODY_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="سنة الصنع">
                <div className="flex items-center gap-2">
                  <select value={minYear} onChange={(e) => { const v = e.target.value; setMinYear(v); if (v && maxYear && Number(maxYear) < Number(v)) setMaxYear(""); }} className="cm-input cm-tabular" aria-label="من سنة">
                    <option value="">من سنة</option>
                    {YEAR_OPTIONS.map((y) => <option key={y} value={y}>من {y}</option>)}
                  </select>
                  <select value={maxYear} onChange={(e) => { const v = e.target.value; setMaxYear(v); if (v && minYear && Number(minYear) > Number(v)) setMinYear(""); }} className="cm-input cm-tabular" aria-label="إلى سنة">
                    <option value="">إلى سنة</option>
                    {YEAR_OPTIONS.map((y) => <option key={y} value={y}>إلى {y}</option>)}
                  </select>
                </div>
              </Field>
              <Field label="الممشى">
                <select value={maxKm} onChange={(e) => setMaxKm(e.target.value)} className="cm-input cm-tabular">
                  <option value="">أي ممشى</option>
                  {MILEAGE_OPTIONS.map((k) => <option key={k} value={k}>أقل من {formatNumber(k)} كم</option>)}
                </select>
              </Field>
              <Field label="المواصفات">
                <select value={specsFilter} onChange={(e) => setSpecsFilter(e.target.value)} className="cm-input">
                  <option value="الكل">الكل</option>
                  {SPECS.map((x) => <option key={x}>{x}</option>)}
                </select>
              </Field>
              <label className="flex items-center gap-2 cm-input cursor-pointer" style={{ alignSelf: "end" }}>
                <input type="checkbox" checked={negotiableOnly} onChange={(e) => setNegotiableOnly(e.target.checked)} className="w-4 h-4" />
                <span className="text-sm">قابل للتفاوض فقط</span>
              </label>
            </div>
          )}

          {!loaded ? (
            <div className="flex items-center justify-center py-24 cm-text-muted">
              <Loader2 className="animate-spin ml-2" size={18} /> جارِ التحميل...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 rounded-xl cm-soft">
              <Car className="mx-auto mb-3 cm-icon-empty" size={36} />
              <p className="font-bold mb-1">لا توجد سيارات مطابقة</p>
              <p className="text-sm cm-text-muted mb-4">جرّب تغيير البحث أو الفلاتر.</p>
              <div className="flex justify-center gap-2">
                {filtersActive && <button onClick={clearFilters} className="cm-btn-ghost font-bold text-sm px-4 py-2 rounded-lg">مسح الفلاتر</button>}
                <button onClick={goAdd} className="cm-btn-primary font-bold text-sm px-4 py-2 rounded-lg">بيع سيارتك</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((l, i) => (
                <ListingCard
                  key={l.id}
                  eager={i < 2}
                  l={l}
                  dealer={dealerById[l.dealer_id]}
                  onOpen={() => openListing(l)}
                  isFav={favorites.includes(l.id)}
                  onFav={() => toggleFavorite(l.id)}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {/* SELLER / ADD PAGE */}
      {view === "add" && !session && (
        <main className="max-w-6xl mx-auto px-4 py-6 relative">
          <div className="max-w-sm mx-auto text-center cm-card rounded-2xl p-8">
            <User size={32} className="cm-text-accent mx-auto mb-3" />
            <h2 className="cm-display font-extrabold text-lg mb-2">سجّل الدخول أولًا</h2>
            <p className="text-sm cm-text-muted mb-4">تحتاج حساب لإضافة سيارتك ونشرها للجميع.</p>
            <button onClick={() => setAuthOpen(true)} className="cm-btn-primary font-bold text-sm px-4 py-2 rounded-lg">تسجيل الدخول / إنشاء حساب</button>
          </div>
        </main>
      )}
      {view === "add" && session && (
        <main className="max-w-6xl mx-auto px-4 py-6 relative">
          <div className="max-w-xl mx-auto">
            <h2 className="cm-display font-extrabold text-xl mb-1">أضف سيارتك للبيع</h2>
            <p className="text-sm cm-text-muted mb-6">إعلانك سيظهر مباشرة لجميع الزوار في الإمارات. لا رسوم على النشر.</p>

            <form onSubmit={submitListing} className="space-y-4">
              <div>
                <div onClick={() => fileRef.current?.click()} className="cm-aspect-16-9 rounded-xl cm-upload flex flex-col items-center justify-center cursor-pointer overflow-hidden transition">
                  {checking ? (
                    <>
                      <Loader2 size={26} className="cm-text-muted mb-2 animate-spin" />
                      <span className="text-sm cm-text-muted">جاري فحص الصور…</span>
                    </>
                  ) : form.previews?.length ? (
                    <img src={form.previews[0]} className="w-full h-full object-cover" alt="preview" />
                  ) : (
                    <>
                      <ImagePlus size={28} className="cm-text-muted mb-2" />
                      <span className="text-sm cm-text-muted">اضغط لإضافة صور السيارة (حتى {MAX_IMAGES})</span>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImage} className="hidden" />
                </div>

                {form.previews?.length > 0 && (
                  <>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {form.previews.map((src, i) => (
                        <div key={i} className="relative rounded-lg overflow-hidden cm-media aspect-square">
                          <img src={src} className="w-full h-full object-cover" alt="" />
                          {i === 0 && (
                            <span className="absolute bottom-0 inset-x-0 text-[10px] text-center text-white bg-black/60 py-0.5">الرئيسية</span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 left-1 bg-black/60 hover:bg-black/80 rounded-full p-1 text-white"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      {form.previews.length < MAX_IMAGES && (
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="rounded-lg cm-upload aspect-square flex items-center justify-center"
                        >
                          <Plus size={20} className="cm-text-muted" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs cm-text-muted mt-2">الصورة الأولى هي الرئيسية التي تظهر في نتائج البحث.</p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="الماركة">
                  <ComboBox value={form.make} options={MAKES} onChange={onMakeChange} placeholder="ابحث عن الماركة…" />
                </Field>

                <Field label="الموديل">
                  {modelOptions ? (
                    <ComboBox
                      value={form.model === OTHER ? "موديل آخر" : form.model}
                      options={[...modelOptions, "موديل آخر"]}
                      onChange={(v) => setForm({ ...form, model: v === "موديل آخر" ? OTHER : v })}
                      placeholder="ابحث عن الموديل…"
                    />
                  ) : (
                    <input required value={form.modelOther} onChange={(e) => setForm({ ...form, modelOther: e.target.value })} placeholder="اكتب اسم الموديل" className="cm-input" />
                  )}
                </Field>

                {form.make === "أخرى" && (
                  <div className="col-span-2">
                    <Field label="اسم الماركة">
                      <input required value={form.makeOther} onChange={(e) => setForm({ ...form, makeOther: e.target.value })} placeholder="اكتب اسم الماركة" className="cm-input" />
                    </Field>
                  </div>
                )}

                {modelOptions && form.model === OTHER && (
                  <div className="col-span-2">
                    <Field label="اسم الموديل">
                      <input required value={form.modelOther} onChange={(e) => setForm({ ...form, modelOther: e.target.value })} placeholder="اكتب اسم الموديل" className="cm-input" />
                    </Field>
                  </div>
                )}

                <Field label="نوع السيارة">
                  <select value={form.bodyType} onChange={(e) => setForm({ ...form, bodyType: e.target.value })} className="cm-input">
                    {BODY_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>

                <Field label="سنة الصنع">
                  <input type="number" min="1980" max={new Date().getFullYear() + 1} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="cm-input cm-tabular" />
                </Field>
                <Field label="الحالة">
                  <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="cm-input">
                    {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="السعر (د.إ)">
                  <input required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value.replace(/\D/g, "") })} placeholder="85000" className="cm-input cm-tabular" />
                </Field>
                <Field label="المواصفات">
                  <select value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} className="cm-input">
                    {SPECS.map((x) => <option key={x}>{x}</option>)}
                  </select>
                </Field>
                <Field label="جهة المقود">
                  <select value={form.steering} onChange={(e) => setForm({ ...form, steering: e.target.value })} className="cm-input">
                    {STEERING.map((x) => <option key={x}>{x}</option>)}
                  </select>
                </Field>
                <Field label="الممشى (كم)">
                  <input value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value.replace(/\D/g, "") })} placeholder="45000" className="cm-input cm-tabular" />
                </Field>
                <Field label="نوع الوقود">
                  <select value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value })} className="cm-input">
                    {FUELS.map((f) => <option key={f}>{f}</option>)}
                  </select>
                </Field>
                <Field label="ناقل الحركة">
                  <select value={form.trans} onChange={(e) => setForm({ ...form, trans: e.target.value })} className="cm-input">
                    {TRANS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="الإمارة">
                  <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="cm-input">
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="رقم الجوال">
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => { setForm({ ...form, phone: e.target.value.replace(/[^\d+]/g, "") }); setOtp({ sent: false, code: "", input: "", verifiedFor: "", sending: false }); }}
                    placeholder="05xxxxxxxx"
                    className="cm-input cm-tabular"
                  />
                </Field>
              </div>

              <label className="flex items-center gap-3 cm-spec px-3 py-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(form.negotiable)}
                  onChange={(e) => setForm({ ...form, negotiable: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>
                  <span className="block text-sm font-bold">السعر قابل للتفاوض</span>
                  <span className="block text-xs cm-text-muted">تظهر شارة "قابل للتفاوض" على إعلانك.</span>
                </span>
              </label>
              {editingId && (
                <p className="text-xs cm-text-muted -mt-2">
                  إذا خفّضت السعر، يظهر للمشترين السعر القديم مشطوبًا مع نسبة الخصم.
                </p>
              )}

              {myDealer ? (
                <p className="text-sm rounded-lg p-3 cm-soft flex items-center gap-1.5"><BadgeCheck size={15} /> الإعلان ينزل باسم <b>{myDealer.name}</b>{myDealer.instagram ? <span dir="ltr">@{myDealer.instagram}</span> : null}. اكتب في خانة الرقم رقم صاحب السيارة.</p>
              ) : (
                <Field label="اسم البائع (اختياري)">
                  <input value={form.sellerName} onChange={(e) => setForm({ ...form, sellerName: e.target.value })} placeholder="اسمك" className="cm-input" />
                </Field>
              )}

              <Field label="وصف السيارة">
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="اذكر تفاصيل إضافية: الفحص، الصيانة، الحوادث..." className="cm-input resize-none" />
              </Field>

              <button disabled={saving} type="submit" className="w-full cm-btn-primary font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition">
                {saving ? <Loader2 className="animate-spin" size={18} /> : <BadgeCheck size={18} />}
                نشر الإعلان
              </button>
            </form>
          </div>
        </main>
      )}

      {/* Detail modal */}
      {active && (
        <div className="cm-modal-backdrop flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={closeListing}>
          <div onClick={(e) => e.stopPropagation()} className="cm-card-solid rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg overflow-y-auto cm-scroll" style={{ maxHeight: "92vh" }}>
            <div className="cm-aspect-16-9 cm-media flex items-center justify-center relative">
              {(() => {
                const gallery = (active.images?.length ? active.images : [active.image]).filter(Boolean);
                if (!gallery.length) return <Car size={56} className="cm-icon-empty" />;
                return (
                  <>
                    <img
                      src={imgSrc(gallery[Math.min(photoIdx, gallery.length - 1)], 1080, 75)}
                      srcSet={imgSrcSet(gallery[Math.min(photoIdx, gallery.length - 1)], [640, 1080])}
                      sizes="(min-width: 640px) 512px, 100vw"
                      onClick={() => setViewerOpen(true)}
                      className="w-full h-full object-cover cursor-zoom-in"
                      alt=""
                    />
                    <button
                      onClick={() => setViewerOpen(true)}
                      aria-label="تكبير الصورة"
                      className="absolute bottom-3 left-3 bg-black/60 hover:bg-black/80 rounded-full p-1.5 text-white"
                    >
                      <Maximize2 size={16} />
                    </button>
                    {viewerOpen && (
                      <PhotoViewer
                        images={gallery}
                        index={Math.min(photoIdx, gallery.length - 1)}
                        onIndex={setPhotoIdx}
                        onClose={() => setViewerOpen(false)}
                      />
                    )}
                    {gallery.length > 1 && (
                      <>
                        <button
                          onClick={() => setPhotoIdx((i) => (i - 1 + gallery.length) % gallery.length)}
                          className="absolute top-1/2 -translate-y-1/2 right-3 bg-black/50 hover:bg-black/70 rounded-full p-1.5 text-white"
                        >
                          <ChevronRight size={18} />
                        </button>
                        <button
                          onClick={() => setPhotoIdx((i) => (i + 1) % gallery.length)}
                          className="absolute top-1/2 -translate-y-1/2 left-3 bg-black/50 hover:bg-black/70 rounded-full p-1.5 text-white rotate-180"
                        >
                          <ChevronRight size={18} />
                        </button>
                        <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs rounded-full px-2 py-0.5">
                          {Math.min(photoIdx, gallery.length - 1) + 1} / {gallery.length}
                        </span>
                      </>
                    )}
                  </>
                );
              })()}
              <button onClick={closeListing} className="absolute top-3 left-3 bg-black/50 hover:bg-black/70 rounded-full p-1.5 text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="cm-display font-extrabold text-xl">{active.make} {active.model}</h3>
                  <p className="text-xs cm-text-muted mt-1 flex flex-wrap items-center gap-1">
                    <span>{timeAgo(active.created_at)} · {active.city || "-"}</span>
                    <span>· <Eye size={11} className="inline" /> {formatNumber(active.views || 0)} مشاهدة</span>
                  </p>
                  {makeSlug(active.make) && modelSlug(active.model) && (
                    <a href={paths.model(active.make, active.model)} onClick={(e) => { e.preventDefault(); setActive(null); applyRoute({ kind: "model", make: active.make, modelSlug: modelSlug(active.model) }); window.history.pushState({}, "", paths.model(active.make, active.model)); }} className="text-xs cm-link font-bold mt-1 inline-block">
                      كل سيارات {active.make} {active.model} ←
                    </a>
                  )}
                </div>
                <Badge tone={active.condition === "جديدة" ? "mint" : "muted"}>{active.condition}</Badge>
              </div>

              {active.sold && (
                <div className="mt-3 rounded-lg px-3 py-2 text-sm font-bold cm-badge-red" style={{ border: "1px solid" }}>
                  تم بيع هذه السيارة
                </div>
              )}
              {!active.sold && isExpired(active) && (
                <div className="mt-3 rounded-lg px-3 py-2 text-sm font-bold cm-badge-muted" style={{ border: "1px solid" }}>
                  انتهت مدة هذا الإعلان
                </div>
              )}

              <div className="my-4">
                <div className="flex flex-wrap items-center gap-2">
                  <PricePlate price={active.price} size="lg" />
                  {discountPercent(active) > 0 && (
                    <span className="text-sm cm-text-muted line-through cm-tabular">{formatNumber(active.previous_price)} د.إ</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {discountPercent(active) > 0 && <Badge tone="red">خصم {discountPercent(active)}%</Badge>}
                  {active.negotiable && <Badge tone="blue">قابل للتفاوض</Badge>}
                  {active.specs && <Badge tone="muted">مواصفات {active.specs}</Badge>}
                </div>
                {active.price > 0 && <p className="text-sm cm-text-muted mt-2" title="دفعة أولى 20%، 5 سنوات، فائدة ثابتة 3% سنويًا. للاسترشاد فقط.">
                  قسط تقريبي من <span className="font-bold cm-text-accent cm-tabular">{formatNumber(monthlyInstallment(active.price))} د.إ</span> شهريًا
                </p>}
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-sm mb-4">
                <Spec icon={<Calendar size={14} />} label="سنة الصنع" value={active.year} />
                <Spec icon={<Gauge size={14} />} label="الممشى" value={active.mileage ? `${formatNumber(active.mileage)} كم` : null} />
                <Spec icon={<Fuel size={14} />} label="الوقود" value={active.fuel} />
                <Spec icon={<Settings2 size={14} />} label="ناقل الحركة" value={active.trans} />
                <Spec icon={<ShieldCheck size={14} />} label="المواصفات" value={active.specs} />
                <Spec icon={<Car size={14} />} label="جهة المقود" value={active.steering} />
                <Spec icon={<Car size={14} />} label="نوع السيارة" value={active.body_type} />
                <Spec icon={<MapPin size={14} />} label="الإمارة" value={active.city} />
              </div>

              {active.description && (
                <div className="mb-4">
                  <p className="text-xs font-bold cm-text-muted mb-1">الوصف</p>
                  <p className="text-sm leading-relaxed">{active.description}</p>
                </div>
              )}

              <div className="cm-divider flex items-center justify-between pt-4 gap-2">
                <div>
                  {dealerById[active.dealer_id] && (
                    <p className="text-xs flex items-center flex-wrap gap-1 mb-0.5">
                      <span className="cm-text-muted">📢 الإعلان من حساب</span>
                      {dealerById[active.dealer_id].instagram ? (
                        <a href={`https://instagram.com/${dealerById[active.dealer_id].instagram}`} target="_blank" rel="noopener noreferrer" className="font-bold cm-link flex items-center gap-1">
                          {dealerById[active.dealer_id].verified && <BadgeCheck size={12} />} {dealerById[active.dealer_id].name} <span dir="ltr">@{dealerById[active.dealer_id].instagram}</span>
                        </a>
                      ) : (
                        <a href={paths.dealer(dealerById[active.dealer_id].slug)} onClick={(e) => { e.preventDefault(); const d = dealerById[active.dealer_id]; setActive(null); applyRoute({ kind: "dealer", slug: d.slug }); window.history.pushState({}, "", paths.dealer(d.slug)); }} className="font-bold cm-link flex items-center gap-1">
                          {dealerById[active.dealer_id].verified && <BadgeCheck size={12} />} {dealerById[active.dealer_id].name}
                        </a>
                      )}
                      <a href={paths.dealer(dealerById[active.dealer_id].slug)} onClick={(e) => { e.preventDefault(); const d = dealerById[active.dealer_id]; setActive(null); applyRoute({ kind: "dealer", slug: d.slug }); window.history.pushState({}, "", paths.dealer(d.slug)); }} className="cm-text-muted underline">كل إعلاناته</a>
                    </p>
                  )}
                  <p className="text-xs cm-text-muted flex items-center gap-1">
                    {sellerLabel(active.seller_name)}
                    {active.phone_verified && (
                      <span className="inline-flex items-center gap-0.5 cm-text-mint" title="تم تأكيد رقم البائع">
                        <BadgeCheck size={12} /> رقم موثّق
                      </span>
                    )}
                  </p>
                  {session ? (
                    <p className="text-sm font-bold cm-tabular">{active.phone}</p>
                  ) : (
                    <p className="text-sm font-bold cm-tabular cm-text-muted">•••• ••• ••••</p>
                  )}
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  {!active.sold && (
                    <a
                      href={`https://wa.me/${waNumber(active.phone)}?text=${encodeURIComponent(`السلام عليكم، شفت إعلان ${active.make} ${active.model} ${active.year} على CarsUAE وأبي أستفسر عنها: ${listingUrl(active.id)}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 cm-btn-wa font-bold text-sm px-4 py-2 rounded-lg"
                    >
                      <MessageCircle size={15} /> واتساب
                    </a>
                  )}
                  {!active.sold && (
                    <button
                      onClick={() => { openedInApp.current = false; setActive(null); setView("vin"); }}
                      className="flex items-center gap-1.5 cm-btn-ghost font-bold text-sm px-3 py-2 rounded-lg"
                      title="اطلب رقم الشاصي من البائع وافحصه مجانًا"
                    >
                      <ScanLine size={15} /> افحص الشاصي
                    </button>
                  )}
                  {active.sold ? null : session ? (
                    <a href={`tel:${active.phone}`} className="flex items-center gap-1.5 cm-btn-primary font-bold text-sm px-4 py-2 rounded-lg">
                      <Phone size={15} /> اتصال
                    </a>
                  ) : (
                    <button
                      onClick={() => setAuthOpen(true)}
                      className="flex items-center gap-1.5 cm-btn-ghost font-bold text-sm px-4 py-2 rounded-lg"
                    >
                      <Phone size={15} /> عرض الرقم
                    </button>
                  )}
                  {session && (active.seller_id === session.user.id || isAdmin) ? (
                    <>
                      <button onClick={() => markSold(active, !active.sold)} title={active.sold ? "إرجاع للبيع" : "تم البيع"} className="flex items-center gap-1 cm-btn-ghost text-sm font-bold px-3 py-2 rounded-lg">
                        {active.sold ? <><Undo2 size={15} /> إرجاع للبيع</> : <><CircleCheck size={15} /> تم البيع</>}
                      </button>
                      <button onClick={() => deleteListing(active.id)} title="حذف الإعلان" className="flex items-center justify-center cm-danger-outline px-3 py-2 rounded-lg">
                        <Trash2 size={15} />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => reportListing(active.id)} title="إبلاغ عن الإعلان" className="flex items-center justify-center cm-btn-ghost px-3 py-2 rounded-lg">
                      <Flag size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => shareListing(active)}
                    title="مشاركة الإعلان"
                    className="flex items-center justify-center cm-btn-ghost px-3 py-2 rounded-lg"
                  >
                    <Share2 size={15} />
                  </button>
                  <button
                    onClick={() => toggleFavorite(active.id)}
                    title={favorites.includes(active.id) ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                    className="flex items-center justify-center cm-btn-ghost px-3 py-2 rounded-lg"
                  >
                    <Heart size={15} className={favorites.includes(active.id) ? "cm-text-accent" : ""} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth modal */}
      {authOpen && (
        <div className="cm-modal-backdrop flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={closeAuth}>
          <div onClick={(e) => e.stopPropagation()} className="cm-card-solid rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="cm-display font-extrabold text-lg">
                {pendingEmail ? "أكّد بريدك الإلكتروني" : authMode === "signup" ? "إنشاء حساب" : "تسجيل الدخول"}
              </h3>
              <button onClick={closeAuth} className="cm-icon-empty"><X size={20} /></button>
            </div>

            {pendingEmail ? (
              <div className="text-center">
                <CheckCircle2 size={36} className="cm-text-mint mx-auto mb-3" />
                <p className="text-sm leading-relaxed">
                  أرسلنا رابط التأكيد إلى
                  <br />
                  <span className="font-bold" dir="ltr">{pendingEmail}</span>
                </p>
                <p className="text-xs cm-text-muted mt-2 leading-relaxed">
                  افتح الرسالة واضغط الرابط، ثم سجّل الدخول. إذا لم تجدها خلال دقيقتين، تحقق من مجلد الرسائل غير المرغوب فيها (Spam).
                </p>
                <button
                  type="button"
                  onClick={resendConfirmation}
                  disabled={authLoading || resendWait > 0}
                  className="w-full cm-btn-ghost font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 mt-4"
                >
                  {authLoading ? <Loader2 className="animate-spin" size={16} /> : null}
                  {resendWait > 0 ? `إعادة الإرسال بعد ${resendWait} ثانية` : "إعادة إرسال رابط التأكيد"}
                </button>
                <button
                  type="button"
                  onClick={() => { setPendingEmail(""); setAuthMode("login"); }}
                  className="text-xs cm-link font-bold mt-3"
                >
                  أكّدت بريدي، سجّل الدخول
                </button>
              </div>
            ) : (
            <>
            <form onSubmit={handleAuthSubmit} className="space-y-3">
              <Field label="البريد الإلكتروني">
                <input required type="email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} placeholder="you@example.com" className="cm-input" />
              </Field>
              <Field label="كلمة المرور">
                <input required type="password" minLength={6} value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} placeholder="6 أحرف على الأقل" className="cm-input" />
              </Field>
              <button disabled={authLoading} type="submit" className="w-full cm-btn-primary font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">
                {authLoading ? <Loader2 className="animate-spin" size={16} /> : null}
                {authMode === "signup" ? "إنشاء الحساب" : "دخول"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className="cm-divider" style={{ flex: 1 }} />
              <span className="text-xs cm-text-muted">أو</span>
              <div className="cm-divider" style={{ flex: 1 }} />
            </div>

            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full cm-btn-ghost font-bold py-2.5 rounded-lg flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6 29.5 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.2-.1-2.4-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2 13.9-5.4l-6.4-5.3C29.5 35 26.9 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.7 16.3 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4 5.6l6.4 5.3C41.5 35.6 44 30.3 44 24c0-1.2-.1-2.4-.4-3.5z" />
              </svg>
              الدخول باستخدام Google
            </button>

            <button
              onClick={handleAppleSignIn}
              type="button"
              className="w-full cm-btn-ghost font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 mt-2"
            >
              <svg width="18" height="18" viewBox="0 0 384 512" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              الدخول باستخدام Apple
            </button>

            <p className="text-xs cm-text-muted text-center mt-4 leading-relaxed">
              بالتسجيل أو الدخول، أنت توافق على{" "}
              <a href={paths.terms()} onClick={(e) => { e.preventDefault(); setAuthOpen(false); goTo(paths.terms()); }} className="cm-link">الشروط والأحكام</a>
              {" "}و{" "}
              <a href={paths.privacy()} onClick={(e) => { e.preventDefault(); setAuthOpen(false); goTo(paths.privacy()); }} className="cm-link">سياسة الخصوصية</a>.
            </p>

            <p className="text-xs cm-text-muted text-center mt-4">
              {authMode === "signup" ? "عندك حساب؟" : "ما عندك حساب؟"}{" "}
              <button onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")} className="cm-link font-bold">
                {authMode === "signup" ? "سجّل الدخول" : "أنشئ حساب جديد"}
              </button>
            </p>
            </>
            )}
          </div>
        </div>
      )}

      <footer className="cm-hero mt-10" style={{ borderTop: "1px solid var(--cm-border)", borderBottom: "none" }}>
        {/* Popular searches: plain links to category pages, for visitors and for search engines. */}
        <nav aria-label="عمليات بحث شائعة" className="max-w-6xl mx-auto px-4 pt-6 grid gap-3 text-sm">
          {[
            ["سيارات حسب الإمارة", CITIES.map((c) => [`سيارات مستعملة في ${c}`, paths.city(c)])],
            ["أشهر السيارات", [["نيسان", "باترول"], ["تويوتا", "لاند كروزر"], ["لكزس", "LX"], ["لاند روفر", "رينج روفر"], ["مرسيدس", "الفئة G"], ["تويوتا", "برادو"], ["شيفروليه", "تاهو"], ["جي إم سي", "يوكن"], ["تويوتا", "كامري"], ["نيسان", "التيما"]].map(([mk, md]) => [`${mk} ${md} مستعمل`, paths.model(mk, md)])],
            ["حسب الميزانية", [30000, 50000, 100000, 200000].map((v) => [`سيارات أقل من ${v.toLocaleString("ar-AE")} درهم`, paths.budget(v)])],
          ].map(([title, links]) => (
            <div key={title} className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="font-bold">{title}:</span>
              {links.map(([label, href]) => (
                <a key={href} href={href} onClick={(e) => { e.preventDefault(); goTo(href); }} className="cm-link">{label}</a>
              ))}
            </div>
          ))}
        </nav>
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {[["تصفح السيارات", paths.all()], ["فحص رقم الشاصي", paths.vin()], ["المقالات", paths.blog()], ...FOOTER_PAGES.map((k) => [INFO_PAGES[k].short, INFO_PAGES[k].path])].map(([label, href]) => (
            <a key={href} href={href} onClick={(e) => { e.preventDefault(); goTo(href); }} className="cm-link">{label}</a>
          ))}
          <span className="cm-text-muted mr-auto" dir="ltr">© CarsUAE</span>
        </div>
      </footer>
    </div>
  );
}


// A text field that filters a long option list as you type, so a 135-item make
// list stays usable on a phone. Falls back to free text when nothing matches.
function ComboBox({ value, options, onChange, placeholder }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, 40);
    const en = getLang() === "en";
    return options.filter((o) => o.toLowerCase().includes(q) || (en && translate(o).toLowerCase().includes(q))).slice(0, 40);
  }, [query, options]);

  return (
    <div className="relative">
      <input
        value={open ? query : (getLang() === "en" ? translate(value) : value)}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => { setQuery(""); setOpen(true); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className="cm-input"
      />
      {open && matches.length > 0 && (
        <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-lg cm-card shadow-lg">
          {matches.map((o) => (
            <button
              key={o}
              type="button"
              onMouseDown={() => { onChange(o); setOpen(false); }}
              className="w-full text-right px-3 py-2 text-sm cm-navbtn transition"
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Search-result card: the facts a buyer scans first (year, km, specs), the
// price with any cut from the earlier asking price, and a rough monthly payment.
// Full-screen photo viewer: swipe / arrows to change photo, pinch, double-tap
// or mouse wheel to zoom, drag to move a zoomed photo, Esc or ✕ to close.
function PhotoViewer({ images, index, onIndex, onClose }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const touch = useRef({ startDist: 0, startScale: 1, last: null, startX: 0, startY: 0, moved: false, lastTap: 0 });
  const count = images.length;

  const reset = () => { setScale(1); setPos({ x: 0, y: 0 }); };
  const go = (d) => { reset(); onIndex((index + d + count) % count); };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); }
      else if (e.key === "ArrowLeft" && count > 1) go(1);
      else if (e.key === "ArrowRight" && count > 1) go(-1);
    };
    window.addEventListener("keydown", onKey, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey, true); document.body.style.overflow = prevOverflow; };
  });

  const clampScale = (s) => Math.min(4, Math.max(1, s));
  const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

  function onTouchStart(e) {
    const t = touch.current;
    if (e.touches.length === 2) {
      t.startDist = dist(e.touches);
      t.startScale = scale;
    } else if (e.touches.length === 1) {
      t.last = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      t.startX = e.touches[0].clientX;
      t.startY = e.touches[0].clientY;
      t.moved = false;
    }
  }

  function onTouchMove(e) {
    const t = touch.current;
    if (e.touches.length === 2 && t.startDist) {
      const s = clampScale(t.startScale * (dist(e.touches) / t.startDist));
      setScale(s);
      if (s === 1) setPos({ x: 0, y: 0 });
    } else if (e.touches.length === 1 && t.last) {
      const x = e.touches[0].clientX, y = e.touches[0].clientY;
      if (Math.abs(x - t.startX) > 8 || Math.abs(y - t.startY) > 8) t.moved = true;
      if (scale > 1) setPos((p) => ({ x: p.x + (x - t.last.x), y: p.y + (y - t.last.y) }));
      t.last = { x, y };
    }
  }

  function onTouchEnd(e) {
    const t = touch.current;
    if (e.touches.length > 0) return;
    // Swipe to change photo when not zoomed.
    if (scale === 1 && t.last && count > 1) {
      const dx = t.last.x - t.startX;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(t.last.y - t.startY)) { go(dx < 0 ? 1 : -1); t.last = null; return; }
    }
    // Double-tap toggles zoom.
    if (!t.moved && t.startDist === 0) {
      const now = Date.now();
      if (now - t.lastTap < 300) { if (scale > 1) reset(); else setScale(2.5); t.lastTap = 0; }
      else t.lastTap = now;
    }
    t.startDist = 0;
    t.last = null;
  }

  // Mouse: wheel zooms, drag moves, double-click toggles zoom.
  const drag = useRef(null);
  function onWheel(e) {
    const s = clampScale(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
    setScale(s);
    if (s === 1) setPos({ x: 0, y: 0 });
  }

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center select-none"
      style={{ zIndex: 60, touchAction: "none" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
        onDoubleClick={() => (scale > 1 ? reset() : setScale(2.5))}
        onMouseDown={(e) => { if (scale > 1) drag.current = { x: e.clientX, y: e.clientY }; }}
        onMouseMove={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
          drag.current = { x: e.clientX, y: e.clientY };
          setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
        }}
        onMouseUp={() => { drag.current = null; }}
        onMouseLeave={() => { drag.current = null; }}
      >
        <img
          src={images[index]}
          alt=""
          draggable={false}
          className="w-full h-full object-contain"
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            transition: drag.current || touch.current.last ? "none" : "transform 0.15s ease-out",
            cursor: scale > 1 ? "grab" : "zoom-in",
          }}
        />
      </div>

      <button onClick={onClose} aria-label="إغلاق" className="absolute top-4 left-4 bg-black/60 hover:bg-black/80 rounded-full p-2 text-white">
        <X size={22} />
      </button>
      <span className="absolute top-5 right-4 bg-black/60 text-white text-sm rounded-full px-3 py-1">
        {index + 1} / {count}
      </span>

      {count > 1 && (
        <>
          <button onClick={() => go(-1)} aria-label="السابقة" className="absolute top-1/2 -translate-y-1/2 right-3 bg-black/60 hover:bg-black/80 rounded-full p-2 text-white">
            <ChevronRight size={24} />
          </button>
          <button onClick={() => go(1)} aria-label="التالية" className="absolute top-1/2 -translate-y-1/2 left-3 bg-black/60 hover:bg-black/80 rounded-full p-2 text-white rotate-180">
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {scale === 1 && (
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs rounded-full px-3 py-1">
          اضغط مرتين أو باصبعين للتكبير
        </span>
      )}
    </div>
  );
}

function ListingCard({ l, onOpen, isFav, onFav, dealer, eager = false }) {
  const photo = l.image || l.images?.[0];
  const discount = discountPercent(l);
  const facts = [l.year || "-", l.mileage ? `${formatNumber(l.mileage)} كم` : "- كم", l.specs || "-"];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => { if (e.key === "Enter") onOpen(); }}
      className="text-right cm-card rounded-xl overflow-hidden transition group cursor-pointer flex flex-col"
    >
      <div className="cm-aspect-16-10 cm-media flex items-center justify-center overflow-hidden relative">
        {photo ? (
          <img
            src={imgSrc(photo, 640)}
            srcSet={imgSrcSet(photo, [384, 640, 828])}
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            alt={`${l.make} ${l.model} ${l.year}`}
            loading={eager ? "eager" : "lazy"}
            fetchpriority={eager ? "high" : undefined}
            decoding="async"
            width="640" height="400"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <Car size={44} className="cm-icon-empty" />
        )}

        <div className="absolute top-2 right-2 flex flex-wrap gap-1 z-10">
          {l.sold && <span className="cm-tag cm-tag-dark">تم البيع</span>}
          {!l.sold && isRecent(l.created_at) && <span className="cm-tag cm-tag-mint">جديد</span>}
          {discount > 0 && <span className="cm-tag cm-tag-red">خصم {discount}%</span>}
          {l.condition === "جديدة" && <span className="cm-tag cm-tag-dark">سيارة جديدة</span>}
        </div>

        {l.images?.length > 1 && (
          <span className="absolute bottom-2 right-2 z-10 bg-black/60 text-white text-[10px] rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
            <ImagePlus size={10} /> {l.images.length}
          </span>
        )}

        {onFav && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onFav(); }}
            title={isFav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
            aria-label={isFav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
            className="absolute top-2 left-2 z-10 rounded-full p-2 cm-fav-btn"
          >
            <Heart size={16} className={isFav ? "cm-heart-on" : ""} />
          </button>
        )}
      </div>

      <div className="p-3.5 flex flex-col flex-1">
        <p className="font-bold leading-tight truncate">{l.make} {l.model}</p>
        <p className="text-sm cm-text-muted mt-1 cm-tabular truncate">{facts.join(" · ")}</p>

        <div className="flex items-center gap-2 mt-2.5">
          <PricePlate price={l.price} />
          {discount > 0 && (
            <span className="text-xs cm-text-muted line-through cm-tabular">{formatNumber(l.previous_price)}</span>
          )}
          {l.negotiable && <span className="cm-tag cm-tag-blue">قابل للتفاوض</span>}
        </div>

        <div className="flex items-center justify-between gap-2 mt-2">
          <p className="text-xs cm-text-muted flex items-center gap-1"><MapPin size={12} />{l.city || "-"}</p>
          {dealer?.verified && <span className="cm-tag cm-tag-blue flex items-center gap-0.5"><BadgeCheck size={11} /> وسيط معتمد</span>}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold cm-text-muted mb-1">{label}</span>
      {children}
    </label>
  );
}

function Spec({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 cm-spec px-3 py-2">
      <span className="cm-text-accent">{icon}</span>
      <div>
        <p className="text-xs cm-text-muted">{label}</p>
        <p className="text-xs font-bold cm-tabular">{value === null || value === undefined || value === "" ? "-" : value}</p>
      </div>
    </div>
  );
}

// "فحص رقم الشاصي": the buyer types a VIN, /api/vin answers with what the VIN
// itself says (country, maker, year) and, for cars built for the North
// American market, factory specs and recalls from NHTSA. We never call a car
// "خليجي" or "وارد" outright: the VIN alone cannot prove it, so the page gives
// a hint and tells the buyer how to be sure.
function VinCheck({ onBrowse }) {
  const [vin, setVin] = useState(() => {
    if (typeof window === "undefined") return "";
    return cleanVin(new URLSearchParams(window.location.search).get("vin") || "");
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function check(e) {
    if (e) e.preventDefault();
    const v = cleanVin(vin);
    setVin(v);
    setResult(null);
    if (!isVinFormat(v)) {
      setError(v.length !== 17
        ? `رقم الشاصي يتكون من 17 خانة، وكتبت ${v.length}.`
        : "في رقم الشاصي رمز غير صحيح. تأكد من الرقم.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const r = await fetch(`/api/vin?vin=${v}`);
      const data = await r.json();
      if (!data.ok) setError(data.error || "تعذر فحص الرقم.");
      else setResult(data);
    } catch {
      setError("تعذر الاتصال الآن. حاول بعد قليل.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (vin.length === 17) check(); }, []);

  const s = result?.specs;
  const title = s ? `${s.make} ${s.model}${s.year ? ` ${s.year}` : ""}` : [result?.maker, result?.year].filter(Boolean).join(" ");
  const row = (label, value) => value ? (
    <div className="flex justify-between gap-4 py-2 text-sm" style={{ borderBottom: "1px solid var(--cm-border)" }}>
      <span className="cm-text-muted">{label}</span>
      <span className="font-bold text-left">{value}</span>
    </div>
  ) : null;

  // What we can honestly say about the car's market: the VIN alone never
  // proves GCC vs imported, so we say so and tell the buyer how to check.
  const origin = result ? (result.northAmerica
    ? `السيارة مصنوعة في ${result.country || "أمريكا الشمالية"}. هذا لا يعني أنها وارد، فكثير من سيارات الخليج (شيفروليه، جي إم سي، فورد، جيب...) تُصنع هناك.`
    : "رقم الشاصي يبيّن مواصفات المصنع، لكنه وحده لا يثبت إذا كانت السيارة خليجية أو وارد.")
    + " للتأكد: اطلب من البائع سجل صيانة الوكالة، أو اسأل وكيل الماركة برقم الشاصي، أو افحصها في مركز فحص." : null;

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="cm-display font-extrabold text-2xl mb-1 flex items-center gap-2"><ScanLine size={24} className="cm-text-accent" /> فحص رقم الشاصي</h1>
        <p className="text-sm cm-text-muted">مجانًا: بلد الصنع، الشركة المصنعة، سنة الموديل، ومواصفات المصنع.</p>
      </div>

      <form onSubmit={check} className="flex gap-2">
        <input
          dir="ltr"
          value={vin}
          onChange={(e) => setVin(e.target.value.toUpperCase())}
          placeholder="مثال: JTMHV05J804012345"
          maxLength={25}
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          className="cm-input cm-input-lg cm-tabular flex-1"
          style={{ letterSpacing: "0.08em" }}
        />
        <button type="submit" disabled={loading} className="cm-btn-primary cm-btn-lg font-bold whitespace-nowrap flex items-center gap-1.5">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />} افحص
        </button>
      </form>
      <p className="text-xs cm-text-muted -mt-3">
        تلقاه في ملكية السيارة، أو أسفل الزجاج الأمامي من جهة السائق، أو على باب السائق من الداخل. يتكون من 17 حرفًا ورقمًا.
      </p>

      {error && (
        <div className="cm-badge cm-badge-red w-full py-2.5 px-3 text-sm"><AlertTriangle size={16} /> {error}</div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="cm-card rounded-xl p-5">
            <p className="text-xs cm-text-muted cm-tabular" dir="ltr">{result.vin}</p>
            <h2 className="cm-display font-extrabold text-xl mt-1">{title || "سيارة"}</h2>
            {s?.trim && <p className="text-sm cm-text-muted">{s.trim}</p>}
            <div className="mt-3">
              {row("بلد الصنع", result.country)}
              {row("المصنع", s?.plant)}
              {row("الشركة المصنعة", result.maker || s?.manufacturer)}
              {row("سنة الموديل", s?.year || result.year)}
              {row("نوع الهيكل", s?.body)}
              {row("المحرك", s?.engine)}
              {row("الوقود", s?.fuel)}
              {row("ناقل الحركة", s?.trans)}
              {row("نظام الدفع", s?.drive)}
              {row("الأبواب", s?.doors)}
              {row("المقاعد", s?.seats)}
            </div>
            {!s && (
              <p className="text-xs cm-text-muted mt-3 flex gap-1.5"><Info size={14} className="shrink-0 mt-0.5" /> تفاصيل المحرك والفئة غير متوفرة لهذا الرقم في قاعدة البيانات المجانية. المعلومات أعلاه مقروءة من رقم الشاصي نفسه.</p>
            )}
          </div>

          {origin && (
            <div className="cm-badge cm-badge-blue w-full py-3 px-3 text-sm items-start" style={{ fontWeight: 600, lineHeight: 1.7 }}>
              <Info size={16} className="shrink-0 mt-1" /> <span>خليجي ولا وارد؟ {origin}</span>
            </div>
          )}

          {Array.isArray(result.recalls) && (
            <div className="cm-card rounded-xl p-5">
              <h3 className="font-bold mb-2">نداءات الاستدعاء من الشركة</h3>
              {result.recalls.length === 0 ? (
                <p className="text-sm cm-text-mint flex items-center gap-1.5"><CheckCircle2 size={15} /> لا توجد نداءات استدعاء مسجّلة لهذا الموديل.</p>
              ) : (
                <>
                  <p className="text-sm mb-2">يوجد <b>{result.recallsTotal || result.recalls.length}</b> نداء استدعاء لهذا الموديل والسنة. اسأل البائع أو الوكالة هل تم إصلاحها.</p>
                  <ul className="text-xs cm-text-muted space-y-1" dir="ltr">
                    {result.recalls.map((x, i) => <li key={x.id || i}>• {x.component}{x.id ? ` (${x.id})` : ""}</li>)}
                  </ul>
                </>
              )}
            </div>
          )}

          <p className="text-xs cm-text-muted leading-relaxed">
            هذا الفحص يقرأ مواصفات المصنع فقط، ولا يكشف الحوادث أو الممشى الحقيقي. قبل الشراء افحص السيارة في مركز فحص معتمد.
          </p>
          <button onClick={onBrowse} className="cm-link font-bold text-sm">تصفح السيارات المعروضة للبيع</button>
        </div>
      )}
    </main>
  );
}

// المقالات: the list at /blog, or one article at /blog/<slug>. Same content as
// the server pages in api/page.js (both read src/articles.js).
function Blog({ slug, goTo }) {
  const a = slug ? articleBySlug(slug) : null;
  const link = (href, children, className) => (
    <a href={href} onClick={(e) => { e.preventDefault(); goTo(href); }} className={className}>{children}</a>
  );

  if (slug && !a) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="font-bold mb-3">المقالة غير موجودة</p>
        {link(paths.blog(), "كل المقالات", "cm-link font-bold")}
      </main>
    );
  }

  if (!a) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="cm-display font-extrabold text-2xl mb-2 flex items-center gap-2"><BookOpen size={24} className="cm-text-accent" /> مقالات ونصائح</h1>
        <p className="cm-text-muted text-sm mb-6">نصائح عملية لشراء وبيع السيارات المستعملة في الإمارات.</p>
        <div className="space-y-4">
          {ARTICLES.map((x) => <React.Fragment key={x.slug}>{link(paths.article(x.slug), (
            <>
              <h2 className="cm-section-title">{x.title}</h2>
              <p className="text-sm cm-text-muted mt-1">{x.description}</p>
              <p className="text-xs cm-text-muted mt-2">{formatArticleDate(x.date)} · {x.readMinutes} دقائق قراءة</p>
            </>
          ), "cm-card rounded-xl p-5 block")}</React.Fragment>)}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {link(paths.blog(), <><ArrowRight size={15} /> كل المقالات</>, "cm-link text-sm font-bold inline-flex items-center gap-1 mb-4")}
      <article className="cm-article" data-no-i18n="" lang="ar" dir="rtl">
        <h1 className="cm-display font-extrabold text-2xl mb-2" style={{ lineHeight: 1.5 }}>{a.title}</h1>
        <p className="text-xs cm-text-muted mb-6">{formatArticleDate(a.date)} · {a.readMinutes} دقائق قراءة</p>
        <ArticleBlocks body={a.body} goTo={goTo} />
      </article>
    </main>
  );
}

// Renders the block lists of src/articles.js and src/legal.js.
function ArticleBlocks({ body, goTo }) {
  return body.map(([type, v], i) => {
    if (type === "h2") return <h2 key={i} className="cm-section-title mt-8 mb-3">{v}</h2>;
    if (type === "p") return <p key={i} className="mb-4">{v}</p>;
    if (type === "ul") return <ul key={i} className="cm-article-list mb-4">{v.map((x, j) => <li key={j}>{x}</li>)}</ul>;
    if (type === "ol") return <ol key={i} className="cm-article-list mb-4">{v.map((x, j) => <li key={j}>{x}</li>)}</ol>;
    if (type === "tip") return <p key={i} className="cm-article-tip mb-4">{v}</p>;
    if (type === "faq") return (
      <div key={i} className="space-y-2 mb-4">
        {v.map(([q, a], j) => (
          <details key={j} className="cm-card rounded-lg px-4 py-3">
            <summary className="font-bold cursor-pointer">{q}</summary>
            <p className="mt-2 cm-text-muted">{a}</p>
          </details>
        ))}
      </div>
    );
    if (type === "contact") return (
      <div key={i} className="cm-sell-banner p-4 my-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">البريد الإلكتروني: <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr" className="cm-link font-bold">{CONTACT_EMAIL}</a></p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="cm-btn-primary font-bold text-sm px-4 py-2 rounded-lg">راسلنا</a>
      </div>
    );
    if (type === "cta") return (
      <div key={i} className="cm-sell-banner p-4 my-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold">{v.text}</p>
        <a href={v.href} onClick={(e) => { e.preventDefault(); goTo(v.href); }} className="cm-btn-primary font-bold text-sm px-4 py-2 rounded-lg">{v.label}</a>
      </div>
    );
    return null;
  });
}

// Grey stand-in for a ListingCard while listings load (same shape and height).
function CardSkeleton() {
  return (
    <div className="cm-card rounded-xl overflow-hidden flex flex-col" aria-hidden="true">
      <div className="cm-aspect-16-10 cm-media" />
      <div className="p-3.5 flex flex-col gap-2">
        <div className="cm-skel" style={{ width: "60%", height: 16 }} />
        <div className="cm-skel" style={{ width: "80%", height: 12 }} />
        <div className="cm-skel" style={{ width: "40%", height: 20, marginTop: 6 }} />
        <div className="cm-skel" style={{ width: "30%", height: 12 }} />
      </div>
    </div>
  );
}
