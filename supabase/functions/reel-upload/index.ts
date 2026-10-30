// reel-upload: lets the GitHub Actions reel builder (.github/workflows/reels.yml)
// store finished reels without any secret in the public repo.
// The workflow sends its GitHub OIDC token; we check it really comes from
// alkhoori34/car-market-uae on main, then use the service role to
//   action "sign": return a signed upload URL for reels/system/<file>
//   action "done": save the public URL on the listing (listings.reel_url)
//   action "log":  write a row to ops_runs (health log)
import { createRemoteJWKSet, jwtVerify } from "npm:jose@5";
import { createClient } from "npm:@supabase/supabase-js@2";

const JWKS = createRemoteJWKSet(new URL("https://token.actions.githubusercontent.com/.well-known/jwks"));
const REPO = "alkhoori34/car-market-uae";
const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const ID = /^[0-9a-f-]{36}$/;
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  try {
    const tok = (req.headers.get("x-gh-oidc") || "").trim();
    const { payload } = await jwtVerify(tok, JWKS, { issuer: "https://token.actions.githubusercontent.com", audience: "carsuae-reels" });
    if (payload.repository !== REPO || payload.ref !== "refs/heads/main") return json({ error: "wrong repo/ref" }, 403);
  } catch (e) {
    return json({ error: "bad token: " + String(e) }, 401);
  }
  const body = await req.json().catch(() => ({}));
  if (body.action === "log") {
    await sb.from("ops_runs").insert({ task: String(body.task || "reels").slice(0, 60), ok: !!body.ok, note: String(body.note || "").slice(0, 3000) });
    return json({ ok: true });
  }
  const id = String(body.id || "");
  if (!ID.test(id)) return json({ error: "bad id" }, 400);
  if (body.action === "sign") {
    const path = `system/reel-${id}-${Date.now().toString(36)}.mp4`;
    const { data, error } = await sb.storage.from("reels").createSignedUploadUrl(path);
    if (error) return json({ error: error.message }, 500);
    return json({ path, token: data.token, signedUrl: data.signedUrl });
  }
  if (body.action === "done") {
    const path = String(body.path || "");
    if (!path.startsWith(`system/reel-${id}-`)) return json({ error: "bad path" }, 400);
    const url = `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/reels/${path}`;
    const { error } = await sb.from("listings").update({ reel_url: url, reel_made_at: new Date().toISOString() }).eq("id", id);
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true, url });
  }
  return json({ error: "unknown action" }, 400);
});
