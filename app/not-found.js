import Link from 'next/link';

export const metadata = { title: 'Page not found', robots: { index: false } };

const QUICK_LINKS = [['/about', 'About'], ['/blog', 'Blog'], ['/contact', 'Contact']];

// Rendered by the root layout (outside the public .classic wrapper), so this page is
// its own ink-navy "dark zone": the original hero glows, a big gold 404 whose digits
// rise in one after another and then bob gently, and a gold pill button.
// All motion is CSS (fade-up / float / shimmer) and is switched off for reduced motion.
export default function NotFound() {
  return (
    <main id="main" className="dz relative grid min-h-screen place-items-center overflow-hidden px-6 py-16">
      <div className="glow-hero" aria-hidden="true" />

      <div className="relative max-w-[560px] text-center">
        <span className="eyebrow fade-up">Error 404</span>

        <div className="mt-4 font-display font-extrabold leading-none" style={{ fontSize: 'clamp(6rem, 4rem + 14vw, 11rem)' }} aria-hidden="true">
          {['4', '0', '4'].map((d, i) => (
            // three layers on purpose: entrance (fade-up) → bob (float) → gold shimmer (grad-text)
            <span key={i} className="fade-up inline-block" style={{ '--d': `${120 + i * 120}ms` }}>
              <span className="float inline-block" style={{ animationDelay: `${i * 0.35}s` }}>
                <span className="grad-text">{d}</span>
              </span>
            </span>
          ))}
        </div>

        <h1 className="fade-up mt-4 text-3xl sm:text-4xl" style={{ '--d': '520ms' }}>This page took a wrong turn.</h1>
        <p className="lead fade-up mt-4" style={{ '--d': '640ms' }}>The page you are looking for may have moved or no longer exists.</p>

        <div className="fade-up mt-8 flex flex-wrap justify-center gap-3" style={{ '--d': '760ms' }}>
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/services" className="btn btn-ghost">Browse services</Link>
        </div>

        <nav aria-label="Other pages" className="fade-up mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[.14em] text-faint" style={{ '--d': '880ms' }}>
          {QUICK_LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="link-u hover:text-gold">{label}</Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
