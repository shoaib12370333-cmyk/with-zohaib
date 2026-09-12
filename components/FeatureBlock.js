import Link from 'next/link';
import Icon from './Icons';
import Reveal from './Reveal';

export default function FeatureBlock({ data }) {
  if (!data) return null;
  return (
    <Reveal>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="text-[1.8rem] sm:text-[2.2rem] mt-[.6rem]">{data.title}</h2>
          <p className="text-slateSoft text-[1.125rem] mt-4">{data.description}</p>
          <Link href="/contact" className="inline-flex items-center gap-[.4em] font-mono-eyebrow text-[.9rem] font-medium text-tealDeep mt-6 group">
            {data.ctaLabel} <Icon name="arrow" className="w-[15px] h-[15px] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="relative bg-ink rounded-[20px] p-8 text-white overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(60% 60% at 100% 0%, rgba(226,166,61,.18), transparent 70%)' }}
          />
          <span className="relative inline-block font-mono-eyebrow text-[.7rem] tracking-[.1em] text-gold border border-gold/40 px-[.9em] py-[.4em] rounded-full">
            {data.tag}
          </span>
          <div className="relative font-display font-extrabold text-[3rem] sm:text-[4rem] lg:text-[5rem] leading-none mt-4">
            {data.bigNum}
          </div>
          <p className="relative text-[#B9C0D1] mt-3 max-w-[26em]">{data.caption}</p>
        </div>
      </div>
    </Reveal>
  );
}
