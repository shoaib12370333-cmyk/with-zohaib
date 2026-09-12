# E-Commerce With Zohaib — Website + Admin Panel

A Next.js site with a database-backed admin panel. Everything on the public
site (text, images, platform chart data) is editable from `/admin` once
deployed — no code changes needed for day-to-day updates.

## What's inside

- **Public site**: Home, About, Services, Contact — all content loaded from the database
- **Admin panel** (`/admin`): password-protected editor for every section of the site, plus image uploads
- **Live platform chart**: clicking eBay / Amazon / Shopify / TikTok Shop on the homepage switches the chart and stats — all editable from the admin panel
- **Contact form**: submissions are saved to the database (visible via your database dashboard; a "view messages" admin screen can be added later if useful)

## Tech stack

- Next.js 16 (App Router)
- Neon Postgres (via Vercel's Postgres integration) — stores all site content and contact form messages
- Vercel Blob — stores uploaded images
- Password-based admin login (signed cookie session, no separate user database)

## Deploy to Vercel — step by step

### 1. Push this code to GitHub
```
cd ecommerce-with-zohaib
git init
git add -A
git commit -m "Initial commit"
```
Create a new empty repository on GitHub, then:
```
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

### 2. Import the project into Vercel
1. Go to vercel.com → **Add New → Project**
2. Select the GitHub repo you just pushed
3. Click **Deploy** (it will fail on the first try — that's expected, because the database and admin password aren't set up yet. Continue to step 3.)

### 3. Add a database
1. In your Vercel project → **Storage** tab → **Create Database** → choose **Postgres** (powered by Neon)
2. Once created, click **Connect to Project** and select this project
   This automatically adds the `DATABASE_URL` environment variable for you.

### 4. Add image storage
1. Still in **Storage** → **Create Database** → choose **Blob**
2. **Connect to Project** the same way — this adds `BLOB_READ_WRITE_TOKEN` automatically

### 5. Set your admin password
1. Go to **Settings → Environment Variables**
2. Add `ADMIN_PASSWORD` = a password of your choice (this is what you'll type at `/admin/login`)
3. Add `SESSION_SECRET` = any long random string (used to sign your login session — for example, run `openssl rand -base64 32` on your computer's terminal, or just mash the keyboard for 40+ characters)

### 6. Redeploy
Go to **Deployments** → click the three dots on the latest deployment → **Redeploy**.
Your site is now live at the `.vercel.app` URL Vercel gives you (or your own domain, if you connect one under **Settings → Domains**).

### 7. Log in and finish setup
1. Visit `yoursite.com/admin/login` and log in with the `ADMIN_PASSWORD` you set
2. Upload Zohaib's two photos under **Brand** (header photo + About page photo) — these didn't carry over automatically and need to be re-uploaded once here
3. Double check the WhatsApp number, email, and any other details
4. Click **Save Changes**

## Running it on your own computer (optional, for testing)

```
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```
Without `DATABASE_URL` set, the site still runs using built-in default content (read-only) — this is only for previewing the design locally, not for real editing.

## Notes

- There is no "forgot password" flow — if you forget `ADMIN_PASSWORD`, just change it in Vercel's Environment Variables and redeploy.
- The contact form currently just saves messages to the database. If you'd like an email or WhatsApp notification every time someone submits the form, that can be added.
