import Link from 'next/link';
import Icon from './Icons';
import Reveal from './Reveal';

// Bento layout for the default 6 cards (rows of 2+1, 1+2, 1+2 on desktop).
// Any other count falls back to an even 3-column grid so there are never gaps.
const BENTO = ['lg:col-span-2', '', '', 'lg:col-span-2', '', 'lg:col-span-2'];

export default function ServicesOverview({ items = [] }) {
  const bento = items.length === 6;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => {
        const featured = bento && i === 0;
        return (
          <Reveal key={s.title} delay={(i % 3) * 80} className={bento ? BENTO[i] : ''}>
            <Link
              href={s.slug ? `/services/${s.slug}` : '/services'}
              className={`card card-hover spot group flex h-full flex-col p-7 sm:p-8 ${featured ? 'min-h-[15rem]' : 'min-h-[13rem]'}`}
            >
              <span className="w-12 h-12 rounded-2xl grid place-items-center bg-gold/12 text-gold border border-gold/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <Icon name={s.icon} className="w-6 h-6" />
              </span>
              <h3 className="mt-6 text-[1.35rem]">{s.title}</h3>
              <p className="mt-3 text-muted leading-relaxed flex-1">{s.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold text-gold">
                Learn more
                <Icon name="arrow" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
              <span className="absolute right-6 top-6 font-mono text-[.7rem] text-faint">{String(i + 1).padStart(2, '0')}</span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
