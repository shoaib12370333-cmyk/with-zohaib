import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContent } from '@/lib/db';
import { allServices, absUrl, breadcrumbJsonLd } from '@/lib/seo';
import Icon from '@/components/Icons';
import Reveal from '@/components/Reveal';
import CtaBanner from '@/components/CtaBanner';
import ProcessSteps from '@/components/ProcessSteps';
import { PageHeader, SectionHeading } from '@/components/SectionHeading';

export async function generateStaticParams() {
  const c = await getContent();
  return allServices(c).map((s) => ({ slug: s.slug }));
}

async function find(slug) {
  const c = await getContent();
  const services = allServices(c);
  return { c, services, service: services.find((s) => s.slug === slug) };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { c, service } = await find(slug);
  if (!service) return {};
  const title = `${service.title} — ${c.brand.name} ${c.brand.sub}`;
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { url: `/services/${service.slug}`, title, description: service.description },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const { c, services, service } = await find(slug);
  if (!service) notFound();

  const related = services.filter((s) => s.slug !== service.slug && s.category === service.category).slice(0, 3);
  const others = related.length ? related : services.filter((s) => s.slug !== service.slug).slice(0, 3);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: service.description,
      url: absUrl(`/services/${service.slug}`),
      provider: { '@type': 'ProfessionalService', name: `${c.brand.name} ${c.brand.sub}`, url: absUrl('/') },
      areaServed: 'Worldwide',
    },
    breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: service.title, path: `/services/${service.slug}` }]),
  ];

  return (
    <main id="main">
      <PageHeader
        eyebrow={service.category}
        title={service.title}
        lead={service.description}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: service.title }]}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href={`/contact?interest=${encodeURIComponent(service.title)}`} className="btn btn-primary">Get started <Icon name="arrow" className="w-4 h-4" /></Link>
          <Link href="/services" className="btn btn-ghost">All services</Link>
        </div>
      </PageHeader>

      {service.includes.length > 0 && (
        <section className="section pt-6">
          <div className="wrap">
            <SectionHeading eyebrow="What's included" heading={`Everything in ${service.title}`} />
            <div className="grid gap-4 sm:grid-cols-2">
              {service.includes.map((inc, i) => (
                <Reveal key={inc} delay={(i % 2) * 80}>
                  <div className="card spot flex items-center gap-4 p-6">
                    <span className="w-10 h-10 flex-none rounded-xl bg-teal/15 text-teal grid place-items-center"><Icon name="check" className="w-5 h-5" /></span>
                    <span className="font-display font-medium">{inc}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section bg-bg2/60 border-y border-edge/10">
        <div className="wrap">
          <SectionHeading {...c.sectionLabels.howItWorks} />
          <ProcessSteps steps={c.process} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHeading eyebrow="Keep exploring" heading="Related services" />
          <div className="grid gap-4 md:grid-cols-3">
            {others.map((s, i) => (
              <Reveal key={s.slug} delay={i * 90}>
                <Link href={`/services/${s.slug}`} className="card card-hover spot group h-full p-6 flex flex-col">
                  <h3 className="text-[1.2rem]">{s.title}</h3>
                  <p className="mt-2 text-muted text-[.95rem] leading-relaxed flex-1">{s.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-gold">Learn more <Icon name="arrow" className="w-4 h-4 transition-transform group-hover:translate-x-1.5" /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="wrap"><CtaBanner {...c.ctaBanners.services} brand={c.brand} /></div>
      </section>

      {jsonLd.map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />)}
    </main>
  );
}
