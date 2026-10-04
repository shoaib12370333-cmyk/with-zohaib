import { getContent, getPosts } from '@/lib/db';
import { faqJsonLd } from '@/lib/seo';
import HomeContent from '@/components/pages/HomeContent';

export default async function HomePage() {
  const [content, posts] = await Promise.all([getContent(), getPosts()]);
  return (
    <>
      <HomeContent content={content} posts={posts} />
      {content.visibility?.faq !== false && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(content.faqs)) }} />
      )}
    </>
  );
}
