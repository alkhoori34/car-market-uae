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

## Open work

- SEO: carsuae.net is verified in Google Search Console (Domain property, TXT
  record in Namecheap) and `https://carsuae.net/sitemap.xml` was submitted on
  2026-10-10. Model pages and dealer pages are live and in the sitemap.
- Apple sign-in button exists but needs an Apple Developer account.
- Phone OTP: waiting on Twilio compliance approval.
