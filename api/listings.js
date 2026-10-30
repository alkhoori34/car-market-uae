// GET /api/listings — the list of live cars for the browser app, cached at the
// edge (worker/index.js `cached`, stale-while-revalidate). Since 2026-10-30 the
// app loads this instead of selecting every column of every listing straight
// from Supabase on each visit and every minute (2+ MB, ~1 s from the UAE).
// Left out to keep it small: description and phone (the car view fetches the
// full row when a car is opened) — a signed-in seller's own rows are loaded
// in full separately (loadMine in App.jsx).
import { queryListings } from "./_lib.js";

export const LIST_FIELDS =
  "id,make,model,body_type,year,price,previous_price,negotiable,mileage,city,fuel,trans,condition,specs,steering,seller_name,seller_id,image,images,created_at,sold,sold_at,expires_at,dealer_id,featured_until,views,reports_count,duplicate";

export default async function handler(req, res) {
  try {
    // Supabase returns at most 1,000 rows per request: page through.
    const rows = [];
    for (let offset = 0; offset < 20000; offset += 1000) {
      const { rows: page } = await queryListings([
        ["select", LIST_FIELDS],
        ["duplicate", "not.is.true"],
        ["order", "created_at.desc,id.desc"],
        ["limit", "1000"],
        ["offset", String(offset)],
      ]);
      rows.push(...page);
      if (page.length < 1000) break;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=86400");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(JSON.stringify(rows));
  } catch (e) {
    res.statusCode = 502;
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: String(e.message || e) }));
  }
}
