import './globals.css';
import { Archivo, Source_Serif_4, IBM_Plex_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { getContent } from '@/lib/db';
import { siteUrl } from '@/lib/seo';
import PointerEffects from '@/components/PointerEffects';

// The original brand typefaces: Archivo (headings), Source Serif 4 (body), IBM Plex Mono (labels).
const display = Archivo({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['500', '600', '700', '800', '900'] });
const body = Source_Serif_4({ subsets: ['latin'], variable: '--font-body', display: 'swap', weight: ['400', '500', '600'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap', weight: ['400', '500', '600'] });

export async function generateMetadata() {
  const c = await getContent();
  const icon = c.brand.faviconUrl || c.brand.avatarUrl;
  const og = c.brand.ogImageUrl;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: c.seo.title, template: `%s — ${c.brand.name} ${c.brand.sub}` },
    description: c.seo.description,
    keywords: c.seo.keywords,
    applicationName: `${c.brand.name} ${c.brand.sub}`,
    authors: [{ name: c.founder.name }],
    alternates: { canonical: '/' },
    icons: icon ? { icon } : undefined,
    openGraph: {
      type: 'website',
      siteName: `${c.brand.name} ${c.brand.sub}`,
      title: c.seo.title,
      description: c.seo.description,
      url: '/',
      images: og ? [{ url: og }] : undefined, // falls back to app/opengraph-image.js
    },
    twitter: { card: 'summary_large_image', title: c.seo.title, description: c.seo.description, images: og ? [og] : undefined },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

export const viewport = {
  themeColor: '#0A0F1E',
  width: 'device-width',
  initialScale: 1,
};

// Runs before first paint: restores the saved theme (default dark) and flags
// that JS is available so scroll-reveal never hides content for no-JS visitors.
const initScript = `try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','dark')}document.documentElement.classList.add('js')`;

export default async function RootLayout({ children }) {
  const content = await getContent();
  const vis = content.visibility || {};
  return (
    <html lang="en" data-theme="dark" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[400] focus:btn focus:btn-primary focus:btn-sm">Skip to content</a>
        <div className="progress" aria-hidden="true" />
        <PointerEffects />
        {children}
        {vis.analytics !== false && <Analytics />}
      </body>
    </html>
  );
}
