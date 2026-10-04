import Link from 'next/link';
import Icon from './Icons';
import { waLink } from '@/lib/links';
import Reveal from './Reveal';

export default function CtaBanner({ eyebrow, title, description, brand }) {
  return (
    <Reveal from="zoom" className="relative overflow-hidden rounded-[2rem] border border-gold/25 p-8 sm:p-14 text-center noise" style={{ background: 'linear-gradient(135deg, rgb(var(--surface2)), rgb(var(--surface)))' }}>
      <div className="aurora">
        <i className="w-[32rem] h-[32rem] bg-gold/30 -top-60 -left-20" />
        <i className="w-[28rem] h-[28rem] bg-violet/25 -bottom-60 right-0" style={{ animationDelay: '-8s' }} />
      </div>
      <div className="grid-bg opacity-60" />
      <div className="relative max-w-[720px] mx-auto">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="h-section mt-4">{title}</h2>
        {description && <p className="lead mt-5 max-w-[56ch] mx-auto">{description}</p>}
        <div className="mt-9 flex flex-wrap gap-3 justify-center">
          <Link href="/contact" className="btn btn-primary">{brand?.bookCallLabel || 'Book Free Call'} <Icon name="arrow" className="w-4 h-4" /></Link>
          {brand?.whatsapp && (
            <a href={waLink(brand.whatsapp, "Hi, I'd like a free strategy call.")} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <Icon name="whatsapp" className="w-4 h-4" /> WhatsApp us
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
}
