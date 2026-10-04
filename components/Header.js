'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icons';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const EASE = 'ease-[cubic-bezier(.2,.7,.2,1)]';
const HIDE_AFTER = 400; // px scrolled before the bar may tuck away
const SCROLL_STEP = 8; // px of travel needed to flip direction (stops jitter)
// Where the burger sits, so the full-screen menu can bloom out of it
const MENU_ORIGIN = 'calc(100% - 2.5rem) 2.4rem';

export default function Header({ brand, showSearch = true, hasAnnouncement = false }) {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const burgerRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false); // tucked away while scrolling down
  const [open, setOpen] = useState(false);
  const [mod, setMod] = useState('Ctrl');

  // ⌘ on Apple devices — decided after mount so server and client markup agree.
  useEffect(() => {
    if (/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || '')) setMod('⌘');
  }, []);

  // Scroll behaviour: solid bar after 30px, glide up to meet the announcement bar as it
  // scrolls away, and tuck away on scroll-down / return on scroll-up (never while the menu is open).
  useEffect(() => {
    const el = headerRef.current;
    const bar = hasAnnouncement ? document.querySelector('[data-announcement]') : null;
    let barH = bar ? bar.offsetHeight : 0;
    let lastY = window.scrollY;
    let raf = 0;
    // people who ask for less motion keep a header that never moves away
    const canHide = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const apply = () => {
      raf = 0;
      const y = Math.max(0, window.scrollY);
      el?.style.setProperty('--hoff', `${Math.max(0, barH - y)}px`);
      setScrolled(y > 30);
      if (open || !canHide || y < HIDE_AFTER) { setHidden(false); lastY = y; return; }
      const dy = y - lastY;
      if (dy > SCROLL_STEP) { setHidden(true); lastY = y; }
      else if (dy < -SCROLL_STEP) { setHidden(false); lastY = y; }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply); };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const ro = bar && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { barH = bar.offsetHeight; onScroll(); }) : null;
    ro?.observe(bar);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      ro?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [hasAnnouncement, open]);

  useEffect(() => setOpen(false), [pathname]);

  // While the full-screen menu is open: lock page scroll, close on Escape (focus goes back to the
  // burger), make the page behind it inert so Tab / screen readers stay inside the header + menu,
  // and close it if the viewport grows past the burger breakpoint (the burger and menu are both
  // lg:hidden by then, which would otherwise leave scroll locked with no way to close).
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      burgerRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);

    const behind = Array.from(document.querySelectorAll('main, footer, [data-announcement], [data-floating-wa]'));
    behind.forEach((n) => { n.inert = true; });

    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener('change', onMq);

    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
      behind.forEach((n) => { n.inert = false; });
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const openPalette = () => window.dispatchEvent(new Event('open-command-palette'));
  const ctaLabel = brand?.bookCallLabel || 'Book Free Call';

  return (
    <>
      {/* .dz = dark zone (white text, ink tokens). The fixed shell only carries the announcement offset;
          the inner bar does the background / slide so the two transforms never fight. */}
      <header
        ref={headerRef}
        onFocus={() => setHidden(false)}
        className="dz !bg-transparent fixed inset-x-0 top-0 z-[100]"
        style={{ '--hoff': hasAnnouncement ? '2.3rem' : '0px', transform: 'translate3d(0, var(--hoff, 0px), 0)' }}
      >
        <div
          className={`transition-[transform,background-color,box-shadow,padding] duration-500 ${EASE} ${
            hidden ? '-translate-y-full' : ''
          } ${scrolled ? `bg-ink/95 backdrop-blur-md py-3 ${hidden ? '' : 'shadow-[0_1px_0_rgba(255,255,255,.06)]'}` : 'py-[1.1rem] bg-ink/95 [.js_&]:bg-transparent'}`}
        >
          <div className="max-w-[1280px] mx-auto px-5 sm:px-8 flex items-center justify-between gap-4">
            <Link href="/" className="group flex items-center gap-[.7rem] min-w-0" aria-label={`${brand?.name || 'Home'} — home`}>
              <span className={`w-10 h-10 rounded-full overflow-hidden border-2 border-gold bg-ink2 flex-none grid place-items-center transition-transform duration-500 ${EASE} group-hover:scale-105 group-hover:-rotate-3`}>
                {brand?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brand.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display font-extrabold text-sm text-gold">EZ</span>
                )}
              </span>
              <span className="leading-tight min-w-0">
                <span className="block font-display font-bold text-[1.02rem] -tracking-[.01em] text-white truncate">{brand?.name || 'E-Commerce'}</span>
                <span className="block font-mono text-[.62rem] tracking-[.16em] text-gold mt-[2px] truncate">{brand?.sub || 'WITH ZOHAIB'}</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
              {NAV.map((item) => {
                const on = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={on ? 'page' : undefined}
                    className={`link-u font-display text-[.92rem] font-semibold py-1.5 ${on ? 'text-gold' : 'text-fg/80 hover:text-fg'}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3 sm:gap-5 flex-none">
              {showSearch && (
                <button
                  type="button"
                  onClick={openPalette}
                  aria-label="Search and quick actions"
                  className="hidden sm:flex items-center gap-2 h-10 pl-3 pr-2 rounded-full text-fg/70 hover:text-fg hover:bg-white/10 transition-colors"
                >
                  <Icon name="search" className="w-4 h-4" />
                  <kbd className="font-mono text-[.65rem] px-1.5 py-0.5 rounded border border-white/20">{mod} K</kbd>
                </button>
              )}
              {/* magnetic sits on a wrapper: .btn-primary:hover owns the button's own transform */}
              <span data-magnetic="0.2" className="hidden sm:inline-flex">
                <Link href="/contact" className="btn btn-primary btn-sm">{ctaLabel}</Link>
              </span>
              <button
                ref={burgerRef}
                type="button"
                className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((v) => !v)}
              >
                {/* two bars that morph into a cross */}
                <span className="relative block w-6 h-[14px]" aria-hidden="true">
                  <span className={`absolute left-0 top-0 h-[2px] w-6 rounded-full bg-current transition-transform duration-500 ${EASE} ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
                  <span className={`absolute right-0 bottom-0 h-[2px] rounded-full bg-current transition-[transform,width] duration-500 ${EASE} ${open ? 'w-6 -translate-y-[6px] -rotate-45' : 'w-4'}`} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen menu: blooms from the burger, links slide in one after another */}
      <div
        id="mobile-menu"
        inert={!open}
        className="dz fixed inset-0 z-[99] lg:hidden overflow-y-auto"
        style={{
          clipPath: `circle(${open ? '150%' : '0%'} at ${MENU_ORIGIN})`,
          visibility: open ? 'visible' : 'hidden',
          transition: `clip-path .75s cubic-bezier(.2,.7,.2,1), visibility 0s linear ${open ? '0s' : '.75s'}`,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 40% at 90% 0%, rgba(226,166,61,.16), transparent 60%), radial-gradient(60% 40% at 5% 100%, rgba(29,148,136,.18), transparent 60%)',
          }}
          aria-hidden="true"
        />
        <nav className="relative min-h-full flex flex-col justify-center px-8 py-28" aria-label="Mobile">
          {NAV.map((item, i) => {
            const on = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={on ? 'page' : undefined}
                style={{ transitionDelay: open ? `${220 + i * 70}ms` : '0ms' }}
                className={`flex items-baseline gap-4 py-3 border-b border-white/10 font-display text-[2.1rem] font-bold tracking-tight transition-[transform,opacity,color] duration-700 ${EASE} ${
                  open ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                } ${on ? 'text-gold' : 'text-fg'}`}
              >
                <span className="font-mono text-[.7rem] font-medium tracking-[.14em] text-faint">{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </Link>
            );
          })}
          {/* the stagger delay lives on a wrapper so it never delays the button's own hover motion */}
          <div
            style={{ transitionDelay: open ? `${220 + NAV.length * 70}ms` : '0ms' }}
            className={`mt-8 self-start transition-[transform,opacity] duration-700 ${EASE} ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            <Link href="/contact" onClick={() => setOpen(false)} className="btn btn-primary">{ctaLabel}</Link>
          </div>
        </nav>
      </div>
    </>
  );
}
