import './globals.css';
import { getContent } from '@/lib/db';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'E-Commerce With Zohaib — Marketplace Growth & Coaching Agency',
  description: 'E-Commerce With Zohaib helps new and struggling sellers launch and grow on eBay, Amazon, Shopify, and TikTok Shop — with coaching, store setup, graphic design, web and app development.',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }) {
  const content = await getContent();
  const t = content.theme || {};
  const ts = content.textSizes || {};
  const vis = content.visibility || {};
  const favicon = content.brand?.faviconUrl || content.brand?.avatarUrl;
  const themeCss = `:root{
    --c-ink:${t.ink};--c-ink2:${t.ink2};--c-paper:${t.paper};--c-paper2:${t.paper2};
    --c-gold:${t.gold};--c-goldDeep:${t.goldDeep};--c-teal:${t.teal};--c-tealDeep:${t.tealDeep};
    --c-slate:${t.slate};--c-slateSoft:${t.slateSoft};--c-line:${t.line};
    --ts-hero:${ts.heroHeadline}rem;--ts-heading:${ts.sectionHeading}rem;--ts-title:${ts.pageTitle}rem;--ts-body:${ts.body}rem;
  }`;
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {favicon && <link rel="icon" href={favicon} />}
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body>
        {children}
        {vis.analytics !== false && <Analytics />}
      </body>
    </html>
  );
}
