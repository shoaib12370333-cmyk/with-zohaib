import Icon from './Icons';
import Reveal from './Reveal';

// Paper cards with gold stars, a serif quote and an ink avatar (the original look).
// Motion: cards stagger in, the five stars pop one after another once the card is
// revealed, and on hover the card lifts, the avatar gets a gold ring and the
// big quote mark drifts. No JS of its own: the stars hang off the `.is-in` class
// that the global reveal observer adds to the card wrapper.
export default function Testimonials({ items = [] }) {
  return (
    <Reveal from="none" stagger={90} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {(items || []).map((t, i) => (
        <Reveal key={`${t.name}-${i}`} className="group/r h-full">
          {/* paper card on a white band; flips to a white card when the band itself is paper (HomeContent alternates tones) */}
          <figure className="card card-hover spot group/c relative flex h-full flex-col rounded-2xl border-edge/[.06] bg-bg2 p-6 [.bg-bg2_&]:border-edge/10 [.bg-bg2_&]:bg-surface">
            {/* decorative quote mark */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-5 top-3 select-none font-display text-[4.5rem] font-extrabold leading-none text-gold/20 transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover/c:-translate-y-1 group-hover/c:text-gold/45"
            >
              &ldquo;
            </span>

            <div className="relative mb-4 flex gap-[3px] text-gold" role="img" aria-label="5 out of 5 stars">
              {[0, 1, 2, 3, 4].map((s) => (
                <span
                  key={s}
                  // hidden until the card is revealed (only when JS is on), then pops in with a per-star delay
                  className="inline-flex [.js_&]:opacity-0 group-[.is-in]/r:animate-[popIn_.6s_cubic-bezier(.34,1.56,.64,1)_both]"
                  style={{ '--i': s, animationDelay: 'calc(var(--d, 0ms) + 350ms + var(--i) * 85ms)' }}
                >
                  <Icon name="star" className="h-[15px] w-[15px]" />
                </span>
              ))}
            </div>

            <blockquote className="relative flex-1 text-[1.02rem] leading-[1.65] text-fg">&ldquo;{t.quote}&rdquo;</blockquote>

            <figcaption className="relative mt-5 flex items-center gap-[.7rem]">
              <span className="grid h-[38px] w-[38px] flex-none place-items-center rounded-full bg-ink font-display text-[.85rem] font-bold text-gold ring-2 ring-transparent transition-[box-shadow,transform] duration-500 group-hover/c:scale-105 group-hover/c:ring-gold/70">
                {(t.name || '?').trim().charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[.92rem] font-bold">{t.name}</span>
                <span className="block font-mono text-[.72rem] text-muted">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </Reveal>
  );
}
