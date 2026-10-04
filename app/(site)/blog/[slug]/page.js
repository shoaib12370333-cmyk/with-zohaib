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

  return (
    <main id="main">
      <header className="relative pt-36 md:pt-44 pb-10 overflow-hidden noise">
        <div className="aurora"><i className="w-[36rem] h-[36rem] bg-gold/20 -top-80 right-0" /></div>
        <div className="grid-bg" />
        <div className="wrap relative max-w-[820px]">
          <nav aria-label="Breadcrumb" className="mb-6 font-mono text-xs text-faint flex flex-wrap gap-2">
            <Link href="/" className="hover:text-fg">Home</Link><span>/</span>
            <Link href="/blog" className="hover:text-fg">Blog</Link>
          </nav>
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.slice(0, 3).map((t) => <span key={t} className="chip border-gold/25 text-gold">{t}</span>)}
          </div>
          <h1 className="text-[clamp(2rem,1.2rem+3.4vw,3.6rem)] leading-[1.06] animate-rise">{post.title}</h1>
          <p className="lead mt-5 animate-rise" style={{ animationDelay: '.1s' }}>{post.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-xs text-muted animate-rise" style={{ animationDelay: '.2s' }}>
            <span className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gold/60 bg-surface2 grid place-items-center">
                {c.brand.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.brand.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : <span className="text-gold font-bold">{c.founder.name?.[0]}</span>}
              </span>
              {c.founder.name}
            </span>
            <span>{fmtDate(post.published_at)}</span>
            <span className="flex items-center gap-1.5"><Icon name="clock" className="w-3.5 h-3.5" /> {readingTime(post.body)} min read</span>
          </div>
        </div>
      </header>

      {post.cover_url && (
        <div className="wrap max-w-[1000px] mt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover_url} alt="" className="w-full aspect-[16/8] object-cover rounded-[1.6rem] border border-edge/10" />
        </div>
      )}

      <div className="wrap max-w-[1100px] mt-12 grid lg:grid-cols-[1fr_240px] gap-12">
        <article className="prose-x max-w-[720px]" dangerouslySetInnerHTML={{ __html: html }} />
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-8">
            {headings.length > 2 && (
              <nav aria-label="On this page">
                <div className="font-mono text-[.66rem] tracking-[.18em] uppercase text-faint mb-3">On this page</div>
                <ul className="space-y-2 border-l border-edge/10">
                  {headings.map((h) => (
                    <li key={h.id}><a href={`#${h.id}`} className={`block -ml-px border-l border-transparent hover:border-gold pl-4 text-sm text-muted hover:text-fg transition-colors ${h.level === 3 ? 'pl-7' : ''}`}>{h.text}</a></li>
                  ))}
                </ul>
              </nav>
            )}
            <ShareButtons url={url} title={post.title} />
          </div>
        </aside>
      </div>

      <div className="wrap max-w-[1100px] mt-10 lg:hidden"><ShareButtons url={url} title={post.title} /></div>

      <section className="section">
        <div className="wrap"><CtaBanner {...c.ctaBanners.about} brand={c.brand} /></div>
      </section>

      {more.length > 0 && (
        <section className="pb-24">
          <div className="wrap">
            <Reveal><h2 className="text-[1.6rem] mb-8">Keep reading</h2></Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              {more.map((p, i) => <BlogCard key={p.slug} post={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {jsonLd.map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />)}
    </main>
  );
}
