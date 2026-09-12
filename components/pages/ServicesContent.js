import Icon from '@/components/Icons';
import CtaBanner from '@/components/CtaBanner';
import Reveal from '@/components/Reveal';

export default function ServicesContent({ content }) {
  const { serviceCategories, coaching, pageHeaders, sectionLabels } = content;
  const storeCat = serviceCategories?.[0];
  const creativeCat = serviceCategories?.[1];
  const ph = pageHeaders.services;
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
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10">

          {storeCat && (
            <div className="mb-16">
              <Reveal className="flex items-baseline justify-between gap-4 mb-6 border-b border-line pb-4 flex-wrap">
                <div>
                  <span className="eyebrow">{sl.storeSetup.eyebrow}</span>
                  <h2 className="text-[1.5rem] mt-2">{sl.storeSetup.heading}</h2>
                </div>
              </Reveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {storeCat.items.map((item, i) => (
                  <Reveal key={i} delay={i * 60}>
                    <div className="bg-white border border-line rounded-2xl p-6 h-full flex flex-col transition-all hover:-translate-y-1 hover:shadow-card">
                      <div className="w-[46px] h-[46px] rounded-[10px] bg-paper2 text-tealDeep flex items-center justify-center mb-4">
                        <Icon name="shop" className="w-[22px] h-[22px]" />
                      </div>
                      <h3 className="text-[1.3rem] mb-2">{item.title}</h3>
                      <p className="text-slateSoft text-[.96rem]">{item.description}</p>
                      <ul className="mt-4 pt-4 border-t border-line space-y-[.28rem]">
                        {item.includes.map((inc, j) => (
                          <li key={j} className="flex gap-2 text-[.88rem] text-slate">
                            <Icon name="check" className="w-[14px] h-[14px] text-teal flex-none mt-[.25rem]" /> {inc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {coaching && (
            <div className="mb-16">
              <Reveal className="mb-6">
                <span className="eyebrow">{sl.coaching.eyebrow}</span>
                <h2 className="text-[1.5rem] mt-2">{sl.coaching.heading}</h2>
              </Reveal>
              <Reveal>
                <div className="bg-ink text-white rounded-[20px] p-8 grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-[1.4rem] text-white">{coaching.title}</h3>
                    <p className="text-[#C4CADA] mt-4">{coaching.description}</p>
                    <div className="flex flex-wrap gap-[.6rem] mt-5">
                      {(coaching.pills || []).map((p) => (
                        <span key={p} className="font-mono-eyebrow text-[.74rem] border border-white/25 px-[.8em] py-[.4em] rounded-full text-[#D7DBE4]">{p}</span>
                      ))}
                    </div>
                  </div>
                  <ul className="space-y-0">
                    {(coaching.includes || []).map((inc, i) => (
                      <li key={i} className={`flex gap-[.7rem] py-[.6rem] text-[.92rem] text-[#D7DBE4] ${i !== 0 ? 'border-t border-lineDark' : ''}`}>
                        <Icon name="check" className="w-4 h-4 text-teal flex-none mt-[.2rem]" /> {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          )}

          {creativeCat && (
            <div>
              <Reveal className="mb-6 border-b border-line pb-4">
                <span className="eyebrow">{sl.creative.eyebrow}</span>
                <h2 className="text-[1.5rem] mt-2">{sl.creative.heading}</h2>
              </Reveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {creativeCat.items.map((item, i) => (
                  <Reveal key={i} delay={i * 60}>
                    <div className="bg-white border border-line rounded-2xl p-6 h-full flex flex-col transition-all hover:-translate-y-1 hover:shadow-card">
                      <div className="w-[46px] h-[46px] rounded-[10px] bg-paper2 text-tealDeep flex items-center justify-center mb-4">
                        <Icon name={i === 0 ? 'brush' : i === 1 ? 'code' : 'app'} className="w-[22px] h-[22px]" />
                      </div>
                      <h3 className="text-[1.3rem] mb-2">{item.title}</h3>
                      <p className="text-slateSoft text-[.96rem]">{item.description}</p>
                      <ul className="mt-4 pt-4 border-t border-line space-y-[.28rem]">
                        {item.includes.map((inc, j) => (
                          <li key={j} className="flex gap-2 text-[.88rem] text-slate">
                            <Icon name="check" className="w-[14px] h-[14px] text-teal flex-none mt-[.25rem]" /> {inc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-paper py-16 md:py-[5.5rem]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10">
          <CtaBanner eyebrow={content.ctaBanners.services.eyebrow} title={content.ctaBanners.services.title} description={content.ctaBanners.services.description} />
        </div>
      </section>
    </main>
  );
}
