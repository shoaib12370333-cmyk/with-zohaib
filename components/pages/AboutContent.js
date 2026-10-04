import Icon from '@/components/Icons';
import CtaBanner from '@/components/CtaBanner';
import Reveal, { Words } from '@/components/Reveal';
import { PageHeader, SectionHeading, Eyebrow, POP_IN } from '@/components/SectionHeading';

// Gold bar that draws along a card's bottom edge on hover (card needs overflow-hidden).
const CARD_BAR =
  'pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-x-100';

// About page in the original classic look: ink page hero, white founder section,
// paper values grid, closing CTA. Motion: the portrait is wiped in and settles from a
// slight zoom while its photo drifts with the scroll, the headline slides up word by
// word, bio lines and checklist rows follow in sequence, value cards stagger up.
export default function AboutContent({ content }) {
  const { founder, brand, values, sectionLabels: sl, pageHeaders } = content;
  const h = pageHeaders.about;
  const photo = brand.portraitUrl || brand.avatarUrl;
  const bio = founder.bio || [];
  const who = founder.whoWeWorkWith || [];

  return (
    <main id="main">
      <PageHeader eyebrow={h.eyebrow} title={h.title} lead={h.lead} crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]} />

      <section className="section">
        <div className="wrap grid items-start gap-10 md:grid-cols-[.85fr_1.15fr] lg:gap-16">
          {/* Portrait — sticks while the (taller) text column scrolls past */}
          <div className="md:sticky md:top-28">
            <Reveal from="clip" className="relative overflow-hidden rounded-2xl bg-ink shadow-cardLg">
              <div className="relative aspect-[4/5] overflow-hidden">
                {photo ? (
                  // The photo is taller than its frame and drifts slowly UP with the scroll (.parallax).
                  // All the overscan sits below the frame (top-0), so the drift never exposes an
                  // empty edge and the top of the portrait is never cropped.
                  <div className="parallax absolute inset-x-0 -bottom-[14%] top-0" style={{ '--p-speed': -0.025 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt={`${founder.name}, ${founder.role}`}
                      className="h-full w-full object-cover object-top transition-transform duration-[1800ms] ease-[cubic-bezier(.2,.7,.2,1)] [.js_&]:scale-[1.12] [.js_.is-in_&]:scale-100"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-ink">
                    <div className="glow-hero" aria-hidden="true" />
                    <span className="relative font-display text-[7rem] font-extrabold leading-none text-gold">{founder.name?.[0] || 'Z'}</span>
                  </div>
                )}
              </div>
              {founder.role && (
                <span
                  className={`absolute bottom-5 left-5 rounded-full bg-ink px-4 py-[.55em] font-mono text-[.72rem] uppercase tracking-[.08em] text-gold shadow-[0_10px_24px_-10px_rgba(0,0,0,.6)] ${POP_IN}`}
                  style={{ transitionDelay: '700ms' }}
                >
                  {founder.role}
                </span>
              )}
            </Reveal>
          </div>

          <div>
            <Eyebrow>{sl.meetFounder.eyebrow}</Eyebrow>
            <Words as="h2" className="h-section mt-3" delay={100}>{`${sl.meetFounder.heading} ${founder.name}.`}</Words>

            <Reveal from="none" stagger={120} className="mt-6 space-y-4">
              {bio.map((p, i) => (
                <Reveal as="p" key={i} className="text-[1.08rem] leading-[1.8] text-muted">{p}</Reveal>
              ))}
            </Reveal>

            {who.length > 0 && (
              <Reveal className="dz relative mt-8 overflow-hidden rounded-2xl p-6 shadow-cardLg sm:p-7">
                <div className="glow-hero" aria-hidden="true" />
                <div className="relative">
                  <Eyebrow>{sl.whoWeWorkWith}</Eyebrow>
                  <Reveal as="ul" from="none" stagger={90} className="mt-3">
                    {who.map((item, i) => (
                      <Reveal as="li" from="left" key={i} className={i ? 'border-t border-edge/10' : ''}>
                        {/* The hover colour lives on this inner row: the global .js [data-reveal]
                            transition on the <li> would otherwise override transition-colors. */}
                        <div className="flex gap-3 py-[.7rem] text-[.95rem] leading-snug text-muted transition-colors duration-300 hover:text-fg">
                          <span className={`mt-[.15rem] flex-none ${POP_IN}`} style={{ transitionDelay: `${200 + i * 90}ms` }}>
                            <Icon name="check" className="h-4 w-4 text-teal" />
                          </span>
                          {item}
                        </div>
                      </Reveal>
                    ))}
                  </Reveal>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="section bg-bg2">
        <div className="wrap">
          <SectionHeading {...sl.values} />
          <Reveal from="none" stagger={90} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(values || []).map((v, i) => (
              <Reveal key={`${v.title}-${i}`} className="h-full">
                <div className="card card-hover spot group h-full overflow-hidden p-6">
                  <span className="mb-4 grid h-[46px] w-[46px] place-items-center rounded-[10px] bg-ink text-gold transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-gold group-hover:text-ink">
                    <Icon name={v.icon} className="h-[22px] w-[22px]" />
                  </span>
                  <h3 className="mb-2 text-[1.15rem]">{v.title}</h3>
                  <p className="text-[.96rem] text-muted">{v.description}</p>
                  <span aria-hidden="true" className={CARD_BAR} />
                </div>
              </Reveal>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap"><CtaBanner {...content.ctaBanners.about} brand={brand} /></div>
      </section>
    </main>
  );
}
