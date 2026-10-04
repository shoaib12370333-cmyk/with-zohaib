'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from './Icons';
import PlatformDashboard from './PlatformDashboard';

const CYCLE_MS = 2600; // one platform name per cycle
const SWAP_MS = 560; // ≈ the .rotator transition, so the old word is gone before the new one rises

// Hero-only keyframes. Pure CSS (no JS needed), so the entrance also plays with
// scripts disabled; prefers-reduced-motion is collapsed by the global rule.
const HERO_CSS = `
.hero-line{display:block;overflow:hidden;padding:.06em 0 .14em;margin:-.06em 0 -.14em}
.hero-line>span{display:block;transform-origin:left bottom;animation:heroLine 1.05s var(--ease) both;animation-delay:var(--d,0ms)}
.hero-card{animation:heroCard 1.15s var(--ease) both;animation-delay:var(--d,0ms)}
.hero-wipe{animation:heroWipe 1.25s var(--ease) both;animation-delay:var(--d,0ms)}
.hero-zoom{animation:heroZoom 1.7s var(--ease) both;animation-delay:var(--d,0ms)}
@keyframes heroLine{from{transform:translate3d(0,112%,0) rotate(2.5deg)}to{transform:none}}
@keyframes heroCard{from{opacity:0;transform:translate3d(48px,28px,0) scale(.95)}to{opacity:1;transform:none}}
@keyframes heroWipe{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(-60px)}}
@keyframes heroZoom{from{transform:scale(1.14)}to{transform:none}}
`;

// The rotating platform word. The old word slides up out of a mask and the next
// one rises into it; an invisible copy of the longest word reserves the width so
// the headline never reflows between swaps.
function Rotator({ words }) {
  const [idx, setIdx] = useState(0);
  const [state, setState] = useState('in'); // in | out | next

  useEffect(() => {
    if (words.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let swap = 0;
    let r1 = 0;
    let r2 = 0;
    const id = setInterval(() => {
      setState('out');
      swap = setTimeout(() => {
        setIdx((i) => (i + 1) % words.length);
        setState('next'); // park the new word below the mask (no transition)…
        // …and only slide it up after the browser has painted that start position
        r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setState('in')); });
      }, SWAP_MS);
    }, CYCLE_MS);
    return () => { clearInterval(id); clearTimeout(swap); cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [words.length]);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '');
  return (
    <>
      {/* The animated word is decorative; screen readers get the full list once instead of a live-region chatter. */}
      <span className="sr-only">{words.join(', ')}</span>
      <span className="rotator" aria-hidden="true">
        {/* width reserver: the text lives in a pseudo-element so it never doubles up in the heading's text */}
        <span data-w={longest} className="invisible whitespace-nowrap after:content-[attr(data-w)]" />
        <span data-state={state} className="grad-text whitespace-nowrap">{words[idx]}</span>
      </span>
    </>
  );
}

export default function Hero({ hero, platforms, founder, hasAnnouncement, showDashboard = true, dashboard }) {
  const list = Array.isArray(platforms) ? platforms : [];
  const words = list.length ? list.map((p) => p.name) : ['eBay'];
  const hasImage = !!hero.sideImageUrl;
  const hasCard = !hasImage && showDashboard && list.length > 0;
  const hasRight = hasImage || hasCard;
  const trust = hero.trust || [];

  return (
    <section className={`dz bg-bg relative overflow-hidden pb-16 ${hasAnnouncement ? 'pt-[8.25rem] md:pt-[11rem]' : 'pt-[7.5rem] md:pt-[10.5rem]'}`}>
      <style>{HERO_CSS}</style>

      {/* The original hero glows (gold top-right, teal bottom-left), gently drifting and trailing the scroll */}
      <div className="glow-hero parallax" style={{ '--p-speed': 0.1 }} aria-hidden="true" />

      <div className={`wrap relative grid gap-10 items-start ${hasRight ? 'lg:grid-cols-[1.05fr_.95fr]' : ''}`}>
        <div className={hasRight ? '' : 'max-w-[52rem]'}>
          <span className="eyebrow fade-up" style={{ '--d': '120ms' }}>{hero.eyebrow}</span>

          {/* Each line wipes up out of its own mask, in sequence */}
          <h1 className="h-display mt-4 text-fg flex flex-col">
            <span className="hero-line"><span style={{ '--d': '220ms' }}>{hero.headlinePrefix}{' '}</span></span>
            <span className="hero-line"><span style={{ '--d': '340ms' }}><Rotator words={words} />{' '}</span></span>
            {hero.headlineSuffix && <span className="hero-line"><span style={{ '--d': '460ms' }}>{hero.headlineSuffix}</span></span>}
          </h1>

          <p className="lead mt-5 max-w-[34em] fade-up" style={{ '--d': '600ms' }}>{hero.lead}</p>

          <div className="flex flex-wrap gap-4 mt-8 fade-up" style={{ '--d': '720ms' }}>
            {/* magnetic lives on a wrapper: .btn:hover owns the button's own transform */}
            <span data-magnetic="0.18" className="inline-flex">
              <Link href="/contact" className="btn btn-primary">
                {hero.ctaPrimary} <Icon name="arrow" className="w-4 h-4" />
              </Link>
            </span>
            <span data-magnetic="0.18" className="inline-flex">
              <Link href="/services" className="btn btn-ghost">{hero.ctaSecondary}</Link>
            </span>
          </div>

          {trust.length > 0 && (
            <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-6">
              {trust.map((t, i) => (
                <li key={t} className="flex items-center gap-[.45em] font-mono text-[.78rem] text-faint fade-up" style={{ '--d': `${860 + i * 90}ms` }}>
                  <Icon name="check" className="w-[14px] h-[14px] text-teal" /> {t}
                </li>
              ))}
            </ul>
          )}
        </div>

        {hasImage && (
          <div className="relative min-w-0 w-full max-w-[560px] mx-auto lg:max-w-none">
            {/* wipe-in → gentle float → tilt: three wrappers so the three transforms never fight */}
            <div className="hero-wipe" style={{ '--d': '380ms' }}>
              <div className="float-slow">
                <div data-tilt="3" className="rounded-2xl overflow-hidden shadow-cardLg ring-1 ring-edge/10 aspect-[4/3] sm:aspect-[4/3.6]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.sideImageUrl}
                    alt={founder?.name || ''}
                    className="hero-zoom w-full h-full"
                    style={{ '--d': '380ms', objectFit: hero.sideImageFit || 'cover', objectPosition: hero.sideImagePosition || 'top' }}
                    draggable="false"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {hasCard && (
          <div className="relative min-w-0">
            <div className="hero-card" style={{ '--d': '480ms' }}>
              <div data-tilt="3">
                <PlatformDashboard platforms={list} disclaimer={dashboard?.disclaimer} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
