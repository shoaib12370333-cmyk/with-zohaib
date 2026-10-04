import { getContent } from '@/lib/db';

export default async function manifest() {
  const c = await getContent();
  const icon = c.brand.faviconUrl || c.brand.avatarUrl;
  return {
    name: `${c.brand.name} ${c.brand.sub}`.trim(),
    short_name: c.brand.name,
    description: c.seo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#060912',
    theme_color: '#060912',
    icons: icon ? [{ src: icon, sizes: 'any', type: 'image/png' }] : [],
  };
}
