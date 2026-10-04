import { getContent } from '@/lib/db';
import AboutContent from '@/components/pages/AboutContent';

export async function generateMetadata() {
  const c = await getContent();
  return {
    title: 'About Us',
    description: c.pageHeaders.about.lead,
    alternates: { canonical: '/about' },
    openGraph: { url: '/about', title: `About — ${c.brand.name} ${c.brand.sub}`, description: c.pageHeaders.about.lead },
  };
}

export default async function AboutPage() {
  return <AboutContent content={await getContent()} />;
}
