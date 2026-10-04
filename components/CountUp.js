'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';

// Animated number that counts up once when it scrolls into view.
//
// Rendering strategy (so nothing jumps, nothing mismatches, nothing lies):
//   • The server — and the first client render — output the REAL final number, so
//     no-JS visitors, crawlers and print all see the right figure.
//   • After mount, if the number is still below the fold, we rewind the visible
//     text to 0 *before the first paint* (layout effect) and count up when it
//     becomes visible. The counting text is written straight to the DOM node, so
//     React never re-renders 60 times a second.
//   • An invisible copy of the final value sits in the same grid cell as a sizer,
//     so the box never changes width while digits grow (no layout shift).
//   • The screen-reader copy always announces the final value, never mid-count digits.
//   • Reduced-motion visitors simply keep the final number.

// useLayoutEffect logs a warning when it runs on the server; fall back to useEffect there.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Fast launch, long gentle landing — feels far more "premium" than a cubic ease.
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

const format = (n, decimals, prefix, suffix) =>
  `${prefix}${n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

export default function CountUp({ to, suffix = '', prefix = '', duration = 2000, delay = 0 }) {
  const rootRef = useRef(null);
  const liveRef = useRef(null);

  // Non-numeric values ("24/7", "∞" …) are shown as-is and never animated.
  const isNum = to !== '' && to != null && Number.isFinite(Number(to));
  const target = isNum ? Number(to) : 0;
  const decimals = isNum ? Math.min(2, (String(to).split('.')[1] || '').length) : 0;
  const finalText = isNum ? format(target, decimals, prefix, suffix) : `${prefix}${to ?? ''}${suffix}`;

  useIsoLayoutEffect(() => {
    if (!isNum) return;
    const root = rootRef.current;
    const live = liveRef.current;
    if (!root || !live) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    // Already scrolled past (e.g. restored scroll position): keep the real number.
    if (root.getBoundingClientRect().bottom < 0) return;

    let raf = 0;
    let timer = 0;

    live.textContent = format(0, decimals, prefix, suffix); // rewind before first paint

    const run = () => {
      const t0 = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / duration);
        live.textContent = t >= 1 ? finalText : format(target * easeOutExpo(t), decimals, prefix, suffix);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(run, delay);
      },
      { threshold: 0.4, rootMargin: '0px 0px -4% 0px' }
    );
    io.observe(root);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      live.textContent = finalText; // leave the DOM truthful if we are torn down mid-count
    };
  }, [isNum, target, decimals, prefix, suffix, duration, delay, finalText]);

  if (!isNum) return <span>{finalText}</span>;

  return (
    // whitespace-nowrap: prefix / number / suffix ("3-step") must never break at the hyphen
    <span ref={rootRef} className="relative inline-grid justify-items-center whitespace-nowrap tabular-nums">
      <span className="sr-only">{finalText}</span>
      {/* sizer: reserves the final width so the counting digits never shift the layout */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">{finalText}</span>
      <span ref={liveRef} aria-hidden="true" className="col-start-1 row-start-1">{finalText}</span>
    </span>
  );
}
