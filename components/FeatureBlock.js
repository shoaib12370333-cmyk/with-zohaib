import Link from 'next/link';
import Icon from './Icons';
import Reveal, { Words } from './Reveal';
import { Eyebrow, POP_IN } from './SectionHeading';

const LEVERS = [
  { n: '01', label: 'Traffic', note: 'Are the right people finding you?', icon: 'globe', color: 'text-teal' },
  { n: '02', label: 'Conversion', note: 'Does the listing convince them?', icon: 'target', color: 'text-gold' },
  { n: '03', label: 'Offer', note: 'Is price & product a real fit?', icon: 'layers', color: 'text-teal' },
];

export default function FeatureBlock({ data }) {
  if (!data) return null;
  const bullets = data.bullets || [];

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      {/* ── text ── */}
      <div>
        <Eyebrow>{data.eyebrow}</Eyebrow>
        <Words as="h2" className="h-section mt-4" delay={80}>{data.title}</Words>
        {/* the copy slides in from the left, one piece after another */}
        <Reveal as="p" from="left" className="lead mt-5" delay={200}>{data.description}</Reveal>

        {bullets.length > 0 && (
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {bullets.map((b, i) => (
              <Reveal as="li" key={b} from="left" delay={300 + i * 90} className="flex items-start gap-3 text-[.97rem]">
                <span className={`mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-teal/15 text-tealDeep ${POP_IN}`} style={{ transitionDelay: `${560 + i * 90}ms` }}>
                  <Icon name="check" className="h-3 w-3" />
                </span>
                {b}
              </Reveal>
            ))}
          </ul>
        )}

        <Reveal from="left" className="mt-8" delay={300 + bullets.length * 90}>
          <Link href="/contact" className="group inline-flex items-center gap-[.4em] font-mono text-[.9rem] font-medium text-tealDeep">
            <span className="link-u">{data.ctaLabel}</span>
            <Icon name="arrow" className="h-[15px] w-[15px] transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </Reveal>
      </div>

      {/* ── dark diagnosis card ── */}
      <Reveal from="right" delay={120}>
        <div data-tilt="3" className="dz relative overflow-hidden rounded-[20px] p-6 shadow-cardLg sm:p-8">
          {/* original gold glow (top-right) + a faint teal answer, both slowly drifting */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[25%] -top-[35%] h-[95%] w-[80%] rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(226,166,61,.24), transparent 70%)', animation: 'glowDriftA 14s ease-in-out infinite' }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[40%] -left-[25%] h-[85%] w-[70%] rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(29,148,136,.16), transparent 70%)', animation: 'glowDriftB 18s ease-in-out infinite' }}
          />

          <div className="relative">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-block rounded-full border border-gold/40 px-[.9em] py-[.4em] font-mono text-[.7rem] uppercase tracking-[.1em] text-gold">
                The 3-lever diagnosis
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-[.7rem] text-faint">
                <i className="pulse-dot h-1.5 w-1.5 rounded-full bg-gold text-gold" aria-hidden="true" /> start here
              </span>
            </div>

            <div className="space-y-3">
              {LEVERS.map((l, i) => (
                <Reveal key={l.n} delay={300 + i * 130}>
                  <div className="group flex items-center gap-4 rounded-2xl border border-edge/10 bg-bg2 p-4 transition duration-300 hover:translate-x-1 hover:border-gold/40 hover:bg-surface2">
                    <span className={`flex-none ${POP_IN}`} style={{ transitionDelay: `${420 + i * 130}ms` }}>
                      <span className={`icon-tile ${l.color}`}><Icon name={l.icon} className="h-5 w-5" /></span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-display font-bold">{l.label}</div>
                      <div className="text-sm text-muted">{l.note}</div>
                    </div>
                    <span className="font-mono text-xs text-faint transition-colors group-hover:text-gold">{l.n}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* thin gold rule draws once the card has landed */}
            <div className="rule mt-6" style={{ '--d': '900ms' }} aria-hidden="true" />
            <p className="mt-5 text-sm leading-relaxed text-muted">We find the weakest lever first — then fix only that, so every change is measurable.</p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
