# carsuae.net — project notes for Claude

Arabic (RTL) used-car marketplace for the UAE, dubizzle-style: sellers post
listings for free, buyers browse and contact them. The in-app brand name is
"مِرْآب"; the public domain is **carsuae.net**.

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

- **Styling rule:** colours and effects are named CSS classes (`cm-card`,
  `cm-btn-primary`, `cm-chip`, `cm-tag-*`, `cm-badge-*` …) defined in
  `index.css`. Use standard Tailwind utilities only for layout/spacing. Do not
  use Tailwind arbitrary-value brackets like `bg-[#0A0E17]`.
- **Routing:** hash routes only. `#/car/<id>` opens a listing. There is no
  server rendering, so Google cannot index individual pages yet.
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
- Phone OTP is wired to Supabase phone auth (Twilio) but switched off with
  `REQUIRE_PHONE_VERIFICATION = false` until the Twilio compliance profile is
  approved.

## Database (public schema)

- `listings` — id, seller_id, make, model, body_type, year, price, mileage,
  city, fuel, trans, condition, description, phone, seller_name, image,
  images, created_at, reports_count, specs, steering, phone_verified,
  negotiable, previous_price
- `favorites` — user_id, listing_id, created_at
- `reports` — id, listing_id, reporter_id, reason, created_at. Three reports
  hide a listing (`REPORT_THRESHOLD`).

RLS: anyone reads listings; only the owner (`seller_id = auth.uid()`) inserts,
updates or deletes. Run schema changes as Supabase migrations and keep a copy
of the SQL in the repo root (see `listings-*.sql`).

## Working here

- There is no local `npm install` in the cloud session (the npm registry is
  blocked). Syntax-check with the preinstalled esbuild, then rely on the
  Vercel build after pushing and confirm the deployment reaches `READY`.
- Push straight to `main`; Vercel deploys it within about a minute.
- The repo is **public**: never commit keys, OAuth secrets or `.env.local`.

## Open work

- SEO: needs real URLs and pre-rendered pages per make, model, city and
  budget before Google can index anything.
- Apple sign-in button exists but needs an Apple Developer account.
- Phone OTP: waiting on Twilio compliance approval.
