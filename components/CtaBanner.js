import Link from 'next/link';
import Icon from './Icons';
import Reveal, { Words } from './Reveal';
import { waLink } from '@/lib/links';

// The original ink-gradient closing banner. Motion: the card zooms up into place,
// the gold glow at its top is wiped in and then keeps breathing (.glow-cta), the
// headline slides up word by word, then the copy and buttons follow in sequence.
// The primary button follows the pointer slightly (data-magnetic).
export default function CtaBanner({ eyebrow, title, description, brand, ctaLabel, href = '/contact' }) {
  const label = ctaLabel || brand?.bookCallLabel || 'Book Free Call';

  return (
    <Reveal from="zoom">
      {/* gradient via inline style: `.dz` sets a background shorthand that would otherwise reset a gradient utility */}
      <div
        className="dz relative overflow-hidden rounded-[20px] px-6 py-12 text-center sm:px-8 sm:py-16"
        style={{ backgroundImage: 'linear-gradient(135deg, #0A0F1E, #131C30)' }}
      >
        <Reveal from="clip" delay={150} className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="glow-cta" />
        </Reveal>

        <div className="relative">
          <span className="eyebrow">{eyebrow}</span>
          <Words as="h2" delay={150} className="mx-auto mt-3 max-w-[16em] text-[2.1rem] sm:text-[2.6rem]">
            {title}
          </Words>
          {description && (
            <Reveal as="p" delay={420} className="lead mx-auto mt-4 max-w-[56ch]">
              {description}
            </Reveal>
          )}
          <Reveal delay={560} className="mt-8 flex flex-wrap justify-center gap-3">
            {/* magnetic wrapper keeps the pointer-follow separate from the button's own hover lift */}
            <span data-magnetic="0.25" className="inline-block">
              <Link href={href} className="btn btn-primary focus-visible:rounded-full">
                {label} <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </span>
            {brand?.whatsapp && (
              <a href={waLink(brand.whatsapp, "Hi, I'd like a free strategy call.")} target="_blank" rel="noopener noreferrer" className="btn btn-ghost focus-visible:rounded-full">
                <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp us
              </a>
            )}
          </Reveal>
        </div>
      </div>
    </Reveal>
  );
}
