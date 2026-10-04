import { getContent, getPosts } from '@/lib/db';
import BlogCard from '@/components/BlogCard';
import { PageHeader } from '@/components/SectionHeading';
import CtaBanner from '@/components/CtaBanner';

export async function generateMetadata() {
  const c = await getContent();
  const h = c.pageHeaders.blog;
  return {
    title: 'Blog — Playbooks for Marketplace Sellers',
    description: h.lead,
    alternates: { canonical: '/blog' },
    openGraph: { url: '/blog', title: `Blog — ${c.brand.name} ${c.brand.sub}`, description: h.lead },
  };
}

export default async function BlogIndex() {
  const [c, posts] = await Promise.all([getContent(), getPosts()]);
  const h = c.pageHeaders.blog;
  return (
    <main id="main">
      <PageHeader eyebrow={h.eyebrow} title={h.title} lead={h.lead} crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
      <section className="section pt-4">
        <div className="wrap">
          {posts.length === 0 ? (
            <p className="text-muted text-center py-20">New articles are on the way — check back soon.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => <BlogCard key={p.slug} post={p} index={i % 3} />)}
            </div>
          )}
        </div>
      </section>
      <section className="pb-20 md:pb-28">
        <div className="wrap"><CtaBanner {...c.ctaBanners.home} brand={c.brand} /></div>
      </section>
    </main>
  );
}
