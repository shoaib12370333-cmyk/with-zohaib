import { getContent } from '@/lib/db';
import ContactContent from '@/components/pages/ContactContent';

export async function generateMetadata() {
  const c = await getContent();
  return {
    title: 'Contact — Book a Free Strategy Call',
    description: c.pageHeaders.contact.lead,
    alternates: { canonical: '/contact' },
    openGraph: { url: '/contact', title: `Contact — ${c.brand.name} ${c.brand.sub}`, description: c.pageHeaders.contact.lead },
  };
}

export default async function ContactPage() {
  return <ContactContent content={await getContent()} />;
}
