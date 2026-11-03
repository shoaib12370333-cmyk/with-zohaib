import { notFound } from 'next/navigation';
import { getContent } from '@/lib/db';
import { cleanReviews } from '@/lib/reviews';
import FiverrReviews from '@/components/FiverrReviews';
import CtaBanner from '@/components/CtaBanner';
import { PageHeader } from '@/components/SectionHeading';

export async function generateMetadata() {
  const c = await getContent();
  const h = c.pageHeaders.reviews;
  return {
    title: 'Client Reviews',
    description: h.lead,
    alternates: { canonical: '/reviews' },
    openGraph: { url: '/reviews', title: `Client Reviews — ${c.brand.name} ${c.brand.sub}`, description: h.lead },
  };
}

export default async function ReviewsPage() {
  const c = await getContent();
  const reviews = cleanReviews(c.reviews);
  if (!reviews.length) notFound(); // nothing to show until real reviews are added in the admin
  const h = c.pageHeaders.reviews;

  return (
    <main id="main">
      <PageHeader eyebrow={h.eyebrow} title={h.title} lead={h.lead} crumbs={[{ label: 'Home', href: '/' }, { label: 'Reviews' }]} />
      <section className="section">
        <div className="wrap"><FiverrReviews reviews={reviews} fiverr={c.fiverr} brand={c.brand} /></div>
      </section>
      <section className="section bg-bg2">
        <div className="wrap"><CtaBanner {...c.ctaBanners.home} brand={c.brand} /></div>
      </section>
    </main>
  );
}
