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
| Hosting | Vercel project `car-market-uae-v2`, auto-deploys every push to `main` |
| Backend | Supabase project ref `bfdyxoycbwlibzcovxef` (auth, Postgres, Storage) |
| Domain / DNS | Namecheap (BasicDNS). A `@` → Vercel, CNAME `www` → Vercel |
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
- **Dealers (brokers):** `dealers` table, `listings.dealer_id`; verified
  dealers get a "وسيط معتمد" badge and a `/dealer/<slug>` page. Imported
  broker ads keep the car owner's phone number.
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
- **Speed:** listing photos go through Vercel's image optimizer
  (`src/img.js` `imgSrc`/`imgSrcSet`, allowed hosts and sizes in vercel.json
  `images`; a new photo folder under public/ must be added to both
  `localPatterns` and `LOCAL_DIRS` or its photos return 400). Server pages embed their rows as `window.__SEED__` (home:
  `listings`, car page: `car`, without the phone column) so the app draws
  cards at once; full rows arrive from Supabase after. The home shows
  skeleton cards while loading; fonts load non-blocking from index.html;
  `html { overflow-y: scroll }` stops RTL sideways jumps. Measured on
  PageSpeed Insights before this work (2026-10-21): mobile 66, desktop 72.
- WhatsApp button on every listing (`waNumber` normalises UAE numbers).
- Phone OTP is wired to Supabase phone auth (Twilio) but switched off with
  `REQUIRE_PHONE_VERIFICATION = false` until the Twilio compliance profile is
  approved.

## Database (public schema)

- `listings` — id, seller_id, make, model, body_type, year, price, mileage,
  city, fuel, trans, condition, description, phone, seller_name, image,
  images, created_at, reports_count, specs, steering, phone_verified,
  negotiable, previous_price, sold, sold_at, expires_at, views, dealer_id
- `dealers` — id, slug, name, instagram, phone, city, verified
- `visits` — id, path, source, listing_id, created_at (admins read only)
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
  blocked). Syntax-check with the preinstalled esbuild, then rely on the
  Vercel build after pushing and confirm the deployment reaches `READY`.
- Push straight to `main`; Vercel deploys it within about a minute. For
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

## Open work

- SEO: carsuae.net is verified in Google Search Console (Domain property, TXT
  record in Namecheap) and `https://carsuae.net/sitemap.xml` was submitted on
  2026-10-10. Model pages and dealer pages are live and in the sitemap.
- Apple sign-in button exists but needs an Apple Developer account.
- Phone OTP: waiting on Twilio compliance approval.
