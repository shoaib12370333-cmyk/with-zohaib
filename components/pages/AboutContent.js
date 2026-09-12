import Icon from '@/components/Icons';
import CtaBanner from '@/components/CtaBanner';
import Reveal from '@/components/Reveal';

export default function AboutContent({ content }) {
  const { founder, values, brand, pageHeaders, sectionLabels } = content;
  const ph = pageHeaders.about;
  const sl = sectionLabels;

  return (
    <main>
      <div className="relative bg-ink text-white pt-[7.5rem] md:pt-[9.5rem] overflow-hidden" style={{ paddingBottom: `${(content.layout && content.layout.pageHeader) ?? 4}rem` }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(45% 60% at 90% 0%, rgba(29,148,136,.18), transparent 65%)' }} />
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-10">
          <span className="eyebrow eyebrow-dark">{ph.eyebrow}</span>
          <h1 className="mt-3 max-w-[16em]" style={{ fontSize: 'var(--ts-title, 3rem)' }}>{ph.title}</h1>
          <p className="text-[#C4CADA] text-[1.125rem] max-w-[34em] mt-4">{ph.lead}</p>
        </div>
      </div>

      <section className="py-16 md:py-[5.5rem]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 grid md:grid-cols-[.85fr_1.15fr] gap-10 items-start">
          <Reveal className="relative rounded-2xl overflow-hidden shadow-cardLg" as="div">
            {brand.portraitUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.portraitUrl} alt={`${founder.name}, ${founder.role}`} className="w-full block" />
            ) : (
              <div className="w-full aspect-[3/4] bg-paper2 flex items-center justify-center text-slateSoft">Add a photo from the admin panel</div>
            )}
            <span className="absolute left-5 bottom-5 bg-ink text-gold font-mono-eyebrow text-[.72rem] tracking-[.08em] px-4 py-[.55em] rounded-full">
              {founder.role?.toUpperCase()}
            </span>
          </Reveal>

          <Reveal>
            <span className="eyebrow">{sl.meetFounder.eyebrow}</span>
            <h2 className="mt-3 mb-5" style={{ fontSize: 'var(--ts-heading, 2.2rem)' }}>{sl.meetFounder.heading} {founder.name}.</h2>
            {(founder.bio || []).map((p, i) => (
              <p key={i} className="text-slate text-[1.125rem] mb-4">{p}</p>
            ))}
            <div className="bg-ink text-white rounded-2xl p-6 mt-8">
              <span className="eyebrow eyebrow-dark">{sl.whoWeWorkWith}</span>
              <ul className="mt-4 space-y-0">
                {(founder.whoWeWorkWith || []).map((item, i) => (
                  <li key={i} className={`flex gap-[.7rem] py-[.6rem] text-[.92rem] text-[#D7DBE4] ${i !== 0 ? 'border-t border-lineDark' : ''}`}>
                    <Icon name="check" className="w-4 h-4 text-teal flex-none mt-[.2rem]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-[5.5rem]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10">
          <Reveal className="max-w-[640px] mb-8 md:mb-12">
            <span className="eyebrow">{sl.values.eyebrow}</span>
            <h2 className="mt-3" style={{ fontSize: 'var(--ts-heading, 2.2rem)' }}>{sl.values.heading}</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(values || []).map((v, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="bg-white border border-line rounded-2xl p-6 h-full transition-all hover:-translate-y-1 hover:shadow-card">
                  <div className="w-[46px] h-[46px] rounded-[10px] bg-ink text-gold flex items-center justify-center mb-4">
                    <Icon name={v.icon} className="w-[22px] h-[22px]" />
                  </div>
                  <h3 className="text-[1.15rem] mb-2">{v.title}</h3>
                  <p className="text-slateSoft text-[.96rem]">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-[5.5rem]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10">
          <CtaBanner eyebrow={content.ctaBanners.about.eyebrow} title={content.ctaBanners.about.title} description={content.ctaBanners.about.description} />
        </div>
      </section>
    </main>
  );
}
