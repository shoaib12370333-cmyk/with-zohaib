'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from './Icons';
import PlatformDashboard from './PlatformDashboard';

export default function Hero({ hero, platforms, founder, brandAvatar, showFounderStrip, spacing = 4 }) {
  const words = platforms && platforms.length ? platforms.map((p) => p.name) : ['eBay'];
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle | out | in
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion.current || words.length < 2) return;
    const interval = setInterval(() => {
      setPhase('out');
      setTimeout(() => {
        setIdx((i) => (i + 1) % words.length);
        setPhase('in');
        setTimeout(() => setPhase('idle'), 500);
      }, 500);
    }, 2400);
    return () => clearInterval(interval);
  }, [words.length]);

  const word = words[idx];
  const small = word.length > 6;

  return (
    <div className="relative pt-[7.5rem] md:pt-[10.5rem] bg-ink text-white overflow-hidden" style={{ paddingBottom: `${spacing}rem` }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 85% 8%, rgba(226,166,61,.16), transparent 60%), radial-gradient(55% 45% at 8% 92%, rgba(29,148,136,.18), transparent 60%)',
        }}
      />
      <div className="relative max-w-[1200px] mx-auto px-5 sm:px-10 grid lg:grid-cols-[1.05fr_.95fr] gap-10 items-start">
        <div>
          <span className="eyebrow eyebrow-dark">{hero.eyebrow}</span>
          <h1 className="mt-4 -tracking-[.015em] leading-[1.05]" style={{ fontSize: 'clamp(2.5rem, 1.6rem + 4vw, var(--ts-hero, 4.6rem))' }}>
            {hero.headlinePrefix}
            <br />
            <span className="rotate-wrap">
              <span className={`rotate-word ${phase === 'out' ? 'out' : phase === 'in' ? 'in' : ''} ${small ? 'small' : ''}`}>
                {word}
              </span>
            </span>{' '}
            {hero.headlineSuffix}
          </h1>
          <p className="font-body text-[1.125rem] text-[#C4CADA] max-w-[34em] mt-5">{hero.lead}</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-gold hover:bg-goldDeep text-ink font-display font-bold text-base px-8 py-[1.05em] rounded-full shadow transition-all hover:-translate-y-0.5">
              {hero.ctaPrimary} <Icon name="arrow" className="w-4 h-4" />
            </Link>
            <Link href="/services" className="inline-flex items-center gap-2 border-[1.5px] border-white/35 text-white font-display font-bold text-base px-8 py-[1.05em] rounded-full transition-all hover:bg-white hover:text-ink hover:-translate-y-0.5">
              {hero.ctaSecondary}
            </Link>
          </div>
          <div className="flex flex-wrap gap-5 mt-6">
            {(hero.trust || []).map((t) => (
              <span key={t} className="flex items-center gap-[.45em] font-mono-eyebrow text-[.78rem] text-[#9FA8BA]">
                <Icon name="check" className="w-[14px] h-[14px] text-teal" /> {t}
              </span>
            ))}
          </div>
          {showFounderStrip && founder?.name && (
            <div className="flex items-center gap-[.85rem] mt-6 pt-6 border-t border-lineDark">
              <span className="w-[46px] h-[46px] rounded-full overflow-hidden border-2 border-gold flex-none bg-ink2">
                {brandAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brandAvatar} alt={founder.name} className="w-full h-full object-cover" />
                ) : null}
              </span>
              <div>
                <div className="font-display font-bold text-[.95rem] text-white">{founder.name}</div>
                <div className="font-mono-eyebrow text-[.72rem] text-[#9FA8BA] mt-[.1rem]">{founder.role}</div>
              </div>
            </div>
          )}
        </div>

        <div className="relative min-w-0">
          {hero.sideImageUrl ? (
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-cardLg aspect-[4/3] sm:aspect-[4/3.6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero.sideImageUrl}
                  alt=""
                  className="w-full h-full"
                  style={{ objectFit: hero.sideImageFit || 'cover', objectPosition: hero.sideImagePosition || 'top' }}
                  draggable="false"
                />
              </div>
              <div className="mt-6 lg:mt-[-4.5rem] lg:mr-[-1.5rem] lg:ml-16 relative">
                <PlatformDashboard platforms={platforms} />
              </div>
            </div>
          ) : (
            <PlatformDashboard platforms={platforms} />
          )}
        </div>
      </div>
    </div>
  );
}
