import Icon from './Icons';
import Reveal from './Reveal';
import { waLink, messengerLink } from '@/lib/links';

const ASK = 'Hi, I was reading the FAQs on your website. I need some guidance.';

// The original accordion: hairline rows, bold Archivo questions, a round plus that
// turns into a cross. Native <details> (name="faq" = only one open at a time); the
// height animation lives in globals.css (.faq-body). Extra motion here: rows stagger
// in, the question tints and a gold line draws under the row on hover / when open,
// and the answer text eases up as the row opens. Like the original, the first
// question starts open (pass defaultOpenFirst={false} to start with all closed).
export default function Faq({ items = [], whatsapp, messengerUsername, defaultOpenFirst = true }) {
  const wa = whatsapp ? waLink(whatsapp, ASK) : null;
  const fb = messengerUsername ? messengerLink(messengerUsername, ASK) : null;

  return (
    <div className="mx-auto max-w-[820px]">
      <Reveal from="none" stagger={70}>
        {(items || []).map((item, i) => (
          <Reveal key={`${item.q}-${i}`}>
            {/* gold line under the row: drawn with the row's own background (background-size 0 → 100%) on hover and while open.
                A child <span> would not work: a closed <details> does not render its non-summary children. */}
            <details
              className="group/d border-b border-edge/[.12] bg-gradient-to-r from-gold to-gold bg-origin-border bg-bottom bg-no-repeat [background-size:0%_1.5px] transition-[background-size] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] hover:[background-size:100%_1.5px] open:[background-size:100%_1.5px]"
              name="faq"
              open={defaultOpenFirst && i === 0}
            >
              <summary className="flex items-center justify-between gap-4 py-[1.3rem]">
                <h3 className="font-display text-[1.02rem] font-bold leading-snug tracking-normal transition-colors duration-300 group-hover/d:text-[rgb(var(--eyebrow))]">
                  {item.q}
                </h3>
                <span className="plus grid h-[26px] w-[26px] flex-none place-items-center rounded-full border-[1.5px] border-edge/20">
                  <Icon name="plus" className="h-3 w-3" />
                </span>
              </summary>
              <div className="faq-body">
                <div>
                  <p className="max-w-[60em] translate-y-1 pb-[1.4rem] text-[.97rem] leading-relaxed text-muted opacity-0 transition-[opacity,transform] delay-100 duration-500 group-open/d:translate-y-0 group-open/d:opacity-100">
                    {item.a}
                  </p>
                </div>
              </div>
            </details>
          </Reveal>
        ))}
      </Reveal>

      {(wa || fb) && (
        <Reveal className="pt-10 text-center">
          <p className="mb-4 font-display text-[1.05rem] font-semibold">Still have questions?</p>
          <div className="flex flex-wrap justify-center gap-3">
            {wa && (
              // data-magnetic lives on a wrapper so it doesn't fight the button's own hover lift
              <span data-magnetic="0.2" className="inline-block">
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary px-6 py-3 text-sm focus-visible:rounded-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/whatsapp-icon.png" alt="" className="h-5 w-5 rounded-full" /> Ask on WhatsApp
                </a>
              </span>
            )}
            {fb && (
              <span data-magnetic="0.2" className="inline-block">
                <a href={fb} target="_blank" rel="noopener noreferrer" className="btn btn-ghost border-fg px-6 py-3 text-sm focus-visible:rounded-full">
                  <Icon name="fb" className="h-4 w-4" /> Message us on Facebook
                </a>
              </span>
            )}
          </div>
        </Reveal>
      )}
    </div>
  );
}
