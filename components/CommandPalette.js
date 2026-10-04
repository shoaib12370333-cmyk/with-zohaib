'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from './Icons';
import { waLink } from '@/lib/links';

// Backdrop fade (the panel itself reuses the shared `rise` motion)
const PALETTE_CSS = '@keyframes cpFade{from{opacity:0}to{opacity:1}}.cp-fade{animation:cpFade .3s var(--ease) both}';

// Ctrl/⌘ + K quick launcher: jump to any page, service or article, or fire a
// quick action (WhatsApp, e-mail).
export default function CommandPalette({ services = [], posts = [], whatsapp, email }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const returnFocus = useRef(null);
  const viaKeys = useRef(false);

  const items = useMemo(() => {
    const go = (href) => () => router.push(href);
    const list = [
      { group: 'Pages', label: 'Home', icon: 'home', run: go('/') },
      { group: 'Pages', label: 'About', icon: 'users', run: go('/about') },
      { group: 'Pages', label: 'Services', icon: 'layers', run: go('/services') },
      { group: 'Pages', label: 'Blog', icon: 'doc', run: go('/blog') },
      { group: 'Pages', label: 'Contact / Book a call', icon: 'calendar', run: go('/contact') },
      ...services.map((s) => ({ group: 'Services', label: s.title, icon: 'arrow', run: go(`/services/${s.slug}`) })),
      ...posts.map((p) => ({ group: 'Articles', label: p.title, icon: 'doc', run: go(`/blog/${p.slug}`) })),
      whatsapp && { group: 'Actions', label: 'Chat on WhatsApp', icon: 'whatsapp', run: () => window.open(waLink(whatsapp), '_blank', 'noopener') },
      email && { group: 'Actions', label: `Email ${email}`, icon: 'mail', run: () => (window.location.href = `mailto:${email}`) },
    ];
    return list.filter(Boolean);
  }, [services, posts, whatsapp, email, router]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter((i) => i.label.toLowerCase().includes(s) || i.group.toLowerCase().includes(s)) : items;
  }, [items, q]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-command-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-command-palette', onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return undefined;
    }
    returnFocus.current = document.activeElement;
    setQ('');
    setActive(0);
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    // Combobox pattern: the input is the only tab stop (options are chosen with the arrow keys and
    // aria-activedescendant). Swallowing Tab at window level keeps focus in the dialog even after a
    // click on a non-focusable part of the panel has dropped focus to the body.
    const onTab = (e) => {
      if (e.key !== 'Tab') return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onTab);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onTab);
      document.body.style.overflow = '';
      // hand focus back to whatever opened the palette (e.g. the header search button)
      if (returnFocus.current instanceof HTMLElement && document.contains(returnFocus.current)) returnFocus.current.focus();
    };
  }, [open]);

  useEffect(() => setActive(0), [q]);

  // keep the keyboard-selected row inside the scrolling list (hovering with the mouse never scrolls it)
  useEffect(() => {
    if (!open || !viaKeys.current) return;
    viaKeys.current = false;
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const run = (item) => {
    setOpen(false);
    item?.run();
  };

  const onInputKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); viaKeys.current = true; setActive((a) => Math.min(filtered.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); viaKeys.current = true; setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(filtered[active]); }
  };

  if (!open) return null;

  let lastGroup = '';
  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[12vh] px-4" role="dialog" aria-modal="true" aria-label="Quick search">
      <style>{PALETTE_CSS}</style>
      <button tabIndex={-1} className="cp-fade absolute inset-0 bg-ink/70 backdrop-blur-sm cursor-default" aria-label="Close" onClick={() => setOpen(false)} />

      {/* classic dark panel: ink surface, hairline border, gold selection */}
      <div className="dz relative w-full max-w-[560px] rounded-2xl border border-white/10 shadow-[0_32px_80px_-24px_rgba(0,0,0,.75)] overflow-hidden animate-rise">
        <div className="flex items-center gap-3 px-4 border-b border-white/10">
          <Icon name="search" className="w-5 h-5 text-gold" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search pages, services, articles…"
            className="flex-1 min-w-0 bg-transparent py-4 outline-none focus-visible:outline-none text-fg placeholder:text-faint"
            aria-label="Search"
            role="combobox"
            aria-expanded="true"
            aria-controls="cp-list"
            aria-activedescendant={filtered[active] ? `cp-opt-${active}` : undefined}
          />
          <kbd className="font-mono text-[.65rem] px-1.5 py-0.5 rounded border border-white/20 text-faint">Esc</kbd>
        </div>

        <ul id="cp-list" ref={listRef} className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
          {filtered.length === 0 && <li className="px-3 py-8 text-center text-muted text-sm">No results for “{q}”.</li>}
          {filtered.map((item, i) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            const on = i === active;
            return (
              <li key={`${item.group}-${item.label}`} role="presentation">
                {header && <div className="px-3 pt-3 pb-1 font-mono text-[.62rem] tracking-[.16em] uppercase text-faint">{header}</div>}
                <button
                  id={`cp-opt-${i}`}
                  tabIndex={-1}
                  role="option"
                  aria-selected={on}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => run(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[.95rem] transition-[background-color,color,transform] duration-200 ${
                    on ? 'bg-gold text-ink font-medium translate-x-0.5' : 'text-muted'
                  }`}
                >
                  <Icon name={item.icon} className={`w-4 h-4 flex-none ${on ? 'text-ink' : 'text-gold'}`} />
                  <span className="truncate">{item.label}</span>
                  {on && <span className="ml-auto flex-none font-mono text-[.65rem] opacity-70" aria-hidden="true">↵</span>}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="hidden sm:flex items-center gap-4 px-4 py-2.5 border-t border-white/10 font-mono text-[.62rem] text-faint" aria-hidden="true">
          <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span>
        </div>
      </div>
    </div>
  );
}
