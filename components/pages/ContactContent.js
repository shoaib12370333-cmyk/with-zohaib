import Icon from '@/components/Icons';
import ContactForm from '@/components/ContactForm';
import Reveal from '@/components/Reveal';
import { PageHeader } from '@/components/SectionHeading';
import { waLink } from '@/lib/links';

export default function ContactContent({ content }) {
  const { brand, contact, pageHeaders } = content;
  const h = pageHeaders.contact;

  const channels = [
    brand.whatsapp && { icon: 'whatsapp', label: 'WhatsApp', value: brand.phoneDisplay || `+${brand.whatsapp}`, href: waLink(brand.whatsapp, "Hi, I'd like a free strategy call."), note: 'Fastest reply' },
    brand.email && { icon: 'mail', label: 'Email', value: brand.email, href: `mailto:${brand.email}`, note: 'For detailed questions' },
    brand.bookingUrl && { icon: 'calendar', label: 'Book a time', value: 'Pick a slot that suits you', href: brand.bookingUrl, note: 'Opens calendar', external: true },
    { icon: 'clock', label: 'Response time', value: contact.responseTime, note: contact.hours },
  ].filter(Boolean);

  return (
    <main id="main">
      <PageHeader eyebrow={h.eyebrow} title={h.title} lead={h.lead} crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />

      <section className="section pt-4">
        <div className="wrap grid lg:grid-cols-[.8fr_1.2fr] gap-8 lg:gap-12 items-start">
          <div className="space-y-4">
            {channels.map((c, i) => {
              const Inner = (
                <>
                  <span className="w-12 h-12 flex-none rounded-2xl bg-gold/12 text-gold border border-gold/25 grid place-items-center group-hover:scale-110 transition-transform"><Icon name={c.icon} className="w-5 h-5" /></span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[.66rem] tracking-[.16em] uppercase text-faint">{c.label}</span>
                    <span className="block font-display font-semibold mt-0.5 break-words">{c.value}</span>
                    {c.note && <span className="block text-xs text-muted mt-0.5">{c.note}</span>}
                  </span>
                </>
              );
              return (
                <Reveal key={c.label} delay={i * 80}>
                  {c.href ? (
                    <a href={c.href} {...(c.external || c.icon === 'whatsapp' ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="card card-hover group flex items-center gap-4 p-5">{Inner}</a>
                  ) : (
                    <div className="card group flex items-center gap-4 p-5">{Inner}</div>
                  )}
                </Reveal>
              );
            })}
          </div>

          <Reveal from="right" className="card p-6 sm:p-10">
            <h2 className="text-[1.6rem]">Send us a message</h2>
            <p className="text-muted mt-2 mb-8">No pressure, no scripts — just a real conversation about your store.</p>
            <ContactForm responseTime={contact.responseTime} whatsapp={brand.whatsapp} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
