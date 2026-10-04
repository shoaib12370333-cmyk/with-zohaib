import Link from 'next/link';
import Icon from './Icons';
import Reveal from './Reveal';
import { readingTime } from '@/lib/markdown';

export const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default function BlogCard({ post, index = 0 }) {
  const tags = Array.isArray(post.tags) ? post.tags : [];
  return (
    <Reveal delay={index * 90} className="h-full">
      <Link href={`/blog/${post.slug}`} className="card card-hover spot group flex h-full flex-col overflow-hidden">
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-surface2 to-surface">
          {post.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover_url} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <>
              <div className="absolute inset-0 grid-bg opacity-60" style={{ maskImage: 'none', WebkitMaskImage: 'none' }} />
              <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-gold/25 blur-3xl" />
              <div className="absolute inset-0 grid place-items-center font-display font-extrabold text-6xl grad-text opacity-80">
                {(tags[0] || post.title).slice(0, 1).toUpperCase()}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[.68rem] text-faint">
            {tags[0] && <span className="text-gold uppercase tracking-[.14em]">{tags[0]}</span>}
            <span>{fmtDate(post.published_at)}</span>
            <span>{readingTime(post.body)} min read</span>
          </div>
          <h3 className="mt-3 text-[1.2rem] leading-snug">{post.title}</h3>
          <p className="mt-3 text-muted text-[.95rem] leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
          <span className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-gold">
            Read article <Icon name="arrow" className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
