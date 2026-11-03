import Link from 'next/link';
import Icon from './Icons';
import Reveal from './Reveal';
import { countryCode, avatarColor, summarize } from '@/lib/reviews';

// Client reviews laid out the way people know them from Fiverr: reviewer avatar + username,
// country, star rating and time, the review text, a Price / Duration footer and the seller's
// response underneath. The text is whatever the owner pastes from THEIR OWN Fiverr profile in
// the admin (Site content → Reviews); nothing here is generated.

function Stars({ value, className = 'h-4 w-4' }) {
  return (
    <span className="inline-flex gap-[2px] text-gold" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name="star" className={`${className} ${n <= value ? '' : 'opacity-20'}`} />
      ))}
    </span>
  );
}

function ReviewCard({ r, brand }) {
  const code = countryCode(r.country);
  return (
    <figure className="card card-hover spot flex flex-col p-6">
      <header className="flex items-center gap-3">
        <span
          className="grid h-11 w-11 flex-none place-items-center rounded-full font-display text-[1.05rem] font-bold text-white"
          style={{ backgroundColor: avatarColor(r.name) }}
          aria-hidden="true"
        >
          {r.name.trim().charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <div className="truncate font-display text-[.98rem] font-bold">{r.name}</div>
          {r.country && (
            <div className="mt-0.5 flex items-center gap-1.5 text-[.78rem] text-muted">
              {code && <span className="rounded border border-edge/20 px-1 font-mono text-[.62rem] leading-[1.35] text-faint">{code}</span>}
              <span className="truncate">{r.country}</span>
            </div>
          )}
        </div>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
        <Stars value={r.rating} />
        <span className="font-display text-[.9rem] font-bold">{r.rating}</span>
        {r.date && <><span className="text-faint" aria-hidden="true">·</span><span className="text-[.82rem] text-muted">{r.date}</span></>}
      </div>

      {r.gig && <div className="mt-3 w-fit max-w-full truncate rounded-full bg-bg2 px-3 py-1 font-mono text-[.68rem] text-muted [.bg-bg2_&]:bg-surface2">{r.gig}</div>}

      <blockquote className="mt-3 flex-1 whitespace-pre-line text-[1rem] leading-[1.65] text-fg">{r.text}</blockquote>

      {(r.price || r.duration) && (
        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-edge/10 pt-4">
          {r.price && (
            <div><dt className="font-mono text-[.62rem] uppercase tracking-[.14em] text-faint">Price</dt><dd className="mt-0.5 font-display text-[.88rem] font-bold">{r.price}</dd></div>
          )}
          {r.duration && (
            <div><dt className="font-mono text-[.62rem] uppercase tracking-[.14em] text-faint">Duration</dt><dd className="mt-0.5 font-display text-[.88rem] font-bold">{r.duration}</dd></div>
          )}
        </dl>
      )}

      {r.response && (
        <div className="mt-5 rounded-xl bg-bg2 p-4 [.bg-bg2_&]:bg-surface2">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 flex-none place-items-center overflow-hidden rounded-full bg-ink font-display text-[.62rem] font-bold text-gold">
              {brand?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : 'EZ'}
            </span>
            <span className="font-display text-[.8rem] font-bold">Seller&apos;s response</span>
          </div>
          <p className="mt-2 whitespace-pre-line text-[.9rem] leading-relaxed text-muted">{r.response}</p>
        </div>
      )}
    </figure>
  );
}

// reviews: output of cleanReviews(); fiverr: content.fiverr; limit: show only the newest N.
export default function FiverrReviews({ reviews = [], fiverr = {}, brand = {}, limit, showAllHref }) {
  if (!reviews.length) return null;
  const s = summarize(reviews, fiverr);
  const shown = limit ? reviews.slice(0, limit) : reviews;

  return (
    <div>
      {/* summary bar */}
      <Reveal className="mb-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 rounded-2xl border border-edge/10 bg-surface p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="font-display text-[2.6rem] font-extrabold leading-none tabular-nums">{s.ratingText}</div>
          <div>
            <Stars value={Math.round(s.rating)} className="h-[18px] w-[18px]" />
            <div className="mt-1 text-[.85rem] text-muted">
              Based on <b className="font-display text-fg">{s.total}</b> client {Number(s.total) === 1 ? 'review' : 'reviews'}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {s.link && (
            <a href={s.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
              See all on Fiverr <Icon name="upright" className="h-4 w-4" />
            </a>
          )}
          {showAllHref && shown.length < reviews.length && (
            <Link href={showAllHref} className="btn btn-primary btn-sm">All {reviews.length} reviews <Icon name="arrow" className="h-4 w-4" /></Link>
          )}
        </div>
      </Reveal>

      <Reveal from="none" stagger={80} className="columns-1 gap-5 md:columns-2 lg:columns-3">
        {shown.map((r, i) => (
          <Reveal key={`${r.name}-${i}`} className="mb-5 break-inside-avoid">
            <ReviewCard r={r} brand={brand} />
          </Reveal>
        ))}
      </Reveal>

      {s.link && (
        <p className="mt-2 text-center text-[.82rem] text-faint">
          Reviews are copied from our{' '}
          <a href={s.link} target="_blank" rel="noopener noreferrer" className="link-u text-muted hover:text-fg">Fiverr profile</a>.
        </p>
      )}
    </div>
  );
}
