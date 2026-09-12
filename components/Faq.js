import Icon from './Icons';
import { waLink, messengerLink } from '@/lib/links';

export default function Faq({ items, whatsapp, messengerUsername }) {
  const wa = whatsapp ? waLink(whatsapp, "Hi, I was reading the FAQs on your website. I need some guidance.") : null;
  const fb = messengerUsername ? messengerLink(messengerUsername, "Hi, I was reading the FAQs on your website. I need some guidance.") : null;

  return (
    <div>
      {(items || []).map((item, i) => (
        <details key={i} className="faq-item border-b border-line" open={i === 0}>
          <summary className="flex items-center justify-between py-[1.3rem] font-display font-bold text-[1.02rem] gap-4">
            {item.q}
            <span className="chev flex-none w-[22px] h-[22px] rounded-full border-[1.5px] border-line flex items-center justify-center">
              <Icon name="plus" className="w-[11px] h-[11px]" />
            </span>
          </summary>
          <p className="text-slateSoft pb-[1.4rem] max-w-[60em] text-[.97rem]">{item.a}</p>
        </details>
      ))}

      {(wa || fb) && (
        <div className="text-center pt-8">
          <p className="font-display font-semibold text-[1.05rem] mb-4">Still have questions?</p>
          <div className="flex flex-wrap justify-center gap-3">
            {wa && (
              <a href={wa} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-gold hover:bg-goldDeep text-ink font-display font-bold text-sm px-6 py-3 rounded-full transition-all hover:-translate-y-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/whatsapp-icon.png" alt="" className="w-5 h-5 rounded-full" /> Ask on WhatsApp
              </a>
            )}
            {fb && (
              <a href={fb} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border-[1.5px] border-ink text-ink font-display font-bold text-sm px-6 py-3 rounded-full transition-all hover:bg-ink hover:text-white">
                <Icon name="fb" className="w-4 h-4" /> Message us on Facebook
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
