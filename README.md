# E-Commerce With Zohaib — Website + Admin

A fast, SEO-ready Next.js 16 site with a database-backed admin panel. Everything on the
public site — text, images, services, FAQs, blog — is editable from `/admin` with no code changes.

## What's inside

**Public site**
- Home, About, Services (+ a detail page per service), Blog, Contact, Privacy
- "Midnight Aurora" design system: dark / light mode, animated aurora hero, bento service grid,
  scroll reveals, count-up stats, cursor spotlight cards, command palette (`Ctrl/⌘ K`)
- **Platform Match quiz** — a 3-question lead qualifier that recommends a starting platform
- Live revenue dashboard driven by each platform's chart points and daily min/max set in the admin; today's bar moves live but never leaves that range
- Contact form with validation, honeypot, rate-limit, no-JS fallback and WhatsApp hand-off
- SEO: per-page metadata, canonical URLs, Open Graph / Twitter cards (auto-generated share image),
  `sitemap.xml`, `robots.txt`, web manifest, JSON-LD (Organization, FAQ, Service, Article, Breadcrumbs)
- Accessible: skip link, focus rings, reduced-motion support, semantic landmarks

**Admin (`/admin`)**
- **Dashboard** — lead stats, 14-day chart, setup checklist
- **Site content** — schema-driven editor: add a field to `lib/defaultContent.js` and the form appears
  automatically (image uploads, icon picker, colour picker, reorderable lists)
- **Version history** — last 30 saves, one-click restore
- **Blog manager** — Markdown editor with live preview, drafts, scheduled publishing, cover images
- **Leads inbox** — status workflow (new / read / replied / archived), search, CSV export
- **Brand & SEO**, **Sections** (show/hide features, announcement bar)
- **Security** — optional TOTP two-factor login

**Security**
- Login rate-limit, constant-time password check, `SameSite=Strict` session cookie, origin checks on all mutations
- Uploads verified by real file signature (PNG/JPG/WebP/GIF/AVIF only), 8 MB limit
- Security headers (HSTS, frame, referrer, permissions); admin never cached or indexed
- `SESSION_SECRET` is **required** in production (no insecure fallback)

## Tech stack
Next.js 16 (App Router, ISR) · Tailwind CSS 3 · Neon Postgres · Vercel Blob · Vercel Analytics · `jose` (sessions)

## Deploy to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. **Storage → Create Database → Postgres (Neon)** → Connect to project (adds `DATABASE_URL`).
3. **Storage → Create Database → Blob** → Connect to project (adds `BLOB_READ_WRITE_TOKEN`).
4. **Settings → Environment Variables** — add:
   - `ADMIN_PASSWORD` — what you type at `/admin/login`
   - `SESSION_SECRET` — long random string (`openssl rand -base64 32`)
   - `SITE_URL` — e.g. `https://ecommercewithzohaib.com`
5. Redeploy, open `/admin/login`, and upload your photos under **Brand & SEO**.

Tables are created automatically on first request. Existing content saved by the previous version
is kept and merged with the new defaults.

### Optional upgrades
| Variable | What it does |
| --- | --- |
| `RESEND_API_KEY` + `NOTIFY_EMAIL` (+ `NOTIFY_FROM`) | Email you every new lead |
| `NOTIFY_WEBHOOK_URL` | Post every lead to Slack / Discord |
| `ADMIN_TOTP_SECRET` | Require a 6-digit authenticator code at login (generate it on `/admin/security`) |

## Local development
```
npm install
cp .env.example .env.local   # fill in what you have
npm run dev
```
Without `DATABASE_URL` the site runs on built-in default content (read-only) — handy for previewing the design.

## Project map
```
app/(site)/…        public pages        app/admin/…      admin UI
app/api/…           contact + admin     lib/defaultContent.js  all editable content & its schema
components/…        UI components       lib/db.js        Postgres, rate limits, versions, posts
```

## Notes
- Testimonials in `defaultContent.js` are placeholders — replace them with real, permissioned client feedback.
- Dashboard figures come from the admin (Homepage → Platforms: chart points, daily min / max). Keep them up to date; there is an optional footnote field (Homepage → Dashboard → Disclaimer).
- `lib/seedPosts.js` holds three starter articles inserted once; edit or delete them in `/admin/posts`.
- `/privacy` is a general template, not legal advice — have it reviewed for your jurisdiction.
