'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icons';

function Stat({ label, value, sub, icon, href }) {
  return (
    <Link href={href} className="rounded-2xl border border-edge/10 bg-surface/70 p-5 hover:border-gold/40 transition-colors group">
      <div className="flex items-center justify-between text-faint">
        <span className="font-mono text-[.66rem] tracking-[.16em] uppercase">{label}</span>
        <Icon name={icon} className="w-4 h-4 group-hover:text-gold transition-colors" />
      </div>
      <div className="mt-3 font-display font-extrabold text-4xl tabular-nums">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </Link>
  );
}

function Check({ ok, label, hint }) {
  return (
    <li className="flex items-start gap-3 py-3">
      <span className={`mt-0.5 w-5 h-5 flex-none rounded-full grid place-items-center ${ok ? 'bg-teal/15 text-teal' : 'bg-gold/15 text-gold'}`}>
        <Icon name={ok ? 'check' : 'bolt'} className="w-3 h-3" />
      </span>
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {!ok && <span className="block text-xs text-faint mt-0.5">{hint}</span>}
      </span>
    </li>
  );
}

export default function Dashboard() {
  const [s, setS] = useState(null);

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => r.json()).then(setS).catch(() => setS({ error: true }));
  }, []);

  if (!s) return <p className="text-muted py-20 text-center">Loading…</p>;
  const env = s.env || {};
  const maxDay = Math.max(1, ...(s.byDay || []).map((d) => d.n));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl">Welcome back 👋</h1>
        <p className="text-sm text-muted mt-1">Here&apos;s what&apos;s happening on your site.</p>
      </div>

      {!env.database && (
        <div className="rounded-2xl border border-gold/30 bg-gold/10 p-5 text-sm">
          <b>Database not connected.</b> The site is running on built-in default content and edits cannot be saved yet. Connect Neon Postgres in Vercel (Storage tab) and set <code className="font-mono">DATABASE_URL</code>.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Unread leads" value={s.unread ?? 0} sub={`${s.messages ?? 0} total`} icon="inbox" href="/admin/messages" />
        <Stat label="Leads · 7 days" value={s.last7 ?? 0} sub="new enquiries this week" icon="trend" href="/admin/messages" />
        <Stat label="Blog posts" value={s.published ?? 0} sub={`${(s.posts ?? 0) - (s.published ?? 0)} drafts`} icon="doc" href="/admin/posts" />
        <Stat label="Saved versions" value={s.versions ?? 0} sub="content history" icon="edit" href="/admin/content" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-edge/10 bg-surface/70 p-5">
          <h2 className="font-display text-base">Leads · last 14 days</h2>
          <div className="mt-6 flex items-end gap-1.5 h-36" role="img" aria-label="Leads per day, last 14 days">
            {(s.byDay || []).map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="w-full flex-1 flex items-end">
                  <div className="w-full rounded-t-md bg-gradient-to-t from-gold/40 to-gold group-hover:from-gold group-hover:to-gold2 transition-colors" style={{ height: `${Math.max(d.n ? 8 : 3, (d.n / maxDay) * 100)}%`, opacity: d.n ? 1 : 0.25 }} title={`${d.label}: ${d.n}`} />
                </div>
                <span className="font-mono text-[.55rem] text-faint hidden sm:block">{d.label.split(' ')[1]}</span>
              </div>
            ))}
            {!(s.byDay || []).length && <p className="text-sm text-faint m-auto">No data yet.</p>}
          </div>
          {(s.byInterest || []).length > 0 && (
            <div className="mt-7">
              <h3 className="font-mono text-[.66rem] tracking-[.16em] uppercase text-faint mb-3">What leads want</h3>
              <ul className="space-y-2">
                {s.byInterest.map((i) => (
                  <li key={i.label} className="flex items-center gap-3 text-sm">
                    <span className="w-36 truncate text-muted">{i.label}</span>
                    <span className="flex-1 h-2 rounded-full bg-edge/10 overflow-hidden"><span className="block h-full rounded-full bg-teal" style={{ width: `${(i.n / s.byInterest[0].n) * 100}%` }} /></span>
                    <span className="tabular-nums w-6 text-right">{i.n}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-edge/10 bg-surface/70 p-5">
          <h2 className="font-display text-base">Setup checklist</h2>
          <ul className="mt-2 divide-y divide-edge/10">
            <Check ok={env.database} label="Database connected" hint="Set DATABASE_URL (Neon Postgres)." />
            <Check ok={env.session} label="Session secret set" hint="Set SESSION_SECRET — required for a secure login in production." />
            <Check ok={env.blob} label="Image uploads enabled" hint="Connect Vercel Blob to upload images." />
            <Check ok={env.email || env.webhook} label="Lead notifications" hint="Set RESEND_API_KEY + NOTIFY_EMAIL (or NOTIFY_WEBHOOK_URL) to get every lead instantly." />
            <Check ok={env.totp} label="Two-factor login" hint="Enable 2FA from the Security page." />
            <Check ok={env.siteUrl} label="Site URL configured" hint="Set SITE_URL so sitemap and share cards use your real domain." />
          </ul>
        </section>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        {[['/admin/content', 'Edit site content', 'edit'], ['/admin/posts', 'Write a blog post', 'doc'], ['/admin/design', 'Update logo & SEO', 'spark']].map(([href, label, icon]) => (
          <Link key={href} href={href} className="rounded-2xl border border-edge/10 bg-surface/70 p-5 flex items-center gap-3 hover:border-gold/40 transition-colors">
            <span className="w-10 h-10 rounded-xl bg-gold/12 text-gold grid place-items-center"><Icon name={icon} className="w-5 h-5" /></span>
            <span className="font-display font-semibold text-sm flex-1">{label}</span>
            <Icon name="arrow" className="w-4 h-4 text-faint" />
          </Link>
        ))}
      </section>
    </div>
  );
}
