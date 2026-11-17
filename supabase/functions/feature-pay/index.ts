// feature-pay: paid featuring (تمييز الإعلان) through Ziina (https://docs.ziina.com).
//   POST {action:"create", listing_id, plan, lang?} -> {redirect_url}  (Ziina's hosted payment page)
//   POST {action:"confirm", id}                     -> {status, featured_until}  (called when the buyer returns)
//   POST {event:"payment_intent.status.updated", data:{id}}  Ziina webhook
// A payment is never trusted from the caller: the intent is always re-read
// from Ziina with our own token, and apply_feature_payment() features the
// listing once only.
// Secrets: ZIINA_API_KEY (token from ziina.com/business/connect),
//   ZIINA_LIVE = "true" for real money (anything else = Ziina test mode, and
//   then only site admins can start a payment), ZIINA_WEBHOOK_SECRET (optional HMAC).
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ZIINA = "https://api-v2.ziina.com/api";
const SITE = "https://carsuae.net";
// Prices in fils (AED x 100). Keep in sync with FEATURE_PLANS in src/App.jsx.
const PLANS: Record<string, { days: number; amount: number }> = {
  "14d": { days: 14, amount: 2000 },
  "30d": { days: 30, amount: 3000 },
};
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const live = () => Deno.env.get("ZIINA_LIVE") === "true";

async function ziina(path: string, body?: unknown) {
  const key = Deno.env.get("ZIINA_API_KEY");
  if (!key) throw new Error("not_configured");
  const r = await fetch(ZIINA + path, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`ziina ${r.status}: ${String(j?.message ?? j?.error ?? "").slice(0, 200)}`);
  return j;
}

async function isAdmin(req: Request) {
  const tok = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!tok) return false;
  const { data } = await sb.auth.getUser(tok);
  if (!data?.user) return false;
  const { data: row } = await sb.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  return Boolean(row);
}

// Reads the intent from Ziina and, when it is paid, features the listing.
async function settle(ziinaId: string) {
  const { data: row } = await sb.from("feature_payments").select("id, listing_id, amount_fils, applied, status").eq("ziina_id", ziinaId).maybeSingle();
  if (!row) return { status: "unknown" };
  const pi = await ziina(`/payment_intent/${encodeURIComponent(ziinaId)}`);
  const status = String(pi.status || "");
  if (status === "completed" && Number(pi.amount) === row.amount_fils && String(pi.currency_code) === "AED") {
    const { data: until, error } = await sb.rpc("apply_feature_payment", { p_ziina_id: ziinaId });
    if (error) throw new Error(error.message);
    return { status: "completed", featured_until: until, listing_id: row.listing_id };
  }
  if (!row.applied && status && status !== row.status) await sb.from("feature_payments").update({ status }).eq("id", row.id);
  return { status, listing_id: row.listing_id };
}

async function hmacOk(raw: string, sig: string | null) {
  const secret = Deno.env.get("ZIINA_WEBHOOK_SECRET");
  if (!secret) return true;
  if (!sig) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw)));
  const hex = Array.from(mac).map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex === sig.trim().toLowerCase();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const raw = await req.text();
  let body: Record<string, any> = {};
  try { body = JSON.parse(raw || "{}"); } catch { return json({ error: "bad json" }, 400); }

  try {
    // Ziina webhook
    if (body.event) {
      if (!(await hmacOk(raw, req.headers.get("x-hmac-signature")))) return json({ error: "bad signature" }, 401);
      const id = String(body.data?.id || "");
      if (body.event === "payment_intent.status.updated" && ID.test(id)) await settle(id);
      return json({ ok: true });
    }

    if (body.action === "confirm") {
      const id = String(body.id || "");
      if (!ID.test(id)) return json({ error: "bad id" }, 400);
      return json(await settle(id));
    }

    if (body.action === "create") {
      const listingId = String(body.listing_id || "");
      const plan = PLANS[String(body.plan || "")];
      if (!ID.test(listingId) || !plan) return json({ error: "bad request" }, 400);
      if (!Deno.env.get("ZIINA_API_KEY")) return json({ error: "not_configured" }, 503);
      const test = !live();
      if (test && !(await isAdmin(req))) return json({ error: "not_open" }, 403);

      const { data: l } = await sb.from("listings").select("id, make, model, year, sold, duplicate, expires_at").eq("id", listingId).maybeSingle();
      if (!l || l.sold || l.duplicate || (l.expires_at && new Date(l.expires_at) <= new Date())) return json({ error: "listing_not_live" }, 404);

      // Light protection against someone hammering the endpoint.
      const { count } = await sb.from("feature_payments").select("id", { count: "exact", head: true })
        .eq("listing_id", listingId).gt("created_at", new Date(Date.now() - 3600e3).toISOString());
      if ((count || 0) >= 10) return json({ error: "too_many" }, 429);

      const en = body.lang === "en";
      const carUrl = `${SITE}${en ? "/en" : ""}/car/${listingId}`;
      const name = [l.make, l.model, l.year].filter(Boolean).join(" ");
      const pi = await ziina("/payment_intent", {
        amount: plan.amount,
        currency_code: "AED",
        message: `CarsUAE – تمييز إعلان ${name} لمدة ${plan.days} يوم`.slice(0, 140),
        success_url: `${carUrl}?paid={PAYMENT_INTENT_ID}`,
        cancel_url: `${carUrl}?pay=cancel`,
        failure_url: `${carUrl}?pay=failed`,
        test,
      });
      if (!pi?.id || !pi?.redirect_url) throw new Error("ziina: no redirect_url");
      const { error } = await sb.from("feature_payments").insert({
        listing_id: listingId, plan: String(body.plan), days: plan.days, amount_fils: plan.amount, ziina_id: pi.id, status: String(pi.status || "created"), test,
      });
      if (error) throw new Error(error.message);
      return json({ redirect_url: pi.redirect_url, test });
    }

    return json({ error: "unknown action" }, 400);
  } catch (e) {
    const msg = String((e as Error).message || e);
    console.error("feature-pay", msg);
    return json({ error: msg === "not_configured" ? msg : "payment_error", detail: msg.slice(0, 200) }, msg === "not_configured" ? 503 : 502);
  }
});
