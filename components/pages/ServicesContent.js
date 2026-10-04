import Link from 'next/link';
import Icon from '@/components/Icons';
import CtaBanner from '@/components/CtaBanner';
import Reveal from '@/components/Reveal';
import { PageHeader, SectionHeading } from '@/components/SectionHeading';
import { slugifyService } from '@/lib/seo';

export default function ServicesContent({ content }) {
  const { serviceCategories, coaching, pageHeaders, brand } = content;
  const h = pageHeaders.services;

  return (
    <main id="main">
      <PageHeader eyebrow={h.eyebrow} title={h.title} lead={h.lead} crumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]}>
        <div className="mt-8 flex flex-wrap gap-2">
          {serviceCategories.map((c) => (
            <a key={c.title} href={`#${slugifyService(c.title)}`} className="chip hover:border-gold/50 hover:text-fg transition-colors">{c.title}</a>
          ))}
          <a href="#coaching" className="chip hover:border-gold/50 hover:text-fg transition-colors">Coaching</a>
        </div>
      </PageHeader>

      {serviceCategories.map((cat, ci) => (
        <section key={cat.title} id={slugifyService(cat.title)} className={`section ${ci % 2 ? 'bg-bg2/60 border-y border-edge/10' : 'pt-6'}`}>
          <div className="wrap">
            <SectionHeading eyebrow={cat.title} heading={cat.heading} />
            <div className="grid gap-4 md:grid-cols-2">
              {cat.items.map((s, i) => (
                <Reveal key={s.title} delay={(i % 2) * 90}>
                  <Link href={`/services/${s.slug || slugifyService(s.title)}`} className="card card-hover spot group h-full p-7 sm:p-8 flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-[1.5rem]">{s.title}</h3>
                      <span className="w-10 h-10 flex-none rounded-full border border-edge/15 grid place-items-center text-muted group-hover:bg-gold2 group-hover:text-[#1a1204] group-hover:border-gold2 transition-all">
                        <Icon name="upright" className="w-4 h-4" />
                      </span>
                    </div>
                    <p className="mt-3 text-muted leading-relaxed">{s.description}</p>
                    <ul className="mt-6 space-y-2.5 text-[.95rem]">
                      {s.includes.map((inc) => (
                        <li key={inc} className="flex items-center gap-3"><Icon name="check" className="w-4 h-4 flex-none text-teal" />{inc}</li>
                      ))}
                    </ul>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section id="coaching" className="section">
        <div className="wrap">
          <Reveal className="card relative overflow-hidden p-8 sm:p-12 grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
            <div className="aurora"><i className="w-96 h-96 bg-violet/20 -top-32 -left-20" /></div>
            <div className="relative">
              <span className="eyebrow">Coaching & Mentorship</span>
              <h2 className="h-section mt-4">{coaching.title}</h2>
              <p className="lead mt-5">{coaching.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {coaching.pills.map((p) => <span key={p} className="chip border-gold/25 text-gold">{p}</span>)}
              </div>
            </div>
            <ul className="relative space-y-3">
              {coaching.includes.map((inc) => (
                <li key={inc} className="flex items-start gap-3 rounded-2xl border border-edge/10 bg-bg2/60 p-4">
                  <span className="mt-0.5 w-6 h-6 flex-none rounded-full bg-teal/15 text-teal grid place-items-center"><Icon name="check" className="w-3.5 h-3.5" /></span>
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="wrap"><CtaBanner {...content.ctaBanners.services} brand={brand} /></div>
      </section>
    </main>
  );
}
