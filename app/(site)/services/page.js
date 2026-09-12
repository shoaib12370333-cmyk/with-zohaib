import { getContent } from '@/lib/db';
import ServicesContent from '@/components/pages/ServicesContent';

export const metadata = { title: 'Services — E-Commerce With Zohaib' };

export default async function ServicesPage() {
  const content = await getContent();
  return <ServicesContent content={content} />;
}
