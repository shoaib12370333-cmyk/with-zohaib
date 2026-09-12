import { getContent } from '@/lib/db';
import HomeContent from '@/components/pages/HomeContent';

export default async function HomePage() {
  const content = await getContent();
  return <HomeContent content={content} />;
}
