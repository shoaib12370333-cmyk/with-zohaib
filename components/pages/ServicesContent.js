import Link from 'next/link';
import Icon from '@/components/Icons';
import CtaBanner from '@/components/CtaBanner';
import Reveal, { Words } from '@/components/Reveal';
import { PageHeader, Eyebrow, POP_IN } from '@/components/SectionHeading';
import { slugifyService } from '@/lib/seo';

// Gold bar that draws along a card's bottom edge on hover (card needs overflow-hidden).
const CARD_BAR =
  'pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-x-100';

const CHIP = 'chip transition-colors duration-300 hover:border-gold/60 hover:text-gold';

// Icons for the creative services, then a neutral fallback by position.
const SLUG_ICON = { 'graphic-design': 'brush', 'website-development': 'code', 'app-development': 'app' };
const FALLBACK_ICONS = ['brush', 'code', 'app'];

// Column count that never leaves a ragged last row: 4-up for the store setup grid,
// 3-up for the creative grid, fewer when a category only has a couple of cards.
const gridCols = (n) =>
  n <= 2 ? 'sm:grid-cols-2' : n === 3 || n === 5 || n === 6 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4';

// Category title + hairline whose gold lead-in draws across when it scrolls into view.
function BlockHeading({ eyebrow, heading }) {
  return (
    <div className="relative mb-8 border-b border-line pb-5">
      <Eyebrow>{eyebrow}</Eyebrow>
      {heading && <Words as="h2" className="mt-2 text-[1.5rem]" delay={80}>{heading}</Words>}
      <Reveal from="line" delay={350} className="absolute -bottom-px left-0 h-[2px] w-24 bg-gold" aria-hidden="true" />
    </div>
  );
}

function ServiceCard({ item, icon }) {
  return (
    <Reveal className="h-full">
      <Link href={`/services/${item.slug || slugifyService(item.title)}`} className="card card-hover spot group flex h-full flex-col overflow-hidden p-6">
        <span className="icon-tile mb-4"><Icon name={icon} className="h-[22px] w-[22px]" /></span>
        <h3 className="mb-2 text-[1.3rem]">{item.title}</h3>
        <p className="text-[.96rem] text-muted">{item.description}</p>
        {(item.includes || []).length > 0 && (
          <ul className="mt-4 space-y-[.3rem] border-t border-edge/10 pt-4">
            {item.includes.map((inc) => (
              <li key={inc} className="flex gap-2 text-[.88rem] text-muted">
                <Icon name="check" className="mt-[.25rem] h-[14px] w-[14px] flex-none text-teal" /> {inc}
              </li>
            ))}
          </ul>
        )}
        <span className="mt-auto inline-flex items-center gap-2 pt-5 font-mono text-[.74rem] font-medium uppercase tracking-[.12em] text-[rgb(var(--eyebrow))]">
          Learn more <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
        <span aria-hidden="true" className={CARD_BAR} />
      </Link>
    </Reveal>
  );
}

function CategoryBlock({ cat, ci }) {
  const items = cat.items || [];
  return (
    <div id={slugifyService(cat.title)}>
      <BlockHeading eyebrow={cat.title} heading={cat.heading} />
      <Reveal from="none" stagger={80} className={`grid gap-6 ${gridCols(items.length)}`}>
        {items.map((item, i) => (
          <ServiceCard
            key={item.slug || item.title}
            item={item}
            icon={item.icon || (ci === 0 ? 'shop' : SLUG_ICON[item.slug] || FALLBACK_ICONS[i % FALLBACK_ICONS.length])}
          />
        ))}
      </Reveal>
    </div>
  );
}

// Services page in the original classic look: ink page hero with in-page chips, then
// store-setup cards (4-up), the ink coaching panel and the creative cards (3-up) on
// white, closing on a paper CTA section. Cards stagger in, lift on hover (icon tile
// turns gold, a gold bar draws along the bottom) and still link to /services/{slug}.
export default function ServicesContent({ content }) {
  const { serviceCategories = [], coaching, pageHeaders, brand } = content;
  const h = pageHeaders.services;
  const [first, ...rest] = serviceCategories;

  return (
    <main id="main">
      <PageHeader eyebrow={h.eyebrow} title={h.title} lead={h.lead} crumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]}>
        <div className="mt-8 flex flex-wrap gap-2">
          {first && <a href={`#${slugifyService(first.title)}`} className={CHIP}>{first.title}</a>}
          {coaching && <a href="#coaching" className={CHIP}>Coaching</a>}
          {rest.map((c) => (
            <a key={c.title} href={`#${slugifyService(c.title)}`} className={CHIP}>{c.title}</a>
          ))}
        </div>
      </PageHeader>

      <section className="section">
        <div className="wrap space-y-16 md:space-y-20">
          {first && <CategoryBlock cat={first} ci={0} />}

          {coaching && (
            <div id="coaching">
              <Reveal from="zoom">
                <div className="dz relative grid items-center gap-8 overflow-hidden rounded-[20px] p-7 shadow-cardLg sm:p-10 md:grid-cols-2 md:gap-12">
                  <div className="glow-hero" aria-hidden="true" />

                  <div className="relative">
                    <Eyebrow>Coaching &amp; Mentorship</Eyebrow>
                    <Words as="h2" className="mt-3 text-[1.6rem] sm:text-[1.9rem]" delay={120}>{coaching.title}</Words>
                    <Reveal as="p" delay={300} className="mt-4 text-muted">{coaching.description}</Reveal>
                    {(coaching.pills || []).length > 0 && (
                      <Reveal from="none" stagger={70} className="mt-5 flex flex-wrap gap-[.6rem]">
                        {coaching.pills.map((p) => (
                          // The reveal wrapper owns opacity/transform; the chip inside owns the hover colour
                          // transition (a transition-colors on the reveal element itself would be overridden).
                          <Reveal as="span" from="zoom" key={p} className="inline-block">
                            <span className="chip border-edge/25 text-fg/85 transition-colors duration-300 hover:border-gold hover:text-gold">{p}</span>
                          </Reveal>
                        ))}
                      </Reveal>
                    )}
                  </div>

                  <Reveal as="ul" from="none" stagger={100} className="relative">
                    {(coaching.includes || []).map((inc, i) => (
                      <Reveal as="li" from="left" key={inc} className={i ? 'border-t border-edge/10' : ''}>
                        {/* Hover colour on the inner row — the .js [data-reveal] transition on the <li> wins otherwise. */}
                        <div className="flex gap-3 py-[.7rem] text-[.95rem] leading-snug text-muted transition-colors duration-300 hover:text-fg">
                          <span className={`mt-[.15rem] flex-none ${POP_IN}`} style={{ transitionDelay: `${300 + i * 100}ms` }}>
                            <Icon name="check" className="h-4 w-4 text-teal" />
                          </span>
                          {inc}
                        </div>
                      </Reveal>
                    ))}
                  </Reveal>
                </div>
              </Reveal>
            </div>
          )}

          {rest.map((cat, i) => <CategoryBlock key={cat.title} cat={cat} ci={i + 1} />)}
        </div>
      </section>

      <section className="section bg-bg2">
        <div className="wrap"><CtaBanner {...content.ctaBanners.services} brand={brand} /></div>
      </section>
    </main>
  );
}
