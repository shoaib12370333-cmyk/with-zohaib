import { getContent, getPosts } from '@/lib/db';
import BlogCard from '@/components/BlogCard';
import { PageHeader } from '@/components/SectionHeading';
import CtaBanner from '@/components/CtaBanner';
import Reveal from '@/components/Reveal';

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
      <section className="section">
        <div className="wrap">
          {posts.length === 0 ? (
            <Reveal as="p" className="py-20 text-center text-muted">New articles are on the way — check back soon.</Reveal>
          ) : (
            // each BlogCard staggers itself by its column (index % 3), so a new row cascades left → right
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => <BlogCard key={p.slug} post={p} index={i % 3} />)}
            </div>
          )}
        </div>
      </section>
      <section className="section bg-bg2">
        <div className="wrap"><CtaBanner {...c.ctaBanners.home} brand={c.brand} /></div>
      </section>
    </main>
  );
}
