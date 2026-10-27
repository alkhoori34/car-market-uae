// Price comparison for one car against similar live cars on the site
// (same make and model, model year within ±2). Shared by the React car view
// and the server-rendered car page (api/page.js), so both say the same thing.
// Gives Google unique text on each car page and helps buyers judge the price.

const YEAR_SPAN = 2;
const MIN_PEERS = 3;
const FAIR_BAND = 7; // within ±7% of the usual price counts as "fair"

function median(nums) {
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// rows: other listings (already live). Returns null when there are too few.
export function priceCompare(car, rows) {
  const price = Number(car && car.price);
  if (!price || !car.make || !car.model) return null;
  const year = Number(car.year) || 0;
  let peers = (rows || []).filter((r) =>
    r && r.id !== car.id && r.make === car.make && r.model === car.model &&
    Number(r.price) > 0 &&
    (!year || !Number(r.year) || Math.abs(Number(r.year) - year) <= YEAR_SPAN));
  // The same car posted twice (same phone, year, price) counts once.
  const seen = new Set();
  peers = peers.filter((r) => {
    const k = `${String(r.phone || r.id).slice(-9)}|${r.year}|${r.price}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  if (peers.length < MIN_PEERS) return null;
  // Drop obvious typos (e.g. 1,500 instead of 150,000) before taking the median.
  const first = median(peers.map((r) => Number(r.price)));
  const prices = peers.map((r) => Number(r.price)).filter((p) => p >= first / 3 && p <= first * 3);
  if (prices.length < MIN_PEERS) return null;
  const usual = Math.round(median(prices) / 500) * 500;
  if (!usual) return null;
  const diff = Math.round(((price - usual) / usual) * 100);
  const level = diff <= -FAIR_BAND ? "below" : diff >= FAIR_BAND ? "above" : "fair";
  const years = year ? [year - YEAR_SPAN, year + YEAR_SPAN] : null;
  return { n: prices.length, usual, diff, level, years };
}

const fmtAr = (n) => new Intl.NumberFormat("ar-AE").format(n);
const fmtEn = (n) => new Intl.NumberFormat("en-US").format(n);

// Plain-text lines for display: { title, verdict, basis }.
export function priceCompareText(car, c, en = false) {
  if (!c) return null;
  const name = `${car.make} ${car.model}`;
  const pct = Math.abs(c.diff);
  if (en) {
    return {
      title: "Price comparison",
      verdict: c.level === "below" ? `${pct}% below the usual price of similar cars`
        : c.level === "above" ? `${pct}% above the usual price of similar cars`
        : "Close to the usual price of similar cars",
      basis: `Usual price: AED ${fmtEn(c.usual)}, based on ${c.n} similar cars on CarsUAE${c.years ? ` (${c.years[0]}–${c.years[1]} models)` : ""}.`,
    };
  }
  return {
    title: "مقارنة السعر",
    verdict: c.level === "below" ? `أرخص من السعر المعتاد بـ ${pct}٪`
      : c.level === "above" ? `أغلى من السعر المعتاد بـ ${pct}٪`
      : "سعرها قريب من السعر المعتاد",
    basis: `السعر المعتاد لسيارات ${name} المشابهة${c.years ? ` (موديل ${c.years[0]}–${c.years[1]})` : ""} في CarsUAE: ${fmtAr(c.usual)} درهم، حسب ${fmtAr(c.n)} سيارات.`,
  };
}
