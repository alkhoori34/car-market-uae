# carsuae.net — project notes for Claude

Arabic (RTL) used-car marketplace for the UAE, dubizzle-style: sellers post
listings for free, buyers browse and contact them. The brand name is **CarsUAE** (it replaced
the earlier name "مِرْآب" on 2026-10-10); the public domain is **carsuae.net**.

**Talk to the owner in Arabic.** He is not a developer: give plain,
step-by-step instructions, and do the technical work yourself wherever the
connected tools allow it.

## Stack

| Piece | Where |
|---|---|
| Frontend | React 18 + Vite + Tailwind 3, single page app |
| Hosting | **Cloudflare Workers** `carsuae` (account Alkhoori34@gmail.com, since 2026-10-27; Workers Builds deploys every push to `main`: `npm run build` + `npx wrangler deploy`, config `wrangler.jsonc`, entry `worker/index.js`, test URL carsuae.alkhoori34.workers.dev). The old Vercel project `car-market-uae-v2` still builds but Vercel's free plan paused it on 2026-10-27 |
| Backend | Supabase project ref `bfdyxoycbwlibzcovxef` (auth, Postgres, Storage) |
| Domain / DNS | Registered at Namecheap; DNS on Cloudflare (nameservers lana/pedro.ns.cloudflare.com, zone carsuae.net). `carsuae.net` and `www` are Worker custom domains; Zoho MX/SPF/DKIM/DMARC, Resend (`resend._domainkey`, CNAMEs `send`, `rsend`) and Google verification TXT copied over |
| Transactional email | Resend (SMTP wired into Supabase Auth) |
| Mailbox | Zoho Mail, `carsuae@carsuae.net` (MX/SPF/DKIM/DMARC set in Namecheap) |

The old Vercel project `car-market-uae` (without `-v2`) is not the live site.

## Code layout

Almost everything lives in `src/App.jsx` (one large component plus small
helpers at the bottom: `ListingCard`, `ChipRow`, `Chip`, `ComboBox`, `Field`,
`Spec`). Styles are in `src/index.css`.

- **Design:** light and plain (since 2026-10-10, at the owner's request):
  white background, dark text, one blue accent (`--cm-accent`) for actions
  and links, no gradients or glows. Keep pages simple: home is search, a
  "sell your car" banner and the newest cars; on the browse page every filter
  (make, emirate, budget, body, year, km, specs, negotiable) sits in one
  folded "الفلاتر" panel, not as chips on the page.
- **Styling rule:** colours are CSS variables and named classes (`cm-card`,
  `cm-btn-primary`, `cm-price`, `cm-tag-*`, `cm-badge-*` …) in `index.css`.
  Use standard Tailwind utilities only for layout/spacing. Do not use Tailwind
  arbitrary-value brackets like `bg-[#0A0E17]`.
- **Routing / SEO:** real paths, defined once in `src/seo-data.js` (slugs for
  every make and city, `parsePath`, `paths`, page copy) and shared by the app
  and the server:
  `/used-cars`, `/used-cars/<make>`, `/used-cars/in/<city>`,
  `/used-cars/under/<max>`, `/used-cars/<make>/<model>` (model slug from
  `modelSlug`, Arabic allowed), `/dealer/<slug>`, `/car/<id>`. The browse page's URL follows its
  make/city/budget filters. Old `/#/car/<id>` links are rewritten on load.
  `vercel.json` sends those paths to `api/page.js`, which returns the built
  `index.html` with real `<title>`/meta/canonical/OG tags, JSON-LD and the
  page content in `#root` (React then takes over). `api/sitemap.js` serves
  `/sitemap.xml`; `public/robots.txt` points to it. Pages are edge-cached for
  5 minutes. A new make added to `MODELS` also needs a slug in `seo-data.js`.
  The home page `/` is sent to `api/page.js` by `middleware.js` (static
  index.html would otherwise win over rewrites). Category pages paginate with
  `?page=N` (48 per page); car pages list up to 6 other cars of the same make.
  Preview deployments are behind Vercel login, so server pages there render
  the login page as the shell — check SEO output on production.
  Icons and the default share image (`og-image.png`) live in `public/`.
- **Data:** `MODELS` holds ~135 makes with their models (Arabic names).
  `CITIES` = the seven emirates plus العين. Currency is د.إ, numbers formatted
  with `ar-AE`.
- Photos go to the Storage bucket `car-images` under `<user_id>/…`; the row
  keeps `image` (first photo) and `images` (all, up to 8).
- A browser-side MobileNet check rejects photos with no vehicle in them.
- Email sign-up sends a confirmation link (via Resend, sender "Cars UAE")
  that returns to `window.location.origin`; the dialog then shows a "check your
  inbox" screen with a resend button. Supabase Site URL is
  `https://carsuae.net`, with `carsuae.net/**` and the vercel.app domain in
  the redirect allow list. Verified working end to end on 2026-10-10.
  The Arabic email body lives in `email-templates/confirm-signup.html` and is
  pasted by hand into Supabase → Auth → Email Templates (subject
  "أكّد بريدك الإلكتروني | CarsUAE"); keep the two in sync.
- **Listing life cycle:** `sold` (owner or admin presses "تم البيع") and
  `expires_at` (30 days, `LISTING_DAYS`; renew button shows in the last 7
  days). Sold/expired rows stay in the table but are hidden from the app,
  server pages and sitemap (`isLive` in the app, `queryListings({ live })` on
  the server); a sold car's own page still opens with "تم بيع هذه السيارة".
- **Admin:** users listed in `public.admins` (owner only) get "لوحة الإدارة"
  in the account menu: search all listings, sold/renew/delete, reports
  (dismiss resets `reports_count`), dealers, and visitor stats.
- **Views & visitors:** the app calls RPC `track_visit(path, source,
  listing_id)` once per page per tab (admins skipped via localStorage
  `cm_admin`); it inserts into `visits` and bumps `listings.views`. Admin
  numbers come from RPC `visit_stats(days)`.
- **Contact clicks (since 2026-10-28):** the listing's WhatsApp, call and
  «عرض الرقم» buttons call RPC `track_contact(listing, kind, source)` once per
  listing/kind per tab (`trackContact` in App.jsx; admins and bots skipped).
  Rows go to `contacts` (with the listing's `dealer_id`); the admin box
  «التواصل مع البايعين» reads RPC `contact_stats(days)` (totals, per broker,
  top cars). This is the number to show brokers/dealers (e.g. VIP CAR MOTORS).
  SQL in `listings-contacts.sql`.
- **Dealers (brokers):** `dealers` table, `listings.dealer_id`; verified
  dealers get a "وسيط معتمد" badge and a `/dealer/<slug>` page. Imported
  broker ads keep the car owner's phone number.
  A dealer can be linked to a site account (`dealers.user_id`, set by SQL on
  the owner's request, e.g. souq-7r): that user's new listings get the
  `dealer_id` and dealer name automatically (`myDealer` in App.jsx), and the
  trigger `listings_check_dealer` blocks anyone else from using a dealer_id
  (`listings-dealer-accounts.sql`).
- **VIN check (فحص رقم الشاصي)** at `/vin-check` (view `vin`, `VinCheck` in
  App.jsx; in the header "القائمة" menu and a button on each listing). `api/vin.js`
  calls the free NHTSA vPIC decoder and recalls API (no key); `src/vin.js`
  reads country/maker/year from the VIN itself. NHTSA only covers North
  American-market cars but also decodes some GCC VINs (a GCC Land Cruiser VX-R
  decodes), so the page gives no GCC/imported verdict, only how to confirm.
  Recalls are shown only for VINs with a valid check digit. `?vin=` prefills.
- **Articles (المقالات)** at `/blog` and `/blog/<slug>` (view `blog`, `Blog`
  in App.jsx; reached from the header "القائمة" menu and the footer, not the
  home page — the owner wants home kept to search, sell banner and cars).
  Content lives in `src/articles.js` as block lists, rendered by both React and
  `api/page.js` (Article JSON-LD) and listed in the sitemap. To publish a new
  article, add an entry at the top of `ARTICLES` with an English slug; keep
  facts checked against sources and avoid fees/prices that change often.
- **Info pages** `/sell`, `/faq`, `/safety`, `/dealers`, `/about`, `/contact`,
  `/terms`, `/privacy` (slugs in `INFO_SLUGS` in seo-data.js, content in
  `src/legal.js`, view `info`; same block format as articles plus a `faq`
  block that also emits FAQPage JSON-LD; CTA href `#sell` opens the sell
  form). Footer order is `FOOTER_PAGES`; the sign-in dialog links terms and
  privacy. `/dealers` is the page to send brokers in outreach messages. The privacy page lists what the site collects
  and which services it uses: update it when that changes.
- **Speed:** since the move to Cloudflare (2026-10-27) `src/img.js` turns
  Supabase public-storage photo URLs into `/img/<path>?w=384|640|1080`. The
  worker resizes them with Cloudflare Image Transformations (enabled on the
  carsuae.net zone; free 5,000 unique transformations/month, then it falls
  back to the original file; paid is $0.50 per 1,000), WebP when accepted,
  and keeps them in the edge cache for a year. Supabase Storage itself is slow
  from the UAE (1–4 s per photo). vercel.json has a plain `/img` rewrite for
  the old host. The car modal preloads all photos of the open car. `worker/index.js` mirrors
  vercel.json/middleware.js routing (keep `run_worker_first` in
  wrangler.jsonc in sync when adding server-rendered paths) and caches pages
  that send `s-maxage` in Cloudflare's cache. Server pages embed their rows as `window.__SEED__` (home:
  `listings`, car page: `car`, without the phone column) so the app draws
  cards at once; full rows arrive from Supabase after. The home shows
  skeleton cards while loading; fonts load non-blocking from index.html;
  `html { overflow-y: scroll }` stops RTL sideways jumps. Measured on
  PageSpeed Insights before this work (2026-10-21): mobile 66, desktop 72.
- **English version (since 2026-10-24):** every page also exists under `/en`
  (`/en`, `/en/used-cars/toyota`, `/en/car/<id>` …). `middleware.js` sends
  `/en/*` to `api/page.js` with `lang=en`, which renders English titles,
  meta, body and `hreflang` ar/en/x-default links (helpers `T`, `tr`, `P`
  over AsyncLocalStorage; `translateHtml` covers short leftover text). The
  sitemap lists both copies. Articles and info pages take their English text
  from `src/content-en.js` (`INFO_PAGES_EN`, `ARTICLES_EN`; `infoPageIn`,
  `articleIn` pick the language; in the browser `INFO_PAGES`/`ARTICLES`
  are already in the page's language): a new article or info page needs its
  English entry there too. In the
  browser `src/i18n.js` turns on English when the path starts with `/en`:
  LTR, in-place translation of interface text (dictionary + patterns;
  seller descriptions stay as written; anything inside `[data-no-i18n]` is
  skipped) and `/en` prefixing of internal links and history. The header
  button «EN / عربي» switches language. New interface text needs an entry in
  the `UI` dictionary of `src/i18n.js`; new Arabic model names in `MODELS`.
- **Featured (مميز, since 2026-10-24):** `listings.featured_until`; while it
  is in the future the card gets a «⭐ مميز» tag and gold outline and the car
  is listed first (home and the "newest" sort). Admin panel button
  «⭐ تمييز 7 أيام» / «إلغاء التمييز» (`FEATURE_DAYS`); the trigger
  `listings_check_featured` stops non-admins from setting it
  (`listings-featured.sql`).
- WhatsApp button on every listing (`waNumber` normalises UAE numbers).
- Phone OTP is wired to Supabase phone auth (Twilio) but switched off with
  `REQUIRE_PHONE_VERIFICATION = false` until the Twilio compliance profile is
  approved.

## Database (public schema)

- `listings` — id, seller_id, make, model, body_type, year, price, mileage,
  city, fuel, trans, condition, description, phone, seller_name, image,
  images, created_at, reports_count, specs, steering, phone_verified,
  negotiable, previous_price, sold, sold_at, expires_at, views, dealer_id,
  social_posted_at, featured_until
- `dealers` — id, slug (lowercase letters/digits/hyphens), name, instagram, phone, city, verified, user_id
- `visits` — id, path, source, listing_id, created_at (admins read only)
- `contacts` — id, listing_id, dealer_id, kind (whatsapp/call/show_number), source, created_at (admins read only)
- `admins` — user_id
- `favorites` — user_id, listing_id, created_at
- `reports` — id, listing_id, reporter_id, reason, created_at. Three reports
  hide a listing (`REPORT_THRESHOLD`).

RLS: anyone reads listings and dealers; only the owner (`seller_id =
auth.uid()`) inserts, updates or deletes, plus admins (`public.is_admin()`)
who can update/delete any listing, read/delete reports, manage dealers.
The Supabase connector cancels statements containing `drop`, so write
migrations with plain `create` / `alter ... add` and run them via SQL. Run schema changes as Supabase migrations and keep a copy
of the SQL in the repo root (see `listings-*.sql`).

## Working here

- There is no local `npm install` in the cloud session (the npm registry is
  blocked). Syntax-check with the preinstalled esbuild (bundle
  `worker/index.js` and run it in node with a fake ASSETS to test routes),
  then check the Cloudflare build (dashboard → Workers & Pages → carsuae →
  Deployments, in the owner's Chrome).
- Push straight to `main`; Cloudflare deploys it within about a minute. For
  visible changes, push a branch first and show the owner the preview.
- The repo is **public**: never commit keys, OAuth secrets or `.env.local`.

## Importing an ad the owner forwards from WhatsApp (plan A, since 2026-10-11)

The owner forwards a seller's/broker's photos and specs into the chat. Claude:
1. Reads the specs (make, model, year, price, km, city, specs, phone of the
   car's owner — not the broker's) and asks only for what is missing.
2. Saves the photos as `public/l/<make>-<model>-<year>-<n>.jpg` (resize to
   ~1600px wide, JPEG), commits and pushes to `main`.
3. Inserts the row in `listings` via Supabase SQL with `image`/`images` set to
   `https://carsuae.net/l/<file>`, `seller_id` = the owner's user id, and
   `dealer_id` when it came from a known broker; `expires_at` = now + 30 days.
4. Schedules the Instagram/Facebook/TikTok post through the Metricool
   connector, linking to `https://carsuae.net/car/<id>`.
Instagram links (done 2026-10-11 for the Patrol ad): WebFetch is blocked, so
read the post in the owner's Chrome (Claude in Chrome), collect the carousel
image URLs, navigate the same tab to `https://carsuae.net/#ig=<urls>` (the IG
CDN allows CORS from carsuae.net, Instagram's own CSP blocks Supabase), then
from carsuae.net upload each image to Storage `car-images/<owner uid>/...`
with the logged-in session token (POST without `x-upsert`, which RLS rejects)
and insert the row via SQL. Default Metricool slot: next day 19:00 Dubai,
brand `carsuaenet` (blogId 7350493), instagram + facebook + tiktok.
Plan B (full automation through the WhatsApp Cloud API on a dedicated number)
waits on Meta Business Verification.

## Instagram importer (admin, since 2026-10-22)

Admin panel → «استيراد من إنستغرام» (also opens on `carsuae.net/#import=…`).
The owner drags the «CarsUAE استيراد» bookmark (source: `BOOKMARKLET_SOURCE`
in `src/importer-parse.js`) to Chrome's bookmarks bar once. On a broker's
Instagram profile the bookmark collects the last N days of posts through
Instagram's web API (`/api/v1/media/<id>/info/`, the owner's own session) and
navigates the same tab to `carsuae.net/#import=<json>`. `src/Importer.jsx`
parses each caption (`parseCaption`, `excludeReason`, `cleanDescription`),
flags sold/buy/plate/rims/no-text posts and cars already on the site
(phone+make+model+year), shows editable rows, and on «انشر» copies photos to
Storage `car-images/<admin uid>/ig-<code>-<n>.jpg` and inserts listings with
the chosen `dealer_id` and the credit line "📢 الإعلان من حساب …". This runs in
the owner's browser, so imports cost no Claude usage; Claude only helps when
asked to check rows.

## Daily broker import + social posts (since 2026-10-22; split 2026-10-25)

Two scheduled tasks (owner's schedule, lighter since 2026-10-25 to save usage):
- "CarsUAE nightly broker import", every day ~10:53 pm Dubai: pulls new ads
  from the approved brokers (rows in `dealers`, plus @smsar2rak and the
  @050k stories for smsar.ajman.1, max 15 posts per broker) through the admin
  Importer in the owner's Chrome. Needs the Chrome window open (not minimized).
- "CarsUAE daily social posts", every day ~10:53 am Dubai: schedules 10 car
  posts on Facebook + TikTok (Instagram max 4, ≥90 min apart) via Metricool
  (blog 7350493). Since 2026-10-26 (owner's choice) they are animated REELS
  made per listing by the reel maker in the owner's Chrome; falls back to
  photo posts if Chrome is not available.
- **Reel maker** `public/tools/reel.html?id=<listing id>` (optional `&title=`):
  draws a 15 s 1080x1920 reel (photos, title/year, spec pills, price card,
  end card) on a canvas and encodes MP4 with WebCodecs + mp4-muxer
  (jsdelivr) in the browser, music `public/media/reel/music.m4a`, fonts
  Tajawal (OFL) in the same folder. With an admin session it uploads to the
  public Storage bucket `reels` (`reels-bucket.sql`; `car-images` only
  accepts images). `window.makeReel()` / `window.__reel` for automation.
**New brokers (owner rule, 2026-10-25):** when a broker is newly added to
`dealers`, import their last 14 days of posts right away (not just the
nightly window), skipping anything already on the site (phone+make+year),
repeats inside the batch, posts with no year, and non-cars. Done first for
dealspote (99 ads).
`listings.social_posted_at` marks listings already posted to social, so they
are not posted twice. Every social caption credits the broker
("📢 الإعلان من حساب @handle") and links to `carsuae.net/car/<id>`.
Metricool rejects `twitterData` unless twitter is a provider.

**Broker outreach lists (owner rule, 2026-10-23):** before putting any broker
account on an outreach list, open its Instagram profile and check it is active
(latest feed post within the last few days). Never list or contact inactive
accounts (e.g. smsar_fujairah: last post June 2020). Check dates via
`/p/<code>/` og:description ("on <date>"), not the media API, which Instagram
blocks after heavy pulls (a 198-post pull from 70x triggered a checkpoint).

**Confirmation messages (owner rule, 2026-10-24):** whenever a new broker
agrees («موافق») and is added, or a new ad from a seller/showroom is
published, send the confirmation on the CarsUAE WhatsApp without asking
first. Seller ad: «هلا فيك 🌷 نزلنا إعلان سيارتك (<السيارة>) على موقعنا 👇
<link> …بلغنا هنا 👍». New broker: thanks + their page
`carsuae.net/dealer/<slug>` + the credit line + "new ads are taken daily".
Any other kind of message still needs the owner's approval.

**Instagram account for reading broker posts (since 2026-10-23):** Chrome has
two Instagram accounts: the brand account `carsuaenet` and `cars00971`, added
only for fetching. Always switch to `cars00971` (account switcher) before
any Instagram fetch; never scrape with `carsuaenet`. Its feed posts were
blocked ("restrict certain activity") after heavy pulls. Our own posting
goes through Metricool and does not use the Chrome session.

## Open work

- Broker outreach follow-up (owner: "review later"): on 2026-10-24 the ~34
  contacted broker accounts were scored by new ads/day and duplicate share.
  Worth following up: smsar_uae_33, smsar_4all, uae_cars_market, lexuscarz,
  smsaruae_971, kfnsmsar, smsar3alain, uaecarsale, smsar__, smsar_car_,
  smsar_988, uaecars, dxb.smsar (~45 new ads/day together). Mostly
  duplicates: smsardxb, smsar_sharjha, smsar.adcars, smsarcars3, smsaruaq0.
  Any reminder message needs the owner's approval.
  New accounts found 2026-10-25 via hashtags (not contacted yet): 971.oldcars,
  sar.suvv, smsar_vtcc, dealspote, smsar_froska, smsarlaqta, motor_car_777,
  smsar.carzz, smsar.seart (~22 new ads/day). Unchecked (Instagram started
  refusing page fetches): uuae.4, car2uae, star_emirates, lexus.570,
  jabri.cars, sold.ae, smsar_4car, smsar_4car2, saad84.90, u.a.ecars.

- SEO: carsuae.net is verified in Google Search Console (Domain property, TXT
  record in Namecheap) and `https://carsuae.net/sitemap.xml` was submitted on
  2026-10-10. Model pages and dealer pages are live and in the sitemap.
- Apple sign-in button exists but needs an Apple Developer account.
- Phone OTP: waiting on Twilio compliance approval.
