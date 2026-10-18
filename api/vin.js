// GET /api/vin?vin=<17 characters>  →  JSON report for the "فحص رقم الشاصي" page.
// Factory specs come from the free NHTSA vPIC database (no key needed) and
// recalls from NHTSA's recalls API. NHTSA only knows vehicles built for the
// North American market, so for other cars the report falls back to what the
// VIN itself says (country, maker, model year — see src/vin.js).

import { cleanVin, isVinFormat, checkDigitOk, vinCountry, vinMaker, vinModelYear, isNorthAmericaBuilt, vinAr } from "../src/vin.js";

const UA = { "User-Agent": "CarsUAE VIN check (carsuae.net)" };

async function getJson(url, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { headers: UA, signal: ctrl.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

const clean = (v) => {
  const s = String(v ?? "").trim();
  return !s || s === "Not Applicable" || s === "0" ? "" : s;
};

function reply(res, status, body, cacheSeconds = 0) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", cacheSeconds ? `public, s-maxage=${cacheSeconds}, stale-while-revalidate=86400` : "no-store");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  const vin = cleanVin(req.query && req.query.vin);
  if (!isVinFormat(vin)) {
    return reply(res, 400, { ok: false, error: "رقم الشاصي يتكون من 17 حرفًا ورقمًا (بدون الأحرف I و O و Q)." });
  }

  const local = {
    vin,
    country: vinCountry(vin),
    maker: vinMaker(vin),
    year: vinModelYear(vin),
    northAmerica: isNorthAmericaBuilt(vin),
    checkDigitOk: checkDigitOk(vin),
  };

  let specs = null;
  let nhtsaOk = true;
  try {
    const data = await getJson(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`);
    const r = (data && data.Results && data.Results[0]) || {};
    const model = clean(r.Model);
    if (model) {
      const disp = clean(r.DisplacementL);
      specs = {
        make: clean(r.Make),
        model,
        year: Number(clean(r.ModelYear)) || null,
        trim: [clean(r.Series), clean(r.Trim)].filter(Boolean).join(" "),
        body: vinAr(clean(r.BodyClass)),
        engine: [
          disp ? `${Number(disp).toFixed(1)} لتر` : "",
          clean(r.EngineCylinders) ? `${clean(r.EngineCylinders)} سلندر` : "",
          clean(r.EngineHP) ? `${Math.round(Number(clean(r.EngineHP)))} حصان` : "",
        ].filter(Boolean).join(" · "),
        fuel: vinAr(clean(r.FuelTypePrimary)),
        trans: [vinAr(clean(r.TransmissionStyle)), clean(r.TransmissionSpeeds) ? `${clean(r.TransmissionSpeeds)} سرعات` : ""].filter(Boolean).join(" · "),
        drive: vinAr(clean(r.DriveType)),
        doors: clean(r.Doors),
        seats: clean(r.Seats),
        plant: [clean(r.PlantCity), clean(r.PlantCountry)].filter(Boolean).join("، "),
        manufacturer: clean(r.Manufacturer),
      };
    }
  } catch (err) {
    console.error("vpic", vin, err.message);
    nhtsaOk = false;
  }

  // Recalls only make sense for a decoded North American-market vehicle.
  let recalls = null;
  if (specs && specs.make && specs.model && specs.year) {
    try {
      const q = new URLSearchParams({ make: specs.make, model: specs.model, modelYear: String(specs.year) });
      const data = await getJson(`https://api.nhtsa.gov/recalls/recallsByVehicle?${q}`);
      const list = (data && (data.results || data.Results)) || [];
      recalls = list.slice(0, 20).map((x) => ({
        id: x.NHTSACampaignNumber || "",
        component: x.Component || "",
        date: x.ReportReceivedDate || "",
      }));
    } catch (err) {
      console.error("recalls", vin, err.message);
    }
  }

  // A full decode in the US database means the VIN pattern was filed for the
  // North American market: a strong hint (not proof) of US/Canada specs.
  const usMarketHint = Boolean(specs);

  return reply(res, 200, { ok: true, ...local, specs, recalls, usMarketHint, nhtsaOk }, nhtsaOk ? 86400 : 0);
}
