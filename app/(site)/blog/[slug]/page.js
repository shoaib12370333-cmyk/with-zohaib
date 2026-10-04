import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContent, getPosts, getPostBySlug } from '@/lib/db';
import { renderMarkdown, readingTime } from '@/lib/markdown';
import { absUrl, breadcrumbJsonLd } from '@/lib/seo';
import { fmtDate } from '@/components/BlogCard';
import BlogCard from '@/components/BlogCard';
import Icon from '@/components/Icons';
import CtaBanner from '@/components/CtaBanner';
import Reveal from '@/components/Reveal';
import ShareButtons from '@/components/ShareButtons';
import TocHighlight from '@/components/TocHighlight';
import { SectionHeading } from '@/components/SectionHeading';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: new Date(post.published_at).toISOString(),
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const [post, c, all] = await Promise.all([getPostBySlug(slug), getContent(), getPosts()]);
  if (!post) notFound();

  const { html, headings } = renderMarkdown(post.body);
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const more = all.filter((p) => p.slug !== post.slug).slice(0, 3);
  const url = absUrl(`/blog/${post.slug}`);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: post.cover_url || undefined,
      datePublished: new Date(post.published_at).toISOString(),
      dateModified: new Date(post.updated_at || post.published_at).toISOString(),
      author: { '@type': 'Person', name: c.founder.name },
      publisher: { '@type': 'Organization', name: `${c.brand.name} ${c.brand.sub}`, logo: c.brand.avatarUrl || undefined },
      mainEntityOfPage: url,
    },
    breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }]),
  ];

  // The page hero is a dark zone (the fixed header bar is white-on-dark). On-load motion is
  // plain CSS (fade-up) so it starts on first paint and also plays without JS.
  const titleWords = String(post.title ?? '').split(/\s+/).filter(Boolean);
  const afterTitle = 200 + Math.min(titleWords.length, 14) * 55; // ms: when the last title word lands
  const hasCover = !!post.cover_url;

  return (
    <main id="main">
      <header className={`dz bg-bg relative overflow-hidden pt-[7.5rem] md:pt-[9.5rem] ${hasCover ? 'pb-28 md:pb-36' : 'pb-12 md:pb-14'}`}>
        {/* Original radial glows (teal top-right, gold bottom-left), drifting and trailing the scroll a touch */}
        <div className="parallax pointer-events-none absolute -right-[12%] -top-[35%] h-[140%] w-[60%]" style={{ '--p-speed': 0.12 }} aria-hidden="true">
          <div className="h-full w-full rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(29,148,136,.22), transparent 70%)', animation: 'glowDriftA 18s ease-in-out infinite' }} />
        </div>
        <div className="parallax pointer-events-none absolute -bottom-[70%] -left-[10%] h-[120%] w-[50%]" style={{ '--p-speed': 0.08 }} aria-hidden="true">
          <div className="h-full w-full rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(226,166,61,.12), transparent 70%)', animation: 'glowDriftB 22s ease-in-out infinite' }} />
        </div>

        <div className="wrap relative">
          <div className="max-w-[880px]">
            <nav aria-label="Breadcrumb" className="fade-up mb-6 font-mono text-xs text-faint">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <li><Link href="/" className="link-u hover:text-gold">Home</Link></li>
                <li aria-hidden="true" className="opacity-50">/</li>
                <li><Link href="/blog" className="link-u hover:text-gold">Blog</Link></li>
                <li aria-hidden="true" className="opacity-50">/</li>
                <li className="min-w-0"><span aria-current="page" className="block max-w-[22ch] truncate text-muted">{post.title}</span></li>
              </ol>
            </nav>

            {tags.length > 0 && (
              <div className="fade-up mb-5 flex flex-wrap gap-2" style={{ '--d': '80ms' }}>
                {tags.slice(0, 3).map((t) => <span key={t} className="chip border-gold/30 text-gold">{t}</span>)}
              </div>
            )}

            <h1 className="page-title max-w-[18em]" aria-label={post.title}>
              {titleWords.map((w, i) => (
                <span key={i} aria-hidden="true">
                  <span className="fade-up inline-block" style={{ '--d': `${200 + Math.min(i, 14) * 55}ms` }}>{w}</span>
                  {i < titleWords.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h1>

            {post.excerpt && <p className="lead fade-up mt-5 max-w-[34em]" style={{ '--d': `${afterTitle}ms` }}>{post.excerpt}</p>}

            <div className="fade-up mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-xs text-muted" style={{ '--d': `${afterTitle + 120}ms` }}>
              <span className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-surface2 ring-2 ring-gold/60">
                  {c.brand.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.brand.avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : <span className="font-bold text-gold">{c.founder.name?.[0]}</span>}
                </span>
                {c.founder.name}
              </span>
              <span>{fmtDate(post.published_at)}</span>
              <span className="flex items-center gap-1.5"><Icon name="clock" className="h-3.5 w-3.5" /> {readingTime(post.body)} min read</span>
            </div>
          </div>
        </div>

        {/* hairline that draws across the bottom edge once the title has landed */}
        <Reveal from="line" delay={afterTitle} className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-gold/50 via-gold/10 to-transparent" aria-hidden="true" />
      </header>

      {hasCover && (
        // overlaps the bottom of the dark hero; wiped in from the top while the photo settles from a slight zoom
        <div className="wrap relative z-10 -mt-20 md:-mt-24">
          <Reveal from="clip" className="mx-auto max-w-[1000px] overflow-hidden rounded-2xl border border-line bg-paper2 shadow-cardLg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_url}
              alt=""
              className="aspect-[16/8] w-full object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(.2,.7,.2,1)] [.js_&]:scale-[1.08] [.js_.is-in_&]:scale-100"
            />
          </Reveal>
        </div>
      )}

      <section className="section">
        <div className="wrap">
          <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="min-w-0">
              <article className="prose-x max-w-[720px] break-words" dangerouslySetInnerHTML={{ __html: html }} />

              <Reveal className="mt-12 max-w-[720px] border-t border-line pt-6">
                <Link href="/blog" className="group inline-flex items-center gap-2 font-mono text-[.76rem] font-medium uppercase tracking-[.12em] text-[rgb(var(--eyebrow))]">
                  <Icon name="arrow" className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1.5" /> All articles
                </Link>
              </Reveal>
              <div className="mt-8 lg:hidden"><ShareButtons url={url} title={post.title} /></div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-8">
                {headings.length > 2 && <TocHighlight headings={headings} />}
                <ShareButtons url={url} title={post.title} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="section bg-bg2">
          <div className="wrap">
            <SectionHeading eyebrow={c.sectionLabels?.blog?.eyebrow} heading="Keep reading" />
            <div className="grid gap-6 md:grid-cols-3">
              {more.map((p, i) => <BlogCard key={p.slug} post={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      <section className={`section ${more.length > 0 ? '' : 'bg-bg2'}`}>
        <div className="wrap"><CtaBanner {...c.ctaBanners.about} brand={c.brand} /></div>
      </section>

      {jsonLd.map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />)}
    </main>
  );
}
