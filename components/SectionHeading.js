import Link from 'next/link';
import Reveal, { Words } from './Reveal';

// Eyebrow whose gold line DRAWS when the heading scrolls into view — the global
// .eyebrow::before animation would already have finished while it was off-screen.
// The line only starts hidden when JS is on (.js), so no-JS visitors still see it.
const EYEBROW_DRAW =
  'eyebrow before:!animate-none before:origin-left before:transition-transform before:duration-[900ms] before:ease-out before:delay-[250ms] [.js_&]:before:scale-x-0 [.js_&.is-in]:before:scale-x-100';

// Spring "pop" for small icons / numbers: plays when the closest revealed
// ancestor (.is-in) lands — add a `transitionDelay` inline to sequence several.
// Only starts hidden when JS is on, so no-JS visitors simply see the element.
export const POP_IN =
  'transition duration-[650ms] ease-[cubic-bezier(.34,1.56,.64,1)] [.js_&]:scale-50 [.js_&]:opacity-0 [.js_.is-in_&]:scale-100 [.js_.is-in_&]:opacity-100';

/** Mono eyebrow with a self-drawing gold line. Shared by section intros and feature blocks. */
export function Eyebrow({ children, center = false, delay = 0, className = '' }) {
  return (
    <Reveal as="span" from="fade" delay={delay} className={`${EYEBROW_DRAW} ${center ? 'justify-center' : ''} ${className}`}>
      {children}
    </Reveal>
  );
}

export function SectionHeading({ eyebrow, heading, lead, center = false, className = '' }) {
  return (
    <div className={`max-w-[680px] mb-10 md:mb-14 ${center ? 'mx-auto text-center' : ''} ${className}`}>
      {eyebrow && <Eyebrow center={center}>{eyebrow}</Eyebrow>}
      {/* Words needs a plain string; anything richer falls back to a normal heading */}
      {typeof heading === 'string' ? (
        <Words as="h2" className="h-section mt-4" delay={80}>{heading}</Words>
      ) : (
        <h2 className="h-section mt-4">{heading}</h2>
      )}
      {lead && <Reveal as="p" className="lead mt-5" delay={260}>{lead}</Reveal>}
    </div>
  );
}

// On-load keyframes for the page hero. Scroll-reveal would wait for hydration,
// so above-the-fold motion is plain CSS: it starts on first paint and still
// plays with JS disabled. (prefers-reduced-motion is handled globally.)
const HEADER_KEYFRAMES =
  '@keyframes phWord{from{transform:translate3d(0,110%,0) rotate(3deg)}to{transform:none}}' +
  '@keyframes phLine{from{transform:scaleX(0)}}';

const WORD_STEP = 70; // ms between title words

/** Dark-zone page hero: drifting glows, breadcrumbs, word-by-word title, lead and an optional children slot. */
export function PageHeader({ eyebrow, title, lead, children, crumbs }) {
  const words = String(title ?? '').split(/\s+/).filter(Boolean);
  const titleDone = 260 + words.length * WORD_STEP; // when the last title word has landed

  return (
    <header className="dz bg-bg relative overflow-hidden pt-[7.5rem] md:pt-[9.5rem] pb-16">
      <style>{HEADER_KEYFRAMES}</style>

      {/* Original radial glows (teal top-right, gold bottom-left), slowly drifting
          and trailing the scroll a touch for depth. */}
      <div className="parallax absolute -top-[35%] -right-[12%] w-[60%] h-[140%] pointer-events-none" style={{ '--p-speed': 0.12 }} aria-hidden="true">
        <div
          className="h-full w-full rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(29,148,136,.22), transparent 70%)', animation: 'glowDriftA 18s ease-in-out infinite' }}
        />
      </div>
      <div className="parallax absolute -bottom-[70%] -left-[10%] w-[50%] h-[120%] pointer-events-none" style={{ '--p-speed': 0.08 }} aria-hidden="true">
        <div
          className="h-full w-full rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(226,166,61,.12), transparent 70%)', animation: 'glowDriftB 22s ease-in-out infinite' }}
        />
      </div>

      <div className="wrap relative">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="fade-up mb-6 font-mono text-xs text-faint">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {crumbs.map((c, i) => (
                <li key={`${c.label}-${i}`} className="flex items-center gap-2">
                  {c.href ? (
                    <Link href={c.href} className="link-u hover:text-gold">{c.label}</Link>
                  ) : (
                    <span aria-current="page" className="text-muted">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <span aria-hidden="true" className="opacity-50">/</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && <span className="eyebrow fade-up" style={{ '--d': '80ms' }}>{eyebrow}</span>}

        <h1 className="page-title mt-4 max-w-[16em]" aria-label={String(title ?? '')}>
          {words.map((w, i) => (
            <span key={i} aria-hidden="true">
              <span className="w">
                <span style={{ transformOrigin: 'left bottom', animation: `phWord .9s var(--ease) ${260 + i * WORD_STEP}ms both` }}>{w}</span>
              </span>
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h1>

        {lead && <p className="lead fade-up mt-5 max-w-[34em]" style={{ '--d': `${titleDone}ms` }}>{lead}</p>}
        {children && <div className="fade-up" style={{ '--d': `${titleDone + 120}ms` }}>{children}</div>}
      </div>

      {/* hairline that draws across the bottom edge once the title has landed */}
      <span
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-gold/50 via-gold/10 to-transparent"
        style={{ animation: `phLine 1.4s var(--ease) ${titleDone}ms both` }}
        aria-hidden="true"
      />
    </header>
  );
}
