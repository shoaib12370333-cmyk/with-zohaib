'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const TABS = [
  { href: '/admin', label: 'Content' },
  { href: '/admin/design', label: 'Design & Colors' },
  { href: '/admin/layout', label: 'Layout & Spacing' },
  { href: '/admin/messages', label: 'Messages' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="sticky top-0 z-50 bg-ink text-white px-5 sm:px-8 flex items-center justify-between flex-wrap gap-3">
      <nav className="flex gap-1 py-2">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`px-4 py-2.5 rounded-lg text-sm font-display font-semibold transition-colors ${
              pathname === t.href ? 'bg-gold text-ink' : 'text-[#D7DBE4] hover:text-white hover:bg-white/5'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4 py-2">
        <a href="/" target="_blank" rel="noreferrer" className="text-sm underline">Preview site</a>
        <button onClick={handleLogout} className="text-sm text-[#D7DBE4] hover:text-white">Log out</button>
      </div>
    </div>
  );
}
