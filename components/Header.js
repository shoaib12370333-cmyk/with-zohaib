'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icons';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export default function Header({ brand }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled ? 'bg-ink/95 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,.06)] py-3' : 'py-[1.1rem]'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-[.7rem]">
            <span className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold bg-ink2 flex-none">
              {brand?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.avatarUrl} alt={brand?.name || 'Founder'} className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-gold font-display font-extrabold text-sm">EZ</span>
              )}
            </span>
            <span className="leading-tight text-white">
              <span className="block font-display font-bold text-[1.02rem] -tracking-[.01em]">{brand?.name || 'E-Commerce'}</span>
              <span className="block font-mono-eyebrow text-[.62rem] tracking-[.16em] text-gold mt-[2px]">{brand?.sub || 'WITH ZOHAIB'}</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-display text-[.92rem] font-semibold relative py-1 transition-colors ${
                    active ? 'text-gold' : 'text-[#D7DBE4] hover:text-white'
                  }`}
                >
                  {item.label}
                  {active && <span className="absolute left-0 right-0 -bottom-1.5 h-[2px] bg-gold rounded" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-5">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-2 bg-gold hover:bg-goldDeep text-ink font-display font-bold text-[.85rem] px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5"
            >
              {brand?.bookCallLabel || 'Book Free Call'}
            </Link>
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center text-white"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? 'close' : 'menu'} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 bg-ink z-[99] flex flex-col items-center justify-center gap-6 transition-all duration-300 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible -translate-y-2'
        }`}
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`font-display text-[1.6rem] font-bold ${pathname === item.href ? 'text-gold' : 'text-white'}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}
