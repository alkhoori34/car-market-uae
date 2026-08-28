import React, { useState, useEffect, useMemo, useRef } from "react";
import { Car, Plus, Search, MapPin, Gauge, Calendar, Fuel, Settings2, Phone, X, ImagePlus, Trash2, ChevronRight, BadgeCheck, Loader2, Store, Sparkles, ShieldCheck, CheckCircle2, LogIn, LogOut, User } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Environment variables are injected at build time by Vite from .env.local
// (or from the "Environment Variables" settings in your Vercel project).
// Never commit real keys to .env.local — it's already in .gitignore.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CITIES = ["دبي", "أبوظبي", "الشارقة", "عجمان", "رأس الخيمة", "الفجيرة", "أم القيوين", "العين"];
const FUELS = ["بنزين", "ديزل", "هجين", "كهربائي"];
const TRANS = ["أوتوماتيك", "مانيوال"];
const CONDITIONS = ["جديدة", "مستعملة"];
const BODY_TYPES = ["سيدان", "دفع رباعي (SUV)", "بيك أب", "هاتشباك", "كوبيه", "فان", "رياضية"];
const OTHER = "__OTHER__";

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
  "تسلا": ["Model 3", "Model Y", "Model S", "Model X"],
};

const MAKES = [...Object.keys(MODELS), "أخرى"];

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function formatNumber(n) {
  return new Intl.NumberFormat("ar-AE").format(n);
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
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

// All colors/effects are implemented as plain named CSS classes below (never as
// Tailwind arbitrary-bracket utilities), since this environment renders a fixed
// pre-built Tailwind stylesheet without a JIT compiler for arbitrary values.

function Badge({ children, tone = "blue" }) {
  const cls = tone === "mint" ? "cm-badge-mint" : tone === "muted" ? "cm-badge-muted" : "cm-badge-blue";
  return <span className={`cm-badge ${cls}`}>{children}</span>;
}

function PricePlate({ price, size = "md" }) {
  const big = size === "lg";
  return (
    <div className="cm-price-chip" style={{ padding: big ? "0.5rem 0.75rem" : "0.375rem 0.75rem" }}>
      <span className={`cm-tabular cm-grad-text cm-glow-text font-black ${big ? "text-3xl" : "text-lg"}`}>{formatNumber(price)}</span>
      <span className={`cm-text-accent font-bold ${big ? "text-sm" : "text-xs"}`}>د.إ</span>
    </div>
  );
}

export default function CarMarket() {
  const [listings, setListings] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("home"); // home | browse | add

  // Auth (Supabase email/password accounts)
  const [session, setSession] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login | signup
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authLoading, setAuthLoading] = useState(false);
  const [active, setActive] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const [q, setQ] = useState("");
  const [makeFilter, setMakeFilter] = useState("الكل");
  const [cityFilter, setCityFilter] = useState("الكل");
  const [bodyTypeFilter, setBodyTypeFilter] = useState("الكل");
  const [maxPrice, setMaxPrice] = useState("");

  const emptyForm = {
    make: MAKES[0], makeOther: "", model: MODELS[MAKES[0]][0], modelOther: "",
    bodyType: BODY_TYPES[0], year: new Date().getFullYear(), price: "", mileage: "",
    city: CITIES[0], fuel: FUELS[0], trans: TRANS[0], condition: CONDITIONS[1],
    description: "", phone: "", sellerName: "", image: null,
  };
  const [form, setForm] = useState(emptyForm);
  const fileRef = useRef(null);

  // Mock OTP verification (no SMS backend connected in this prototype)
  const [otp, setOtp] = useState({ sent: false, code: "", input: "", verifiedFor: "" });

  async function loadListings() {
    try {
      const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
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
    // Light polling so new listings from other visitors show up without a manual refresh.
    const id = setInterval(loadListings, 15000);
    return () => { clearInterval(id); listener.subscription.unsubscribe(); };
  }, []);

  function showToast(msg, tone = "mint") {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 2600);
  }

  function requireAuth(next) {
    if (!session) { setAuthOpen(true); return false; }
    return true;
  }

  function goAdd() {
    if (!requireAuth()) { showToast("سجّل الدخول أولًا لإضافة سيارتك", "red"); return; }
    setView("add");
  }

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({ email: authForm.email, password: authForm.password });
        if (error) throw error;
        showToast("تم إنشاء الحساب. إذا طُلب تأكيد بريدك، تحقق من إيميلك قبل الدخول.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: authForm.email, password: authForm.password });
        if (error) throw error;
        showToast("تم تسجيل الدخول بنجاح");
      }
      setAuthOpen(false);
      setAuthForm({ email: "", password: "" });
    } catch (err) {
      showToast(err.message || "حدث خطأ، حاول مرة أخرى", "red");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    showToast("تم تسجيل الخروج", "muted");
  }


  function onMakeChange(make) {
    const opts = MODELS[make];
    setForm((f) => ({ ...f, make, makeOther: "", model: opts ? opts[0] : OTHER, modelOther: "" }));
  }

  function sendOtp() {
    if (!form.phone || form.phone.replace(/\D/g, "").length < 9) {
      showToast("أدخل رقم جوال صحيح أولًا", "red");
      return;
    }
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setOtp({ sent: true, code, input: "", verifiedFor: "" });
    // Demo only: no SMS provider is connected, so the code is shown here instead of being texted.
    showToast(`(تجريبي) رمز التحقق: ${code}`, "mint");
  }

  function confirmOtp() {
    if (otp.input === otp.code) {
      setOtp((o) => ({ ...o, verifiedFor: form.phone }));
      showToast("تم تأكيد رقم الجوال");
    } else {
      showToast("رمز التحقق غير صحيح", "red");
    }
  }

  const phoneVerified = otp.verifiedFor && otp.verifiedFor === form.phone;

  async function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file);
      setForm((f) => ({ ...f, image: dataUrl }));
    } catch {
      showToast("تعذر تحميل الصورة", "red");
    }
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
    if (!phoneVerified) {
      showToast("يرجى تأكيد رقم الجوال عبر رمز التحقق أولًا", "red");
      return;
    }
    setSaving(true);
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
      phone: form.phone,
      seller_name: form.sellerName || session.user.email,
      image: form.image,
    };
    try {
      const { error } = await supabase.from("listings").insert(row);
      if (error) throw error;
      await loadListings();
      setForm(emptyForm);
      setOtp({ sent: false, code: "", input: "", verifiedFor: "" });
      showToast("تم نشر إعلانك بنجاح");
      setView("browse");
    } catch (err) {
      showToast("تعذر نشر الإعلان: " + err.message, "red");
    } finally {
      setSaving(false);
    }
  }

  async function deleteListing(id) {
    try {
      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (error) throw error;
      await loadListings();
      setActive(null);
      showToast("تم حذف الإعلان", "muted");
    } catch (err) {
      showToast("تعذر حذف الإعلان: " + err.message, "red");
    }
  }


  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const text = `${l.make} ${l.model}`.toLowerCase();
      if (q && !text.includes(q.toLowerCase())) return false;
      if (makeFilter !== "الكل" && l.make !== makeFilter) return false;
      if (cityFilter !== "الكل" && l.city !== cityFilter) return false;
      if (bodyTypeFilter !== "الكل" && l.body_type !== bodyTypeFilter) return false;
      if (maxPrice && l.price > Number(maxPrice)) return false;
      return true;
    });
  }, [listings, q, makeFilter, cityFilter, bodyTypeFilter, maxPrice]);

  const clearFilters = () => { setMakeFilter("الكل"); setCityFilter("الكل"); setBodyTypeFilter("الكل"); setMaxPrice(""); setQ(""); };
  const filtersActive = makeFilter !== "الكل" || cityFilter !== "الكل" || bodyTypeFilter !== "الكل" || maxPrice || q;
  const modelOptions = MODELS[form.make];

  return (
    <div dir="rtl" className="cm-root cm-scroll">

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="cm-blob cm-blob-blue" style={{ top: "-10rem", right: "-10rem" }} />
        <div className="cm-blob cm-blob-violet" style={{ top: "33%", left: "-10rem" }} />
      </div>

      {/* Header */}
      <header className="cm-header">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3 relative">
          <button onClick={() => setView("home")} className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg cm-logo flex items-center justify-center">
              <Car size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="cm-display font-extrabold text-lg tracking-tight hidden sm:block">مِرْآب</span>
          </button>

          <nav className="flex items-center gap-2">
            <button
              onClick={() => setView("browse")}
              className={`text-sm font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5 cm-navbtn ${view === "browse" ? "cm-navbtn-active" : ""}`}
            >
              <Search size={15} /> <span className="hidden sm:inline">تصفح وابحث</span>
            </button>
            <button
              onClick={goAdd}
              className={`flex items-center gap-1.5 font-bold text-sm px-3.5 py-2 rounded-lg transition ${view === "add" ? "cm-btn-primary" : "cm-btn-ghost"}`}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">أضف سيارتك</span>
            </button>
            {session ? (
              <button onClick={handleLogout} title={session.user.email} className="cm-btn-ghost flex items-center gap-1.5 font-bold text-sm px-3 py-2 rounded-lg transition">
                <User size={15} className="cm-text-accent" />
                <span className="hidden md:inline text-xs cm-text-muted" style={{ maxWidth: "8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user.email}</span>
                <LogOut size={15} />
              </button>
            ) : (
              <button onClick={() => setAuthOpen(true)} className="cm-btn-ghost flex items-center gap-1.5 font-bold text-sm px-3 py-2 rounded-lg transition">
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

      {/* HOME */}
      {view === "home" && (
        <main className="max-w-6xl mx-auto px-4 py-10 sm:py-16 relative">
          <div className="relative overflow-hidden rounded-2xl cm-card p-6 sm:p-10 text-center mb-10">
            <Sparkles size={18} className="cm-text-accent mx-auto mb-3" />
            <h1 className="cm-display font-extrabold text-3xl sm:text-4xl">
              سوق السيارات <span className="cm-grad-text">في الإمارات</span>
            </h1>
            <p className="cm-text-muted mt-3 max-w-xl mx-auto text-sm sm:text-base">
              منصة تجمع البائعين والمشترين مباشرة، بدون وسيط. انشر سيارتك مجانًا، أو تصفح آلاف السيارات في دبي وأبوظبي وباقي الإمارات.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <button onClick={() => setView("browse")} className="text-right cm-card rounded-2xl p-6 transition group">
              <div className="w-12 h-12 rounded-xl cm-icon-tile-blue flex items-center justify-center mb-4">
                <Search size={22} className="cm-text-accent" />
              </div>
              <h2 className="cm-display font-bold text-lg mb-1.5 flex items-center gap-2">
                أنا مشتري
                <ChevronRight size={18} className="cm-text-muted group-hover:-translate-x-1 transition rotate-180" />
              </h2>
              <p className="text-sm cm-text-muted">ابحث بالماركة أو الموديل، وفلتر حسب الإمارة والسعر لتجد سيارتك.</p>
            </button>

            <button onClick={goAdd} className="text-right cm-card rounded-2xl p-6 transition group">
              <div className="w-12 h-12 rounded-xl cm-icon-tile-violet flex items-center justify-center mb-4">
                <Store size={22} className="cm-text-accent2" />
              </div>
              <h2 className="cm-display font-bold text-lg mb-1.5 flex items-center gap-2">
                أنا بائع
                <ChevronRight size={18} className="cm-text-muted group-hover:-translate-x-1 transition rotate-180" />
              </h2>
              <p className="text-sm cm-text-muted">أضف صور سيارتك وتفاصيلها وانشرها مباشرة خلال دقيقة.</p>
            </button>
          </div>

          {loaded && listings.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center justify-between mb-3">
                <p className="cm-display font-bold text-sm cm-text-muted">أحدث الإعلانات</p>
                <button onClick={() => setView("browse")} className="text-xs cm-text-accent font-bold">عرض الكل</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {listings.slice(0, 4).map((l) => (
                  <button key={l.id} onClick={() => { setActive(l); setView("browse"); }} className="text-right cm-card rounded-xl overflow-hidden transition">
                    <div className="cm-aspect-4-3 cm-media flex items-center justify-center">
                      {l.image ? <img src={l.image} className="w-full h-full object-cover" alt="" /> : <Car size={26} className="cm-icon-empty" />}
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-bold truncate">{l.make} {l.model}</p>
                      <p className="text-xs cm-text-accent font-bold cm-tabular mt-0.5">{formatNumber(l.price)} د.إ</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* BUYER / BROWSE PAGE */}
      {view === "browse" && (
        <main className="max-w-6xl mx-auto px-4 py-6 relative">
          <div className="relative overflow-hidden rounded-2xl cm-card p-5 sm:p-6 mb-6">
            <h1 className="cm-display font-extrabold text-xl sm:text-2xl mb-1">تصفح السيارات</h1>
            <p className="cm-text-muted text-sm mb-4">{filtered.length} سيارة متاحة الآن</p>

            <div className="relative mb-3">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 cm-text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث عن ماركة أو موديل، مثال: تويوتا كامري"
                className="cm-input"
                style={{ paddingRight: "2.25rem" }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select value={bodyTypeFilter} onChange={(e) => setBodyTypeFilter(e.target.value)} className="cm-input" style={{ width: "auto" }}>
                <option>الكل</option>
                {BODY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              <select value={makeFilter} onChange={(e) => setMakeFilter(e.target.value)} className="cm-input" style={{ width: "auto" }}>
                <option>الكل</option>
                {MAKES.map((m) => <option key={m}>{m}</option>)}
              </select>
              <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="cm-input" style={{ width: "auto" }}>
                <option>الكل</option>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))}
                placeholder="السعر الأقصى (د.إ)"
                className="cm-input cm-tabular"
                style={{ width: "9rem" }}
              />
              {filtersActive && (
                <button onClick={clearFilters} className="text-xs cm-link">مسح الفلاتر</button>
              )}
            </div>
          </div>

          {!loaded ? (
            <div className="flex items-center justify-center py-24 cm-text-muted">
              <Loader2 className="animate-spin ml-2" size={18} /> جارِ التحميل...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 rounded-2xl cm-card">
              <Car className="mx-auto mb-3 cm-icon-empty" size={40} />
              <p className="font-bold mb-1">لا توجد إعلانات مطابقة</p>
              <p className="text-sm cm-text-muted mb-4">جرّب تغيير الفلاتر، أو كن أول من ينشر سيارته هنا</p>
              <button onClick={goAdd} className="cm-btn-primary font-bold text-sm px-4 py-2 rounded-lg">
                أضف سيارتك الآن
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((l) => (
                <button key={l.id} onClick={() => setActive(l)} className="text-right cm-card rounded-xl overflow-hidden transition group">
                  <div className="cm-aspect-16-10 cm-media flex items-center justify-center overflow-hidden">
                    {l.image ? (
                      <img src={l.image} alt={l.model} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <Car size={44} className="cm-icon-empty" />
                    )}
                  </div>
                  <div className="p-3.5">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <p className="cm-display font-bold text-sm leading-tight">{l.make} {l.model}</p>
                        <p className="text-xs cm-text-muted mt-0.5">{l.year} · {formatNumber(l.mileage)} كم{l.body_type ? ` · ${l.body_type}` : ""}</p>
                      </div>
                      <Badge tone={l.condition === "جديدة" ? "mint" : "muted"}>{l.condition}</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <PricePlate price={l.price} />
                      <span className="text-xs cm-text-muted flex items-center gap-1"><MapPin size={11} />{l.city}</span>
                    </div>
                  </div>
                </button>
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
              <div onClick={() => fileRef.current?.click()} className="cm-aspect-16-9 rounded-xl cm-upload flex flex-col items-center justify-center cursor-pointer overflow-hidden transition">
                {form.image ? (
                  <img src={form.image} className="w-full h-full object-cover" alt="preview" />
                ) : (
                  <>
                    <ImagePlus size={28} className="cm-text-muted mb-2" />
                    <span className="text-sm cm-text-muted">اضغط لإضافة صورة السيارة</span>
                  </>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="الماركة">
                  <select value={form.make} onChange={(e) => onMakeChange(e.target.value)} className="cm-input">
                    {MAKES.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </Field>

                <Field label="الموديل">
                  {modelOptions ? (
                    <select value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="cm-input">
                      {modelOptions.map((m) => <option key={m}>{m}</option>)}
                      <option value={OTHER}>موديل آخر (اكتب يدويًا)</option>
                    </select>
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
                    onChange={(e) => { setForm({ ...form, phone: e.target.value.replace(/[^\d+]/g, "") }); setOtp({ sent: false, code: "", input: "", verifiedFor: "" }); }}
                    placeholder="05xxxxxxxx"
                    className="cm-input cm-tabular"
                  />
                </Field>
              </div>

              {/* Phone OTP verification (demo — see note below the button) */}
              <div className="cm-spec p-3">
                {phoneVerified ? (
                  <div className="flex items-center gap-2 cm-text-mint text-sm font-bold">
                    <CheckCircle2 size={16} /> تم تأكيد رقم الجوال
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold cm-text-muted flex items-center gap-1.5"><ShieldCheck size={14} /> تأكيد رقم الجوال برمز OTP</span>
                      <button type="button" onClick={sendOtp} className="text-xs font-bold cm-link">
                        {otp.sent ? "إعادة إرسال الرمز" : "إرسال رمز التحقق"}
                      </button>
                    </div>
                    {otp.sent && (
                      <div className="flex items-center gap-2">
                        <input
                          value={otp.input}
                          onChange={(e) => setOtp({ ...otp, input: e.target.value.replace(/\D/g, "") })}
                          placeholder="أدخل الرمز المكوّن من 4 أرقام"
                          className="cm-input cm-tabular"
                          style={{ flex: 1 }}
                        />
                        <button type="button" onClick={confirmOtp} className="cm-btn-primary text-xs font-bold px-3 py-2 rounded-lg shrink-0">تأكيد</button>
                      </div>
                    )}
                    <p className="text-xs cm-text-muted mt-2">
                      وضع تجريبي: الرمز يظهر هنا مباشرة لعدم وجود مزوّد رسائل SMS مربوط بعد. عند الإطلاق الفعلي يجب ربط خدمة مثل Twilio Verify أو Firebase Phone Auth لإرسال الرمز فعليًا.
                    </p>
                  </>
                )}
              </div>

              <Field label="اسم البائع (اختياري)">
                <input value={form.sellerName} onChange={(e) => setForm({ ...form, sellerName: e.target.value })} placeholder="اسمك" className="cm-input" />
              </Field>

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
        <div className="cm-modal-backdrop flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setActive(null)}>
          <div onClick={(e) => e.stopPropagation()} className="cm-card-solid rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg overflow-y-auto cm-scroll" style={{ maxHeight: "92vh" }}>
            <div className="cm-aspect-16-9 cm-media flex items-center justify-center relative">
              {active.image ? <img src={active.image} className="w-full h-full object-cover" alt="" /> : <Car size={56} className="cm-icon-empty" />}
              <button onClick={() => setActive(null)} className="absolute top-3 left-3 bg-black/50 hover:bg-black/70 rounded-full p-1.5 text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="cm-display font-extrabold text-xl">{active.make} {active.model}</h3>
                  <p className="text-xs cm-text-muted mt-1">{timeAgo(active.createdAt)} · {active.city}</p>
                </div>
                <Badge tone={active.condition === "جديدة" ? "mint" : "muted"}>{active.condition}</Badge>
              </div>

              <div className="my-4"><PricePlate price={active.price} size="lg" /></div>

              <div className="grid grid-cols-2 gap-2.5 text-sm mb-4">
                <Spec icon={<Calendar size={14} />} label="سنة الصنع" value={active.year} />
                <Spec icon={<Gauge size={14} />} label="الممشى" value={`${formatNumber(active.mileage)} كم`} />
                <Spec icon={<Fuel size={14} />} label="الوقود" value={active.fuel} />
                <Spec icon={<Settings2 size={14} />} label="ناقل الحركة" value={active.trans} />
              </div>

              {active.description && (
                <div className="mb-4">
                  <p className="text-xs font-bold cm-text-muted mb-1">الوصف</p>
                  <p className="text-sm leading-relaxed">{active.description}</p>
                </div>
              )}

              <div className="cm-divider flex items-center justify-between pt-4 gap-2">
                <div>
                  <p className="text-xs cm-text-muted">{active.seller_name || "البائع"}</p>
                  <p className="text-sm font-bold cm-tabular">{active.phone}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${active.phone}`} className="flex items-center gap-1.5 cm-btn-primary font-bold text-sm px-4 py-2 rounded-lg">
                    <Phone size={15} /> اتصال
                  </a>
                  {session && active.seller_id === session.user.id && (
                    <button onClick={() => deleteListing(active.id)} title="حذف الإعلان" className="flex items-center justify-center cm-danger-outline px-3 py-2 rounded-lg">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth modal */}
      {authOpen && (
        <div className="cm-modal-backdrop flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setAuthOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="cm-card-solid rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="cm-display font-extrabold text-lg">{authMode === "signup" ? "إنشاء حساب" : "تسجيل الدخول"}</h3>
              <button onClick={() => setAuthOpen(false)} className="cm-icon-empty"><X size={20} /></button>
            </div>

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

            <p className="text-xs cm-text-muted text-center mt-4">
              {authMode === "signup" ? "عندك حساب؟" : "ما عندك حساب؟"}{" "}
              <button onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")} className="cm-link font-bold">
                {authMode === "signup" ? "سجّل الدخول" : "أنشئ حساب جديد"}
              </button>
            </p>
          </div>
        </div>
      )}
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
        <p className="text-xs font-bold cm-tabular">{value}</p>
      </div>
    </div>
  );
}
