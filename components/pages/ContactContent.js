import Icon from '@/components/Icons';
import ContactForm from '@/components/ContactForm';
import Faq from '@/components/Faq';
import Reveal from '@/components/Reveal';
import { PageHeader, SectionHeading } from '@/components/SectionHeading';
import { waLink } from '@/lib/links';

// Only real web links are shown as social buttons (admin fields may be empty or hold junk).
const SOCIALS = [
  ['instagram', 'insta', 'Instagram'],
  ['facebook', 'fb', 'Facebook'],
  ['youtube', 'youtube', 'YouTube'],
  ['tiktok', 'tiktok', 'TikTok'],
  ['linkedin', 'linkedin', 'LinkedIn'],
];

const SOCIAL_BTN =
  'grid h-[42px] w-[42px] place-items-center rounded-full bg-ink text-white transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-1 hover:scale-105 hover:bg-teal hover:shadow-[0_10px_22px_-8px_rgba(29,148,136,.65)]';

// Contact page in the original classic look: ink page hero, white form card beside paper
// info cards, then the FAQ on paper. Motion: the card fades in while its gold top edge
// draws across and every field slides up in turn (see ContactForm), info rows glide in
// from the right, icon tiles turn gold on hover and the social buttons pop in.
export default function ContactContent({ content }) {
  const { brand, contact, faqs, pageHeaders, sectionLabels } = content;
  const h = pageHeaders.contact;
  const faqLabels = sectionLabels?.faq || {};

  const channels = [
    brand.email && { icon: 'mail', label: 'Email', value: brand.email, href: `mailto:${brand.email}`, note: 'For detailed questions' },
    brand.whatsapp && {
      icon: 'whatsapp',
      label: 'WhatsApp',
      value: brand.phoneDisplay || `+${brand.whatsapp}`,
      href: waLink(brand.whatsapp, "Hi, I'd like a free strategy call."),
      note: 'Fastest reply',
      external: true,
    },
    brand.bookingUrl && { icon: 'calendar', label: 'Book a time', value: 'Pick a slot that suits you', href: brand.bookingUrl, note: 'Opens calendar', external: true },
    { icon: 'clock', label: 'Response time', value: contact?.responseTime, note: contact?.hours },
  ].filter((c) => c && c.value);

  const socials = SOCIALS.filter(([key]) => /^https?:/i.test(brand[key] || '')).map(([key, icon, label]) => ({ href: brand[key], icon, label }));
  if (brand.whatsapp) socials.push({ href: waLink(brand.whatsapp), icon: 'whatsapp', label: 'WhatsApp' });

  return (
    <main id="main">
      <PageHeader eyebrow={h.eyebrow} title={h.title} lead={h.lead} crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />

      <section className="section">
        <div className="wrap grid items-start gap-10 lg:grid-cols-[1.15fr_.85fr]">
          <Reveal from="fade" className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
            <Reveal from="line" delay={150} className="absolute inset-x-0 top-0 h-[3px] bg-gold" aria-hidden="true" />
            <h2 className="text-[1.6rem]">Send us a message</h2>
            <p className="mb-8 mt-2 text-muted">No pressure, no scripts — just a real conversation about your store.</p>
            <ContactForm responseTime={contact?.responseTime} whatsapp={brand.whatsapp} />
          </Reveal>

          <div className="space-y-5 lg:sticky lg:top-28">
            <Reveal from="fade" className="rounded-2xl bg-bg2 px-6 py-2">
              <Reveal as="ul" from="none" stagger={90}>
                {channels.map((c, i) => {
                  const inner = (
                    <>
                      <span className="icon-tile h-10 w-10"><Icon name={c.icon} className="h-[19px] w-[19px]" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[.92rem] font-bold">{c.label}</span>
                        <span className="mt-[.15rem] block break-words text-[.9rem] text-muted transition-colors duration-300 group-hover:text-fg">{c.value}</span>
                        {c.note && <span className="mt-0.5 block text-xs text-faint">{c.note}</span>}
                      </span>
                      {c.href && (
                        <Icon name="upright" className="mt-1 h-4 w-4 flex-none -translate-x-1 text-faint opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-gold group-hover:opacity-100" />
                      )}
                    </>
                  );
                  return (
                    <Reveal as="li" from="right" key={c.label} className={i ? 'border-t border-edge/10' : ''}>
                      {c.href ? (
                        <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="group flex items-start gap-4 py-[.95rem]">{inner}</a>
                      ) : (
                        <div className="group flex items-start gap-4 py-[.95rem]">{inner}</div>
                      )}
                    </Reveal>
                  );
                })}
              </Reveal>
            </Reveal>

            {socials.length > 0 && (
              <Reveal delay={120} className="rounded-2xl bg-bg2 p-6">
                <div className="mb-[.9rem] font-display text-[.92rem] font-bold">Follow along</div>
                <Reveal from="none" stagger={70} className="flex flex-wrap gap-[.7rem]">
                  {socials.map((s) => (
                    // The pop-in lives on the wrapper so the button's own hover lift can still move it.
                    <Reveal as="span" from="zoom" key={s.label} className="inline-block">
                      <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className={SOCIAL_BTN}>
                        <Icon name={s.icon} className="h-[19px] w-[19px]" />
                      </a>
                    </Reveal>
                  ))}
                </Reveal>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {Array.isArray(faqs) && faqs.length > 0 && (
        <section className="section bg-bg2">
          <div className="wrap">
            <SectionHeading center eyebrow={faqLabels.eyebrow || 'Common Questions'} heading={faqLabels.heading || 'Before you reach out.'} />
            <Faq items={faqs} whatsapp={brand.whatsapp} messengerUsername={brand.messengerUsername} />
          </div>
        </section>
      )}
    </main>
  );
}
