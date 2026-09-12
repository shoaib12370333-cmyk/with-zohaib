import Icon from '@/components/Icons';
import Faq from '@/components/Faq';
import ContactForm from '@/components/ContactForm';
import Reveal from '@/components/Reveal';
import { waLink as buildWaLink } from '@/lib/links';

export default function ContactContent({ content }) {
  const { brand, contact, faqs, pageHeaders, sectionLabels } = content;
  const waLink = buildWaLink(brand.whatsapp);
  const ph = pageHeaders.contact;
  const sl = sectionLabels.faq;

  return (
    <main>
      <div className="relative bg-ink text-white pt-[7.5rem] md:pt-[9.5rem] overflow-hidden" style={{ paddingBottom: `${(content.layout && content.layout.pageHeader) ?? 4}rem` }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(45% 60% at 90% 0%, rgba(29,148,136,.18), transparent 65%)' }} />
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-10">
          <span className="eyebrow eyebrow-dark">{ph.eyebrow}</span>
          <h1 className="mt-3 max-w-[16em]" style={{ fontSize: 'var(--ts-title, 3rem)' }}>{ph.title}</h1>
          <p className="text-[#C4CADA] text-[1.125rem] max-w-[34em] mt-4">{ph.lead}</p>
        </div>
      </div>

      <section className="py-16 md:py-[5.5rem]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 grid lg:grid-cols-[1.15fr_.85fr] gap-10 items-start">
          <Reveal className="bg-white border border-line rounded-2xl p-8 shadow-sm">
            <ContactForm responseTime={contact?.responseTime} whatsapp={brand.whatsapp} />
          </Reveal>

          <Reveal>
            <div className="bg-paper rounded-2xl p-6 mb-5">
              <div className="flex gap-4 items-start py-[.9rem]">
                <div className="w-10 h-10 rounded-[10px] bg-paper2 text-tealDeep flex items-center justify-center flex-none">
                  <Icon name="mail" className="w-[19px] h-[19px]" />
                </div>
                <div>
                  <div className="font-display font-bold text-[.92rem]">Email</div>
                  <div className="text-slateSoft text-[.88rem] mt-[.15rem]">{brand.email}</div>
                </div>
              </div>
              <div className="flex gap-4 items-start py-[.9rem] border-t border-line">
                <div className="w-10 h-10 rounded-[10px] bg-paper2 text-tealDeep flex items-center justify-center flex-none">
                  <Icon name="phone" className="w-[19px] h-[19px]" />
                </div>
                <div>
                  <div className="font-display font-bold text-[.92rem]">Phone / WhatsApp</div>
                  <a href={waLink} className="text-slateSoft text-[.88rem] mt-[.15rem] block hover:text-ink">{brand.phoneDisplay}</a>
                </div>
              </div>
              <div className="flex gap-4 items-start py-[.9rem] border-t border-line">
                <div className="w-10 h-10 rounded-[10px] bg-paper2 text-tealDeep flex items-center justify-center flex-none">
                  <Icon name="clock" className="w-[19px] h-[19px]" />
                </div>
                <div>
                  <div className="font-display font-bold text-[.92rem]">Response Time</div>
                  <div className="text-slateSoft text-[.88rem] mt-[.15rem]">{contact?.responseTime}</div>
                </div>
              </div>
            </div>
            <div className="bg-paper rounded-2xl p-6">
              <div className="font-display font-bold text-[.92rem] mb-[.9rem]">Follow along</div>
              <div className="flex gap-[.7rem]">
                <a href={brand.instagram || '#'} aria-label="Instagram" className="w-[42px] h-[42px] rounded-full bg-ink text-white flex items-center justify-center hover:bg-teal hover:-translate-y-0.5 transition-all">
                  <Icon name="insta" className="w-[19px] h-[19px]" />
                </a>
                <a href={brand.facebook || '#'} aria-label="Facebook" className="w-[42px] h-[42px] rounded-full bg-ink text-white flex items-center justify-center hover:bg-teal hover:-translate-y-0.5 transition-all">
                  <Icon name="fb" className="w-[19px] h-[19px]" />
                </a>
                <a href={waLink} aria-label="WhatsApp" className="w-[42px] h-[42px] rounded-full bg-ink text-white flex items-center justify-center hover:bg-teal hover:-translate-y-0.5 transition-all">
                  <Icon name="whatsapp" className="w-[19px] h-[19px]" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-[5.5rem]">
        <div className="max-w-[800px] mx-auto px-5 sm:px-10">
          <Reveal className="text-center mb-8">
            <span className="eyebrow">{sl.eyebrow}</span>
            <h2 className="mt-3" style={{ fontSize: 'var(--ts-heading, 2.2rem)' }}>{sl.heading}</h2>
          </Reveal>
          <Reveal>
            <Faq items={faqs} whatsapp={brand.whatsapp} messengerUsername={brand.messengerUsername} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
