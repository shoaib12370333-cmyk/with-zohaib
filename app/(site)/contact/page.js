import { getContent } from '@/lib/db';
import ContactContent from '@/components/pages/ContactContent';

export const metadata = { title: 'Contact Us — E-Commerce With Zohaib' };

export default async function ContactPage() {
  const content = await getContent();
  return <ContactContent content={content} />;
}
