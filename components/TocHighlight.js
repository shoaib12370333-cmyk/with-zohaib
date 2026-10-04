'use client';
import { useEffect, useRef, useState } from 'react';

// "On this page" list for blog posts. Works as a plain list of anchor links without JS;
// with JS it tracks which heading is being read (one rAF-throttled scroll check) and
// slides a gold marker along the rail to the active entry.
export default function TocHighlight({ headings }) {
  const [active, setActive] = useState(null);
  const [mark, setMark] = useState(null); // { top, height } of the active entry
  const itemRefs = useRef({});

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean);
    if (!els.length) return undefined;

    let raf = 0;
    const update = () => {
      raf = 0;
      const root = document.documentElement;
      const atEnd = window.innerHeight + root.scrollTop >= root.scrollHeight - 4;
      // active = the last heading that has scrolled up past the fixed header area
      let cur = null;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= 140) cur = el.id;
        else break;
      }
      setActive(atEnd ? els[els.length - 1].id : cur);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [headings]);

  // Move the marker to the active entry (positions are relative to the list).
  useEffect(() => {
    const el = active ? itemRefs.current[active] : null;
    setMark(el ? { top: el.offsetTop, height: el.offsetHeight } : null);
  }, [active]);

  return (
    <nav aria-label="On this page">
      <div className="mb-3 font-mono text-[.66rem] uppercase tracking-[.18em] text-faint">On this page</div>
      <div className="relative">
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-edge/10" />
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 w-[2px] rounded-full bg-gold transition-[transform,height,opacity] duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
          style={{ height: mark ? mark.height : 0, transform: `translateY(${mark ? mark.top : 0}px)`, opacity: mark ? 1 : 0 }}
        />
        <ul className="relative">
          {headings.map((h) => {
            const on = active === h.id;
            return (
              <li key={h.id}>
                <a
                  ref={(el) => { itemRefs.current[h.id] = el; }}
                  href={`#${h.id}`}
                  aria-current={on ? 'location' : undefined}
                  className={`block py-1.5 pr-2 text-sm leading-snug transition-colors duration-300 ${h.level === 3 ? 'pl-7' : 'pl-4'} ${on ? 'font-medium text-fg' : 'text-muted hover:text-fg'}`}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
