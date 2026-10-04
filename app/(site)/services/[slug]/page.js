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
          {/* magnetic wrapper keeps the pointer-follow separate from the button's own hover lift */}
          <span data-magnetic="0.25" className="inline-block">
            <Link href={`/contact?interest=${encodeURIComponent(service.title)}`} className="btn btn-primary">Get started <Icon name="arrow" className="h-4 w-4" /></Link>
          </span>
          <Link href="/services" className="btn btn-ghost">All services</Link>
        </div>
      </PageHeader>

      {service.includes.length > 0 && (
        <section className="section">
          <div className="wrap">
            <SectionHeading eyebrow="What's included" heading={`Everything in ${service.title}`} />
            <Reveal from="none" stagger={80} className="grid gap-6 sm:grid-cols-2">
              {service.includes.map((inc, i) => (
                <Reveal key={inc} className="h-full">
                  <div className="card card-hover spot flex h-full items-center gap-4 p-5">
                    <span className="icon-tile h-10 w-10"><Icon name="check" className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1 font-display font-semibold leading-snug">{inc}</span>
                    <span aria-hidden="true" className="flex-none font-mono text-xs text-faint">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                </Reveal>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <section className="section bg-bg2">
        <div className="wrap">
          <SectionHeading {...c.sectionLabels.howItWorks} />
          <ProcessSteps steps={c.process} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHeading eyebrow="Keep exploring" heading="Related services" />
          <Reveal from="none" stagger={90} className="grid gap-6 md:grid-cols-3">
            {others.map((s) => (
              <Reveal key={s.slug} className="h-full">
                <Link href={`/services/${s.slug}`} className="card card-hover spot group relative flex h-full flex-col overflow-hidden p-6">
                  <span className="icon-tile mb-4"><Icon name={s.icon || 'layers'} className="h-[22px] w-[22px]" /></span>
                  <h3 className="text-[1.2rem]">{s.title}</h3>
                  <p className="mt-2 flex-1 text-[.95rem] leading-relaxed text-muted">{s.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-mono text-[.74rem] font-medium uppercase tracking-[.12em] text-[rgb(var(--eyebrow))]">
                    Learn more <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                  {/* gold bar that draws along the bottom edge on hover */}
                  <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-x-100" />
                </Link>
              </Reveal>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section bg-bg2">
        <div className="wrap"><CtaBanner {...c.ctaBanners.services} brand={c.brand} /></div>
      </section>

      {jsonLd.map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />)}
    </main>
  );
}
