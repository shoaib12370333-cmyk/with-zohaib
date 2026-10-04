import { getContent } from '@/lib/db';
import ServicesContent from '@/components/pages/ServicesContent';

export async function generateMetadata() {
  const c = await getContent();
  return {
    title: 'Services',
    description: c.pageHeaders.services.lead,
    alternates: { canonical: '/services' },
    openGraph: { url: '/services', title: `Services — ${c.brand.name} ${c.brand.sub}`, description: c.pageHeaders.services.lead },
  };
}

export default async function ServicesPage() {
  return <ServicesContent content={await getContent()} />;
}
