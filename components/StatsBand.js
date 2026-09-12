'use client';
import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';

function StatNumber({ stat }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(stat.numeric ? '0' : stat.value);
  const done = useRef(false);

  useEffect(() => {
    if (!stat.numeric) return;
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setDisplay(`${stat.value}${stat.suffix || ''}`);
      return;
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !done.current) {
            done.current = true;
            if (reduceMotion) {
              setDisplay(`${stat.value}${stat.suffix || ''}`);
              return;
            }
            const to = Number(stat.value);
            const dur = 1300;
            let start = null;
            const step = (ts) => {
              if (!start) start = ts;
              const p = Math.min((ts - start) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setDisplay(`${Math.round(eased * to)}${stat.suffix || ''}`);
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stat]);

  return (
    <span ref={ref} className="font-mono-eyebrow font-semibold text-gold text-[2.3rem] sm:text-[2.8rem] lg:text-[3.5rem]">
      {display}
    </span>
  );
}

export default function StatsBand({ stats, spacing = 4 }) {
  return (
    <div className="bg-ink">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10" style={{ paddingBlock: `${spacing}rem` }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {(stats || []).map((stat, i) => (
            <Reveal key={i} className="text-center px-3">
              <StatNumber stat={stat} />
              <span className="block text-[.85rem] text-[#AEB6C4] mt-[.4rem]">{stat.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
