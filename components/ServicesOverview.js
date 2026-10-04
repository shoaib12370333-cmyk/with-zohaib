import Link from 'next/link';
import Icon from './Icons';
import Reveal from './Reveal';

// Original look: an even 3-column grid of white cards — icon tile, title,
// description and a mono "Discover More" link. Motion: cards rise in column by
// column, lift on hover with a gold border, the icon tile turns gold and tilts
// (.icon-tile inside a hovered .card), a gold bar draws across the top, the
// arrow slides and a soft spotlight follows the cursor (.spot).
export default function ServicesOverview({ items = [] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => (
        // The reveal lives on a wrapper so its transition never delays the card's own hover lift.
        <Reveal key={s.title} delay={(i % 3) * 90}>
          <Link
            href={s.slug ? `/services/${s.slug}` : '/services'}
            className="card card-hover spot group flex h-full flex-col overflow-hidden p-6 focus-visible:rounded-[1.25rem]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gold transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
            <span className="icon-tile mb-4">
              <Icon name={s.icon} className="h-[22px] w-[22px]" />
            </span>
            <h3 className="mb-2 text-[1.3rem]">{s.title}</h3>
            <p className="flex-1 text-[.96rem] text-muted">{s.description}</p>
            <span className="mt-4 inline-flex items-center gap-[.4em] font-mono text-[.9rem] font-medium text-tealDeep">
              Discover More
              <Icon name="arrow" className="h-[15px] w-[15px] transition-transform duration-300 group-hover:translate-x-1.5" />
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
