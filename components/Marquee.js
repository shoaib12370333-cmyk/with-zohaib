import Reveal from './Reveal';
import MarqueeLogo from './MarqueeLogo';

// Platform / logo strip. Uses an uploaded logo when present, otherwise the name
// in Archivo extrabold — white cards on a paper band, like the original.
//
// Seamless loop: the track is two IDENTICAL halves and the global `scroll`
// keyframe moves it exactly -50%, so the join is invisible. Each half repeats
// the list until it is wider than any screen.
const MIN_PER_HALF = 18;

export default function Marquee({ label, items = [] }) {
  const list = (items || []).filter(Boolean);
  if (!list.length) return null;

  const reps = Math.max(1, Math.ceil(MIN_PER_HALF / list.length));
  const half = Array.from({ length: reps }, () => list).flat();
  const track = [...half, ...half];
  const speed = Math.max(30, Math.round(half.length * 3)); // ≈ constant px/s however many items

  return (
    <section aria-label={label} className="relative overflow-hidden border-y border-edge/10 bg-bg2 py-7 md:py-8">
      {label && (
        <Reveal as="p" from="fade" className="mb-6 flex items-center justify-center gap-4 px-5 text-center font-mono text-[.7rem] uppercase tracking-[.2em] text-muted">
          {/* gold hairlines grow outward from the label as it appears */}
          <span aria-hidden="true" className="h-px w-8 origin-right bg-gold/60 transition-transform duration-[900ms] ease-out [.js_&]:scale-x-0 [.js_.is-in_&]:scale-x-100" />
          {label}
          <span aria-hidden="true" className="h-px w-8 origin-left bg-gold/60 transition-transform duration-[900ms] ease-out [.js_&]:scale-x-0 [.js_.is-in_&]:scale-x-100" />
        </Reveal>
      )}

      {/* Pauses on hover (global .marquee-mask rule). With reduced motion the
          strip stops and becomes a centred, wrapping row of the first set only. */}
      <Reveal from="fade" delay={150} className="marquee-mask overflow-hidden motion-reduce:![mask-image:none] motion-reduce:![-webkit-mask-image:none]">
        <ul className="marquee py-3 motion-reduce:!animate-none motion-reduce:!w-auto motion-reduce:flex-wrap motion-reduce:justify-center" style={{ '--speed': `${speed}s` }}>
          {track.map((it, i) => {
            const hasName = it.name && it.name.trim().length > 0;
            const dupe = i >= list.length; // every card after the first set is decoration
            const logoOnly = it.logoUrl && !hasName;
            return (
              <li
                key={i}
                aria-hidden={dupe ? 'true' : undefined}
                // The CARD stays the same size. A logo-only card has a FIXED width (so no logo can
                // ever resize it or make the looping strip jump) with little padding; the picture
                // inside is auto-fitted to fill it (see MarqueeLogo).
                className={`group mx-2.5 flex h-[4.25rem] flex-none items-center justify-center gap-3 whitespace-nowrap rounded-xl border-[1.5px] border-line bg-white ${logoOnly ? 'w-[9.5rem] px-3 py-1.5' : 'min-w-[9.5rem] px-8'} font-display text-[1.1rem] font-extrabold text-ink shadow-sm transition duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-card motion-reduce:my-1.5 ${dupe ? 'motion-reduce:hidden' : ''}`}
              >
                {it.logoUrl && (
                  <MarqueeLogo
                    src={it.logoUrl}
                    alt={hasName ? '' : it.name || ''}
                    boxW={logoOnly ? 128 : 84}
                    boxH={logoOnly ? 54 : 40}
                  />
                )}
                {hasName && it.name}
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
