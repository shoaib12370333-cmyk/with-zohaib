'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icons';
import ThemeToggle from './ThemeToggle';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Header({ brand, showSearch = true, hasAnnouncement = false }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const openPalette = () => window.dispatchEvent(new Event('open-command-palette'));

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-[100] px-3 sm:px-6 transition-all duration-500 ${
          scrolled ? 'top-2' : hasAnnouncement ? 'top-12' : 'top-4'
        }`}
      >
        <div
          className={`mx-auto max-w-[1180px] flex items-center justify-between gap-3 rounded-full pl-3 pr-2 py-2 transition-all duration-500 ${
            scrolled ? 'glass !bg-surface/85 shadow-card' : 'border border-transparent'
          }`}
        >
          <Link href="/" className="flex items-center gap-3 group" aria-label={`${brand?.name || 'Home'} — home`}>
            <span className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-gold/70 bg-surface2 flex-none grid place-items-center">
              {brand?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display font-extrabold text-sm text-gold">EZ</span>
              )}
            </span>
            <span className="leading-none hidden sm:block">
              <span className="block font-display font-bold text-[1rem] tracking-tight">{brand?.name || 'E-Commerce'}</span>
              <span className="block font-mono text-[.58rem] tracking-[.22em] text-gold mt-1">{brand?.sub || 'WITH ZOHAIB'}</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`relative px-4 py-2 rounded-full font-display text-[.9rem] font-medium transition-colors ${
                  isActive(item.href) ? 'text-fg bg-edge/[.08]' : 'text-muted hover:text-fg hover:bg-edge/[.05]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            {showSearch && (
              <button
                type="button"
                onClick={openPalette}
                aria-label="Search and quick actions"
                className="hidden sm:flex items-center gap-2 h-10 pl-3 pr-2 rounded-full text-muted hover:text-fg hover:bg-edge/[.06] transition-colors"
              >
                <Icon name="search" className="w-4 h-4" />
                <kbd className="font-mono text-[.65rem] px-1.5 py-0.5 rounded border border-edge/20">Ctrl K</kbd>
              </button>
            )}
            <ThemeToggle />
            <Link href="/contact" className="btn btn-primary btn-sm hidden sm:inline-flex">
              {brand?.bookCallLabel || 'Book Free Call'}
            </Link>
            <button
              type="button"
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-edge/10"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? 'close' : 'menu'} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[99] lg:hidden bg-bg/95 backdrop-blur-xl transition-all duration-500 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="aurora"><i className="w-[70vw] h-[70vw] bg-gold/30 -top-20 -right-20" /><i className="w-[60vw] h-[60vw] bg-teal/20 bottom-0 -left-20" /></div>
        <nav className="relative h-full flex flex-col justify-center px-8 gap-2" aria-label="Mobile">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : '0ms' }}
              className={`font-display text-[2.4rem] font-bold tracking-tight transition-all duration-500 ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              } ${isActive(item.href) ? 'grad-text' : 'text-fg'}`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-primary mt-6 self-start">{brand?.bookCallLabel || 'Book Free Call'}</Link>
        </nav>
      </div>
    </>
  );
}
