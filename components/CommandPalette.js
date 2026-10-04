'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from './Icons';
import { applyTheme } from './ThemeToggle';
import { waLink } from '@/lib/links';

// Ctrl/⌘ + K quick launcher: jump to any page, service or article, or fire a
// quick action (WhatsApp, e-mail, theme).
export default function CommandPalette({ services = [], posts = [], whatsapp, email }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

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
      {
        group: 'Actions',
        label: 'Toggle light / dark theme',
        icon: 'sun',
        run: () => applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'),
      },
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
    if (open) {
      setQ('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  useEffect(() => setActive(0), [q]);

  const run = (item) => {
    setOpen(false);
    item?.run();
  };

  const onInputKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(filtered.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(filtered[active]); }
  };

  if (!open) return null;

  let lastGroup = '';
  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[12vh] px-4" role="dialog" aria-modal="true" aria-label="Quick search">
      <button className="absolute inset-0 bg-bg/70 backdrop-blur-sm cursor-default" aria-label="Close" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-[560px] glass rounded-2xl shadow-card overflow-hidden animate-rise">
        <div className="flex items-center gap-3 px-4 border-b border-edge/10">
          <Icon name="search" className="w-5 h-5 text-faint" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search pages, services, articles…"
            className="flex-1 bg-transparent py-4 outline-none text-fg placeholder:text-faint"
            aria-label="Search"
          />
          <kbd className="font-mono text-[.65rem] px-1.5 py-0.5 rounded border border-edge/20 text-faint">Esc</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
          {filtered.length === 0 && <li className="px-3 py-8 text-center text-muted text-sm">No results for “{q}”.</li>}
          {filtered.map((item, i) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            return (
              <li key={`${item.group}-${item.label}`} role="presentation">
                {header && <div className="px-3 pt-3 pb-1 font-mono text-[.62rem] tracking-[.16em] uppercase text-faint">{header}</div>}
                <button
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => run(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[.95rem] transition-colors ${
                    i === active ? 'bg-gold/15 text-fg' : 'text-muted'
                  }`}
                >
                  <Icon name={item.icon} className="w-4 h-4 flex-none text-gold" />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
