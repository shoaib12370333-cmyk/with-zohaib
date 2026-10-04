import Icon from '@/components/Icons';
import CtaBanner from '@/components/CtaBanner';
import Reveal from '@/components/Reveal';
import { PageHeader, SectionHeading } from '@/components/SectionHeading';

export default function AboutContent({ content }) {
  const { founder, brand, values, sectionLabels: sl, pageHeaders } = content;
  const h = pageHeaders.about;
  const photo = brand.portraitUrl || brand.avatarUrl;

  return (
    <main id="main">
      <PageHeader eyebrow={h.eyebrow} title={h.title} lead={h.lead} crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]} />

      <section className="section pt-4">
        <div className="wrap grid lg:grid-cols-[.8fr_1.2fr] gap-12 lg:gap-20 items-start">
          <Reveal from="left" className="lg:sticky lg:top-28">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2.2rem] bg-gradient-to-br from-gold/30 via-transparent to-teal/25 blur-2xl" aria-hidden="true" />
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-edge/15 bg-surface shadow-card">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt={founder.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full grid place-items-center font-display font-extrabold text-8xl grad-text">{founder.name?.[0] || 'Z'}</div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-bg/90 to-transparent">
                  <div className="font-display font-bold text-xl">{founder.name}</div>
                  <div className="font-mono text-xs text-gold mt-1">{founder.role}</div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal from="right">
            <span className="eyebrow">{sl.meetFounder.eyebrow}</span>
            <h2 className="h-section mt-4">{sl.meetFounder.heading} <span className="grad-text">{founder.name}</span></h2>
            <div className="mt-8 space-y-5 text-[1.05rem] text-muted leading-[1.85]">
              {founder.bio.map((p) => <p key={p}>{p}</p>)}
            </div>

            <div className="mt-12 card p-7">
              <h3 className="text-[1.15rem]">{sl.whoWeWorkWith}</h3>
              <ul className="mt-5 space-y-3.5">
                {founder.whoWeWorkWith.map((w) => (
                  <li key={w} className="flex items-start gap-3 text-muted leading-relaxed">
                    <span className="mt-1 w-5 h-5 flex-none rounded-full bg-gold/15 text-gold grid place-items-center"><Icon name="check" className="w-3 h-3" /></span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-bg2/60 border-y border-edge/10">
        <div className="wrap">
          <SectionHeading {...sl.values} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 90}>
                <div className="card spot h-full p-7">
                  <span className="w-12 h-12 rounded-2xl bg-teal/12 text-teal border border-teal/25 grid place-items-center"><Icon name={v.icon} className="w-6 h-6" /></span>
                  <h3 className="mt-6 text-[1.15rem]">{v.title}</h3>
                  <p className="mt-3 text-muted leading-relaxed text-[.95rem]">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap"><CtaBanner {...content.ctaBanners.about} brand={brand} /></div>
      </section>
    </main>
  );
}
