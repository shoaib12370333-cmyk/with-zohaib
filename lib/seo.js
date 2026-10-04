export function siteUrl() {
  const raw =
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

export const absUrl = (path = '/') => `${siteUrl()}${path.startsWith('/') ? path : `/${path}`}`;

export function slugifyService(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Flat list of every service that has a detail page:
 * { slug, title, description, includes, category }.
 * Home-page overview cards that don't map to a category item get their own page too,
 * with "what's included" borrowed from the closest related content.
 */
export function allServices(content) {
  const out = [];
  const seen = new Set();
  const push = (item, category) => {
    const slug = item.slug || slugifyService(item.title);
    if (!slug || seen.has(slug)) return;
    seen.add(slug);
    out.push({ ...item, slug, category, includes: item.includes || [] });
  };

  for (const cat of content.serviceCategories || []) for (const item of cat.items || []) push(item, cat.title);

  const platformItems = content.serviceCategories?.[0]?.items || [];
  const borrowed = {
    'marketplace-store-setup': platformItems.map((p) => `${p.title} store setup & launch`),
    'growth-and-scaling': content.featureBlock?.bullets || [],
    'one-on-one-coaching': content.coaching?.includes || [],
  };
  for (const item of content.servicesOverview || []) {
    const slug = item.slug || slugifyService(item.title);
    push({ ...item, includes: borrowed[slug] || [] }, 'Core services');
  }
  return out;
}

export function organizationJsonLd(content) {
  const b = content.brand;
  const sameAs = [b.instagram, b.facebook, b.youtube, b.tiktok, b.linkedin].filter((u) => /^https?:/i.test(u || ''));
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${b.name} ${b.sub}`.trim(),
    url: siteUrl(),
    logo: b.avatarUrl || undefined,
    image: b.ogImageUrl || b.avatarUrl || undefined,
    description: content.seo.description,
    email: b.email,
    telephone: b.phoneDisplay,
    founder: { '@type': 'Person', name: content.founder.name },
    areaServed: 'Worldwide',
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function faqJsonLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absUrl(it.path) })),
  };
}
