// Builds car reels on GitHub Actions (no owner Chrome needed).
// Picks live listings that will be posted soon and have no reel yet, opens the
// live reel maker (carsuae.net/tools/reel.html?noupload=1) in headless Chrome,
// takes the MP4, adds the music with ffmpeg when Chrome could not encode audio,
// and stores it through the Supabase function reel-upload (GitHub OIDC auth).
// Run by .github/workflows/reels.yml. Env: MAX (default 12), IDS (optional,
// comma-separated listing ids to force).
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const SB = 'https://bfdyxoycbwlibzcovxef.supabase.co';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmZHl4b3ljYndsaWJ6Y292eGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NTM1NTIsImV4cCI6MjEwMzQyOTU1Mn0.dJu21JyKSehKRjoO4qcf5UNR-0EOypQiBNP-2rH10Ao';
const FN = `${SB}/functions/v1/reel-upload`;
const SITE = process.env.SITE || 'https://carsuae.net';
const MAX = Number(process.env.MAX || 12);
const MUSIC = 'public/media/reel/music.m4a';

async function oidc() {
  const u = process.env.ACTIONS_ID_TOKEN_REQUEST_URL, t = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  if (!u || !t) throw new Error('no OIDC (needs permissions: id-token: write)');
  const r = await fetch(`${u}&audience=carsuae-reels`, { headers: { Authorization: `Bearer ${t}` } });
  return (await r.json()).value;
}
async function fn(body) {
  const r = await fetch(FN, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-gh-oidc': await oidc() }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`reel-upload ${body.action} ${r.status} ${JSON.stringify(j).slice(0, 200)}`);
  return j;
}

async function pick() {
  if (process.env.IDS) return process.env.IDS.split(',').map(s => s.trim()).filter(Boolean);
  const since = new Date(Date.now() - 10 * 864e5).toISOString(), now = new Date().toISOString();
  const q = `select=id,images,make,model&reel_url=is.null&social_posted_at=is.null&created_at=gte.${since}&expires_at=gt.${now}&or=(sold.is.null,sold.eq.false)&duplicate=not.is.true&order=created_at.desc&limit=200`;
  const r = await fetch(`${SB}/rest/v1/listings?${q}`, { headers: { apikey: ANON, Authorization: 'Bearer ' + ANON } });
  if (!r.ok) throw new Error('listings query ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const rows = (await r.json()).filter(x => (x.images || []).length >= 3);
  return rows.slice(0, MAX).map(x => x.id);
}

const hasAudio = f => execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', f]).toString().trim() !== '';

const ids = await pick();
console.log('listings to do:', ids.length);
const done = [], failed = [];
if (ids.length) {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  page.setDefaultTimeout(120000);
  for (const id of ids) {
    try {
      await page.goto(`${SITE}/tools/reel.html?id=${id}&noupload=1`, { waitUntil: 'load' });
      await page.waitForFunction(() => window.__reel && ['ready', 'error'].includes(window.__reel.state));
      if (await page.evaluate(() => window.__reel.state) === 'error') throw new Error(await page.evaluate(() => window.__reel.error));
      await page.evaluate(() => window.makeReel());
      await page.waitForFunction(() => ['done', 'error'].includes(window.__reel.state), null, { timeout: 300000 });
      const st = await page.evaluate(() => window.__reel);
      if (st.state !== 'done') throw new Error('encode: ' + st.error);
      const b64 = await page.evaluate(async () => {
        const u8 = new Uint8Array(await window.__reelBlob.arrayBuffer()); let s = '';
        for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
        return btoa(s);
      });
      writeFileSync('raw.mp4', Buffer.from(b64, 'base64'));
      let file = 'raw.mp4';
      if (!hasAudio(file) && existsSync(MUSIC)) {
        execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'raw.mp4', '-i', MUSIC, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', 'final.mp4']);
        file = 'final.mp4';
      }
      const s = await fn({ action: 'sign', id });
      const up = await fetch(s.signedUrl, { method: 'PUT', headers: { 'Content-Type': 'video/mp4' }, body: readFileSync(file) });
      if (!up.ok) throw new Error('upload ' + up.status + ' ' + (await up.text()).slice(0, 200));
      const d = await fn({ action: 'done', id, path: s.path });
      done.push(id); console.log('ok', id, st.codec, d.url);
    } catch (e) {
      failed.push(`${id}: ${String(e.message || e).slice(0, 160)}`); console.log('FAIL', id, e);
    }
  }
  await browser.close();
}
const note = `made ${done.length}/${ids.length}` + (failed.length ? `; failed: ${failed.join(' | ')}` : '');
await fn({ action: 'log', task: 'reels', ok: failed.length === 0, note }).catch(e => console.log('log failed', e));
console.log(note);
if (ids.length && !done.length) process.exit(1);
