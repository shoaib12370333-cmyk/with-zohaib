import Link from 'next/link';
import Icon from './Icons';
import Reveal from './Reveal';

export default function CtaBanner({ eyebrow, title, description, ctaLabel = 'Book a Free Strategy Call', href = '/contact' }) {
  return (
    <Reveal>
      <div className="relative bg-gradient-to-br from-ink to-ink2 text-white rounded-[20px] px-6 sm:px-8 py-10 sm:py-16 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(50% 80% at 50% 0%, rgba(226,166,61,.15), transparent 70%)' }}
        />
        <span className="relative eyebrow eyebrow-dark">{eyebrow}</span>
        <h2 className="relative text-[2.1rem] sm:text-[2.6rem] max-w-[16em] mx-auto mt-3">{title}</h2>
        {description && <p className="relative text-[#B9C0D1] mt-4">{description}</p>}
        <div className="relative flex justify-center mt-8">
          <Link href={href} className="inline-flex items-center gap-2 bg-gold hover:bg-goldDeep text-ink font-display font-bold text-base px-8 py-[1.05em] rounded-full transition-all hover:-translate-y-0.5">
            {ctaLabel} <Icon name="arrow" className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
