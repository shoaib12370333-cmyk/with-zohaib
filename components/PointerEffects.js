'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// One small client component that powers every site-wide motion effect with a
// single set of listeners (instead of per-element JS):
//   1. scroll progress bar     → --p on .progress, and --sy (scrollY) on <html> for .parallax
//   2. reveal-on-scroll        → .is-in on [data-reveal], with [data-stagger] delays
//   3. cursor spotlight        → --mx / --my on the hovered .spot card
//   4. 3D tilt  [data-tilt]    → --rx / --ry
//   5. magnetic [data-magnetic]→ --tx / --ty
// 3–5 only run for fine pointers (mouse/trackpad) and never with reduced motion.
export default function PointerEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const bar = document.querySelector('.progress');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = root.scrollHeight - root.clientHeight;
        if (bar) bar.style.setProperty('--p', max > 0 ? String(Math.min(1, root.scrollTop / max)) : '0');
        if (!reduce) root.style.setProperty('--sy', String(Math.round(root.scrollTop)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    let tiltEl = null;
    let magEl = null;
    const reset = (el) => {
      if (!el) return;
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--tx', '0px');
      el.style.setProperty('--ty', '0px');
    };

    const onMove = (e) => {
      const target = e.target instanceof Element ? e.target : null;
      if (!target) return;

      const spot = target.closest('.spot');
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
        spot.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
      if (!fine || reduce) return;

      const tilt = target.closest('[data-tilt]');
      if (tiltEl && tiltEl !== tilt) { reset(tiltEl); tiltEl = null; }
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const max = Number(tilt.dataset.tilt) || 5;
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty('--ry', `${(x * max * 2).toFixed(2)}deg`);
        tilt.style.setProperty('--rx', `${(-y * max * 2).toFixed(2)}deg`);
        tiltEl = tilt;
      }

      const mag = target.closest('[data-magnetic]');
      if (magEl && magEl !== mag) { reset(magEl); magEl = null; }
      if (mag) {
        const r = mag.getBoundingClientRect();
        const strength = Number(mag.dataset.magnetic) || 0.25;
        mag.style.setProperty('--tx', `${((e.clientX - (r.left + r.width / 2)) * strength).toFixed(1)}px`);
        mag.style.setProperty('--ty', `${((e.clientY - (r.top + r.height / 2)) * strength).toFixed(1)}px`);
        magEl = mag;
      }
    };
    const onLeaveWindow = () => { reset(tiltEl); reset(magEl); tiltEl = magEl = null; };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeaveWindow);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeaveWindow);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Re-scan for [data-reveal] on every navigation and whenever the DOM changes.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    const scan = () => {
      // stagger: children of [data-stagger] get --d = index * step (unless they set their own delay)
      document.querySelectorAll('[data-stagger]:not([data-staggered])').forEach((parent) => {
        const step = Number(parent.dataset.stagger) || 80;
        let i = 0;
        for (const child of parent.children) {
          if (child.hasAttribute('data-reveal') && !child.style.getPropertyValue('--d')) {
            child.style.setProperty('--d', `${i * step}ms`);
          }
          i++;
        }
        parent.setAttribute('data-staggered', '');
      });
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
