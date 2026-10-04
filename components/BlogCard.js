import Link from 'next/link';
import Icon from './Icons';
import Reveal from './Reveal';
import { readingTime } from '@/lib/markdown';

export const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

// Classic white card: hairline border, lifts on hover with a gold edge + shadow
// (.card-hover), the cover zooms, a gold bar draws along the bottom and the
// arrow slides. Posts without a cover get a clean ink-navy tile with a big gold initial.
export default function BlogCard({ post, index = 0 }) {
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const initial = String(tags[0] || post.title || '?').trim().slice(0, 1).toUpperCase();

  return (
    <Reveal delay={index * 90} className="h-full">
      {/* focus-visible:rounded-[1.25rem] keeps the card's corners (and the cover clipping) when the global :focus-visible rule sets a 6px radius */}
      <Link href={`/blog/${post.slug}`} className="card card-hover spot group flex h-full flex-col overflow-hidden focus-visible:rounded-[1.25rem]">
        <div className="relative aspect-[16/9] overflow-hidden bg-ink">
          {post.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_url}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-105"
            />
          ) : (
            <>
              {/* the classic hero glows (gold top-right, teal bottom-left), scaled down to a card */}
              <div
                aria-hidden="true"
                className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-110"
                style={{
                  background:
                    'radial-gradient(60% 90% at 88% 0%, rgba(226,166,61,.30), transparent 65%), radial-gradient(55% 80% at 4% 100%, rgba(29,148,136,.28), transparent 65%)',
                }}
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center font-display text-[4rem] font-extrabold leading-none text-gold transition-transform duration-700 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-rotate-3 group-hover:scale-110"
              >
                {initial}
              </span>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            </>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[.7rem] text-muted">
            {tags[0] && <span className="font-medium uppercase tracking-[.14em] text-[rgb(var(--eyebrow))]">{tags[0]}</span>}
            <span>{fmtDate(post.published_at)}</span>
            <span>{readingTime(post.body)} min read</span>
          </div>
          <h3 className="mt-3 text-[1.2rem] leading-snug">{post.title}</h3>
          <p className="mt-3 line-clamp-3 flex-1 text-[.95rem] leading-relaxed text-muted">{post.excerpt}</p>
          <span className="mt-5 inline-flex items-center gap-2 font-mono text-[.76rem] font-medium uppercase tracking-[.12em] text-[rgb(var(--eyebrow))]">
            Read article <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </span>
        </div>

        {/* gold bar that draws along the bottom edge on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-x-100"
        />
      </Link>
    </Reveal>
  );
}
