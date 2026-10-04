'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from './Icons';

function Rotator({ words }) {
  const [idx, setIdx] = useState(0);
  const [state, setState] = useState('in'); // in | out | next

  useEffect(() => {
    if (words.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let t1;
    let t2;
    const id = setInterval(() => {
      setState('out');
      t1 = setTimeout(() => {
        setIdx((i) => (i + 1) % words.length);
        setState('next');
        t2 = setTimeout(() => setState('in'), 30);
      }, 520);
    }, 2600);
    return () => { clearInterval(id); clearTimeout(t1); clearTimeout(t2); };
  }, [words.length]);

  return (
    <span className="rotator" aria-live="polite">
      {/* invisible sizer = longest word, so the layout never jumps */}
      <span aria-hidden="true" className="invisible">{words.reduce((a, b) => (b.length > a.length ? b : a), '')}</span>
      <span data-state={state} className="grad-text">{words[idx]}</span>
    </span>
  );
}

export default function Hero({ hero, platforms, brand, founder, hasAnnouncement }) {
  const words = platforms?.length ? platforms.map((p) => p.name) : ['eBay'];
  const wrapRef = useRef(null);

  // Subtle 3D tilt on the visual (desktop pointers only).
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1100px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    };
    const onLeave = () => { el.style.transform = ''; };
    const parent = el.parentElement;
    parent.addEventListener('pointermove', onMove);
    parent.addEventListener('pointerleave', onLeave);
    return () => { parent.removeEventListener('pointermove', onMove); parent.removeEventListener('pointerleave', onLeave); };
  }, []);

  const orbit = platforms?.slice(0, 4) || [];

  return (
    <section className={`relative overflow-hidden noise ${hasAnnouncement ? 'pt-36 md:pt-44' : 'pt-32 md:pt-40'} pb-20 md:pb-28`}>
      <div className="aurora">
        <i className="w-[44rem] h-[44rem] bg-gold/25 -top-72 -right-40" />
        <i className="w-[38rem] h-[38rem] bg-teal/20 -bottom-72 -left-40" style={{ animationDelay: '-6s' }} />
        <i className="w-[30rem] h-[30rem] bg-violet/20 top-1/3 left-1/3" style={{ animationDelay: '-12s' }} />
      </div>
      <div className="grid-bg" />

      <div className="wrap relative grid lg:grid-cols-[1.1fr_.9fr] gap-14 items-center">
        <div>
          <div className="animate-rise" style={{ animationDelay: '.05s' }}>
            <span className="chip border-gold/30 bg-gold/10 text-gold">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> {hero.eyebrow}
            </span>
          </div>
          <h1 className="h-display mt-6 animate-rise" style={{ animationDelay: '.15s' }}>
            {hero.headlinePrefix}{' '}
            <Rotator words={words} />{' '}
            <span className="text-fg/90">{hero.headlineSuffix}</span>
          </h1>
          <p className="lead mt-6 max-w-[34em] animate-rise" style={{ animationDelay: '.28s' }}>{hero.lead}</p>

          <div className="flex flex-wrap gap-3 mt-9 animate-rise" style={{ animationDelay: '.4s' }}>
            <Link href="/contact" className="btn btn-primary">{hero.ctaPrimary} <Icon name="arrow" className="w-4 h-4" /></Link>
            <Link href="/services" className="btn btn-ghost">{hero.ctaSecondary}</Link>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-8 animate-rise" style={{ animationDelay: '.5s' }}>
            {(hero.trust || []).map((t) => (
              <li key={t} className="flex items-center gap-2 font-mono text-[.76rem] text-muted">
                <Icon name="check" className="w-4 h-4 text-teal" /> {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual: orbiting platform badges around the founder / brand mark */}
        <div className="relative mx-auto w-full max-w-[520px] aspect-square animate-rise" style={{ animationDelay: '.3s' }}>
          <div ref={wrapRef} className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform">
            <div className="orbit-ring" style={{ '--r': '100%', '--t': '60s' }} />
            <div className="orbit-ring" style={{ '--r': '74%', '--t': '42s', '--dir': 'reverse' }} />
            <div className="orbit-ring" style={{ '--r': '48%', '--t': '28s' }} />

            {orbit.map((p, i) => {
              const ring = [100, 74, 48][i % 3];
              const delay = -((i * 11) % 28);
              return (
                <div
                  key={p.key}
                  className="orbit-arm"
                  style={{ '--r': `${ring}%`, '--t': ['60s', '42s', '28s'][i % 3], '--dir': i % 3 === 1 ? 'reverse' : 'normal', animationDelay: `${delay}s` }}
                >
                  <span className="orbit-pill glass" style={{ '--dir': i % 3 === 1 ? 'reverse' : 'normal', animationDelay: `${delay}s` }}>
                    <i className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    {p.name}
                  </span>
                </div>
              );
            })}

            <div className="absolute inset-[27%] rounded-full grid place-items-center overflow-hidden ring-1 ring-gold/50 shadow-glow bg-surface">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/25 via-transparent to-teal/25" />
              {hero.sideImageUrl || brand?.portraitUrl || brand?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={hero.sideImageUrl || brand.portraitUrl || brand.avatarUrl} alt={founder?.name || ''} className="relative w-full h-full object-cover object-top" />
              ) : (
                <span className="relative font-display font-extrabold text-5xl grad-text">EZ</span>
              )}
            </div>

            {founder?.name && (
              <div className="absolute left-[2%] bottom-[8%] glass rounded-2xl px-4 py-3 animate-float shadow-card">
                <div className="font-display font-bold text-sm">{founder.name}</div>
                <div className="font-mono text-[.65rem] text-gold mt-0.5">{founder.role}</div>
              </div>
            )}
            <div className="absolute right-[2%] top-[10%] glass rounded-2xl px-4 py-3 animate-float shadow-card" style={{ animationDelay: '-3s' }}>
              <div className="flex items-center gap-2 font-display font-bold text-sm"><Icon name="users" className="w-4 h-4 text-teal" /> 1-on-1 coaching</div>
              <div className="font-mono text-[.65rem] text-muted mt-0.5">Built around your store</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
