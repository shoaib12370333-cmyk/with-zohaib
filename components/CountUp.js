'use client';
import { useEffect, useRef, useState } from 'react';

// Animated number that counts up once when scrolled into view.
export default function CountUp({ to, suffix = '', prefix = '', duration = 1600 }) {
  const ref = useRef(null);
  const target = Number(to);
  const [val, setVal] = useState(Number.isFinite(target) ? 0 : to);

  useEffect(() => {
    if (!Number.isFinite(target)) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(target); return; }
    let raf;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          setVal(Math.round(target * (1 - Math.pow(1 - t, 3))));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{Number.isFinite(target) ? val.toLocaleString('en-US') : to}{suffix}
    </span>
  );
}
