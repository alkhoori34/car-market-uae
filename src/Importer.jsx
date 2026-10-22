import React, { useEffect, useMemo, useRef, useState } from "react";
import { Download, Loader2, CheckCircle2, AlertTriangle, ExternalLink, X } from "lucide-react";
import { parseCaption, excludeReason, cleanDescription, BOOKMARKLET_SOURCE } from "./importer-parse.js";

// Admin tool: brings a broker's recent Instagram ads into CarsUAE.
// 1. The admin clicks the "CarsUAE استيراد" bookmark on the broker's Instagram page.
// 2. The bookmark collects the posts and opens carsuae.net/#import=<posts>, which shows this screen.
// 3. The admin checks every row (make, model, price ...) and presses "انشر".
// Photos are copied from Instagram into Storage, listings are linked to the dealer.

const MAX_IMAGES = 8;
const KEY = (r) => `${r.phone}|${r.make}|${r.year}|${r.model}`;

export default function Importer({ supabase, session, makes, cities, specsList, bodies, onPublished, onClose }) {
  const [payload, setPayload] = useState(null);
  const [rows, setRows] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [dealerId, setDealerId] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [done, setDone] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const linkRef = useRef(null);

  // The bookmark link is set by hand: React refuses javascript: URLs in href.
  useEffect(() => {
    if (linkRef.current) linkRef.current.setAttribute("href", "javascript:" + encodeURIComponent(BOOKMARKLET_SOURCE.replace(/\n/g, "")));
  }, []);

  // The bookmark arrives as carsuae.net/#import=<posts json>.
  useEffect(() => {
    const h = window.location.hash;
    if (!h.startsWith("#import=")) return;
    try { setPayload(JSON.parse(decodeURIComponent(h.slice(8)))); } catch { alert("تعذر قراءة الإعلانات، جرّب الزر مرة ثانية"); }
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  useEffect(() => {
    supabase.from("dealers").select("*").order("name").then(({ data }) => setDealers(data || []));
  }, [supabase]);

  // Turn the posts into editable rows, then flag cars already on the site.
  useEffect(() => {
    if (!payload) return;
    const match = dealers.find((d) => (d.instagram || "").toLowerCase() === payload.user.toLowerCase());
    if (match) setDealerId(match.id);
    const seen = new Set();
    const built = payload.posts
      .sort((a, b) => b.t - a.t)
      .map((p) => {
        const f = parseCaption(p.caption);
        const reason = excludeReason(p.caption, p.images.length);
        const capKey = p.caption.replace(/\s+/g, " ").slice(0, 60);
        let dup = "";
        if (seen.has(capKey)) dup = "مكرر في الحساب";
        seen.add(capKey);
        return { ...f, code: p.code, t: p.t, caption: p.caption, images: p.images.slice(0, MAX_IMAGES), reason, dup, include: !reason && !dup };
      });
    setRows(built);
    const phones = [...new Set(built.map((r) => r.phone).filter(Boolean))];
    if (!phones.length) return;
    supabase.from("listings").select("phone,make,model,year").in("phone", phones).then(({ data }) => {
      const existing = new Set((data || []).map(KEY));
      setRows((rs) => rs.map((r) => (existing.has(KEY(r)) ? { ...r, dup: "موجودة في الموقع", include: false } : r)));
    });
  }, [payload, dealers.length]);

  const dealer = dealers.find((d) => d.id === dealerId);
  const set = (i, patch) => setRows((rs) => rs.map((r, k) => (k === i ? { ...r, ...patch } : r)));
  const chosen = rows.filter((r) => r.include);
  const problems = (r) => [
    !r.make && "الماركة", !r.model && "الموديل", !r.year && "السنة", !r.phone && "الرقم",
  ].filter(Boolean);
  const blocked = chosen.filter((r) => problems(r).length);

  const addDealer = async () => {
    const u = payload.user;
    const { data, error } = await supabase.from("dealers")
      .insert({ slug: u.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), name: u, instagram: u, verified: true })
      .select().single();
    if (error) { alert("تعذر إضافة الوسيط: " + error.message); return; }
    setDealers((ds) => [...ds, data]);
    setDealerId(data.id);
  };

  const publish = async () => {
    if (!dealer) { alert("اختر الوسيط أولاً"); return; }
    if (blocked.length) { alert("فيه إعلانات ناقصة (معلّمة بالأحمر). عدّلها أو شيل علامة النشر عنها."); return; }
    setBusy(true);
    const uid = session.user.id;
    const label = `${dealer.name}${dealer.instagram ? ` @${dealer.instagram}` : ""}`;
    const out = [];
    for (let k = 0; k < chosen.length; k++) {
      const r = chosen[k];
      setProgress(`${k + 1} من ${chosen.length}: ${r.make} ${r.model} ${r.year}`);
      try {
        const urls = [];
        for (let n = 0; n < r.images.length; n++) {
          const path = `${uid}/ig-${r.code}-${n + 1}.jpg`;
          const blob = await fetch(r.images[n]).then((x) => { if (!x.ok) throw new Error("صورة " + x.status); return x.blob(); });
          const { error } = await supabase.storage.from("car-images").upload(path, blob, { contentType: "image/jpeg" });
          if (error && !/exists|Duplicate/i.test(error.message)) throw error;
          urls.push(supabase.storage.from("car-images").getPublicUrl(path).data.publicUrl);
        }
        const { data, error } = await supabase.from("listings").insert({
          make: r.make, model: r.model, body_type: r.body || null, year: Number(r.year),
          price: r.price ? Number(r.price) : null, negotiable: !!r.negotiable, mileage: r.km === "" || r.km === null ? null : Number(r.km),
          fuel: r.fuel, trans: r.trans, condition: r.condition, specs: r.specs || null, steering: "يسار", city: r.city || null,
          description: cleanDescription(r.caption, label), seller_name: dealer.name, phone: r.phone,
          seller_id: uid, image: urls[0], images: urls, dealer_id: dealer.id,
        }).select("id").single();
        if (error) throw error;
        out.push({ ok: true, id: data.id, title: `${r.make} ${r.model} ${r.year}` });
      } catch (e) {
        out.push({ ok: false, title: `${r.make} ${r.model} ${r.year}`, err: e.message || String(e) });
      }
      setDone([...out]);
    }
    setBusy(false);
    setProgress("");
    onPublished?.();
  };

  const visible = showAll ? rows : rows.filter((r) => !r.reason && !r.dup);
  const hidden = rows.length - rows.filter((r) => !r.reason && !r.dup).length;

  return (
    <section className="cm-card-solid rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="cm-section-title flex items-center gap-2"><Download size={18} /> استيراد إعلانات وسيط من إنستغرام</h2>
        {onClose && <button onClick={onClose} className="cm-btn-ghost p-1.5 rounded-lg" aria-label="إغلاق"><X size={16} /></button>}
      </div>

      {!payload && (
        <div className="text-sm leading-relaxed">
          <p className="mb-2"><b>مرة وحدة فقط:</b> اسحب هذا الزر إلى شريط الإشارات المرجعية (Bookmarks) في كروم:</p>
          <a ref={linkRef} onClick={(e) => e.preventDefault()} className="cm-btn-primary inline-flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-lg mb-3" draggable="true">CarsUAE استيراد</a>
          <p className="mb-1"><b>كل مرة:</b></p>
          <ol className="list-decimal pr-5 space-y-1 cm-text-muted">
            <li>افتح صفحة حساب الوسيط في إنستغرام (وأنت مسجّل دخول).</li>
            <li>اضغط زر «CarsUAE استيراد» من شريط الإشارات، واكتب عدد الأيام.</li>
            <li>انتظر لين يجمع الإعلانات، بتنفتح هذي الصفحة لحالها فيها كل السيارات.</li>
            <li>راجع الماركة والموديل والسعر، وشيل علامة ✓ عن أي إعلان ما تبيه، واضغط «انشر».</li>
          </ol>
        </div>
      )}

      {payload && (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-3 text-sm">
            <span>الحساب: <b dir="ltr">@{payload.user}</b> · آخر {payload.days} أيام · {rows.length} بوست</span>
            <select value={dealerId} onChange={(e) => setDealerId(e.target.value)} className="cm-input" style={{ width: "auto" }}>
              <option value="">اختر الوسيط…</option>
              {dealers.map((d) => <option key={d.id} value={d.id}>{d.name}{d.instagram ? ` (@${d.instagram})` : ""}</option>)}
            </select>
            {!dealerId && <button onClick={addDealer} className="cm-btn-ghost text-xs font-bold px-3 py-1.5 rounded-lg">+ إضافة @{payload.user} كوسيط</button>}
          </div>

          <p className="text-xs cm-text-muted mb-2">
            مختار للنشر: <b>{chosen.length}</b>
            {blocked.length > 0 && <span className="cm-text-red"> · {blocked.length} ناقصة</span>}
            {hidden > 0 && <> · مستبعد تلقائياً: {hidden} <button className="cm-link font-bold" onClick={() => setShowAll(!showAll)}>{showAll ? "إخفاء" : "عرض"}</button></>}
          </p>

          <div className="space-y-2 mb-3">
            {visible.map((r) => {
              const i = rows.indexOf(r);
              const miss = problems(r);
              return (
                <div key={r.code} className={`rounded-lg p-2.5 cm-soft ${r.include && miss.length ? "cm-border-red" : ""}`}>
                  <div className="flex gap-1 overflow-x-auto mb-2">
                    {r.images.slice(0, 5).map((u, n) => <img key={n} src={u} alt="" className="rounded" style={{ width: 96, height: 72, objectFit: "cover", flex: "none" }} referrerPolicy="no-referrer" loading="lazy" />)}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs mb-2">
                    <label className="flex items-center gap-1 font-bold"><input type="checkbox" checked={r.include} onChange={(e) => set(i, { include: e.target.checked })} /> انشر</label>
                    {r.reason && <span className="cm-badge cm-badge-muted">{r.reason}</span>}
                    {r.dup && <span className="cm-badge cm-badge-muted">{r.dup}</span>}
                    {r.priceCheck && !r.reason && <span className="cm-badge cm-badge-red"><AlertTriangle size={11} /> تأكد من السعر</span>}
                    {r.include && miss.length > 0 && <span className="cm-badge cm-badge-red">ناقص: {miss.join("، ")}</span>}
                    <a href={`https://www.instagram.com/p/${r.code}/`} target="_blank" rel="noopener noreferrer" className="cm-link flex items-center gap-0.5">البوست <ExternalLink size={11} /></a>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 mb-1.5">
                    <select value={r.make} onChange={(e) => set(i, { make: e.target.value })} className="cm-input text-xs"><option value="">الماركة</option>{makes.map((m) => <option key={m}>{m}</option>)}</select>
                    <input value={r.model} onChange={(e) => set(i, { model: e.target.value })} placeholder="الموديل" className="cm-input text-xs" />
                    <input value={r.year || ""} onChange={(e) => set(i, { year: e.target.value })} placeholder="السنة" className="cm-input text-xs" inputMode="numeric" />
                    <input value={r.price ?? ""} onChange={(e) => set(i, { price: e.target.value.replace(/[^\d]/g, ""), priceCheck: false })} placeholder="السعر (فاضي = عند التواصل)" className="cm-input text-xs" inputMode="numeric" />
                    <input value={r.km ?? ""} onChange={(e) => set(i, { km: e.target.value.replace(/[^\d]/g, "") })} placeholder="الممشى كم" className="cm-input text-xs" inputMode="numeric" />
                    <input value={r.phone} onChange={(e) => set(i, { phone: e.target.value })} placeholder="رقم صاحب السيارة" className="cm-input text-xs" dir="ltr" />
                    <select value={r.specs} onChange={(e) => set(i, { specs: e.target.value })} className="cm-input text-xs"><option value="">المواصفات</option>{specsList.map((m) => <option key={m}>{m}</option>)}</select>
                    <select value={r.city} onChange={(e) => set(i, { city: e.target.value })} className="cm-input text-xs"><option value="">الإمارة</option>{cities.map((m) => <option key={m}>{m}</option>)}</select>
                    <select value={r.body} onChange={(e) => set(i, { body: e.target.value })} className="cm-input text-xs"><option value="">نوع الهيكل</option>{bodies.map((m) => <option key={m}>{m}</option>)}</select>
                    <select value={r.condition} onChange={(e) => set(i, { condition: e.target.value })} className="cm-input text-xs"><option>مستعملة</option><option>جديدة</option></select>
                    <select value={r.fuel} onChange={(e) => set(i, { fuel: e.target.value })} className="cm-input text-xs">{["بنزين", "ديزل", "هجين", "كهربائي"].map((m) => <option key={m}>{m}</option>)}</select>
                    <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!!r.negotiable} onChange={(e) => set(i, { negotiable: e.target.checked })} /> قابل للتفاوض</label>
                  </div>
                  <details className="text-xs cm-text-muted"><summary className="cursor-pointer">نص الإعلان الأصلي</summary><p className="whitespace-pre-line mt-1">{r.caption}</p></details>
                </div>
              );
            })}
          </div>

          {done.length > 0 && (
            <div className="text-sm mb-3 space-y-0.5">
              <p className="font-bold">تم نشر {done.filter((d) => d.ok).length} من {done.length}</p>
              {done.filter((d) => !d.ok).map((d, k) => <p key={k} className="cm-text-red">✗ {d.title}: {d.err}</p>)}
            </div>
          )}

          <button onClick={publish} disabled={busy || !chosen.length} className="cm-btn-primary w-full text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">
            {busy ? <><Loader2 size={16} className="animate-spin" /> {progress}</> : <><CheckCircle2 size={16} /> انشر {chosen.length} إعلان في الموقع</>}
          </button>
        </>
      )}
    </section>
  );
}
