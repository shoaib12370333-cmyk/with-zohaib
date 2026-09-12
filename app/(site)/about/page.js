import { getContent } from '@/lib/db';
import AboutContent from '@/components/pages/AboutContent';

export const metadata = { title: 'About Us — E-Commerce With Zohaib' };

export default async function AboutPage() {
  const content = await getContent();
  return <AboutContent content={content} />;
}
