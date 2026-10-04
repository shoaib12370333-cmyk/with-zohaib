import { getContent, getPosts } from '@/lib/db';
import { allServices, absUrl } from '@/lib/seo';

export const revalidate = 3600;

export default async function sitemap() {
  const [c, posts] = await Promise.all([getContent(), getPosts()]);
  const now = new Date();
  const page = (path, priority, changeFrequency = 'monthly', lastModified = now) => ({ url: absUrl(path), lastModified, changeFrequency, priority });

  return [
    page('/', 1, 'weekly'),
    page('/services', 0.9),
    page('/about', 0.7),
    page('/contact', 0.8),
    page('/blog', 0.8, 'weekly'),
    page('/privacy', 0.2, 'yearly'),
    ...allServices(c).map((s) => page(`/services/${s.slug}`, 0.7)),
    ...posts.map((p) => page(`/blog/${p.slug}`, 0.6, 'monthly', new Date(p.updated_at || p.published_at))),
  ];
}
