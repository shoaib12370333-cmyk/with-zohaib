'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/Icons';
import ThemeToggle from '@/components/ThemeToggle';

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: 'chart' },
  { href: '/admin/content', label: 'Site content', icon: 'edit' },
  { href: '/admin/design', label: 'Brand & SEO', icon: 'spark' },
  { href: '/admin/layout', label: 'Sections', icon: 'sliders' },
  { href: '/admin/posts', label: 'Blog posts', icon: 'doc' },
  { href: '/admin/messages', label: 'Leads inbox', icon: 'inbox', badge: true },
  { href: '/admin/security', label: 'Security', icon: 'lock' },
];

// Wraps every /admin page (except the login screen) in a sidebar shell.
export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const isLogin = pathname === '/admin/login';

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (isLogin) return;
    fetch('/api/admin/stats').then((r) => (r.ok ? r.json() : null)).then((s) => s && setUnread(s.unread || 0)).catch(() => {});
  }, [isLogin, pathname]);

  if (isLogin) return children;

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };
  const active = (href) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

  const nav = (
    <nav className="flex-1 space-y-1" aria-label="Admin">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={active(l.href) ? 'page' : undefined}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${active(l.href) ? 'bg-gold/15 text-fg' : 'text-muted hover:text-fg hover:bg-edge/[.06]'}`}
        >
          <Icon name={l.icon} className={`w-[18px] h-[18px] ${active(l.href) ? 'text-gold' : ''}`} />
          <span className="flex-1">{l.label}</span>
          {l.badge && unread > 0 && <span className="min-w-5 h-5 px-1.5 rounded-full bg-rose text-white text-[.65rem] font-bold grid place-items-center">{unread}</span>}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden lg:flex flex-col gap-6 sticky top-0 h-screen p-5 border-r border-edge/10 bg-bg2">
        <Link href="/admin" className="px-2 pt-1">
          <div className="font-display font-bold">Admin</div>
          <div className="font-mono text-[.6rem] tracking-[.2em] text-gold mt-0.5">CONTROL PANEL</div>
        </Link>
        {nav}
        <div className="space-y-1 border-t border-edge/10 pt-4">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-muted hover:text-fg hover:bg-edge/[.06]"><Icon name="external" className="w-[18px] h-[18px]" /> View site</a>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-muted hover:text-rose hover:bg-rose/10"><Icon name="logout" className="w-[18px] h-[18px]" /> Log out</button>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-edge/10 bg-bg/90 backdrop-blur">
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-2 -ml-2"><Icon name="menu" className="w-6 h-6" /></button>
          <span className="font-display font-bold">Admin</span>
          <ThemeToggle />
        </div>
        {open && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="w-[270px] bg-bg2 p-5 flex flex-col gap-6 overflow-y-auto">{nav}
              <button onClick={logout} className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-muted"><Icon name="logout" className="w-[18px] h-[18px]" /> Log out</button>
            </div>
            <button className="flex-1 bg-black/60" aria-label="Close menu" onClick={() => setOpen(false)} />
          </div>
        )}
        <div className="hidden lg:flex justify-end px-8 pt-5"><ThemeToggle /></div>
        <div className="px-4 sm:px-8 pb-24 pt-4 lg:pt-2 max-w-[1100px]">{children}</div>
      </div>
    </div>
  );
}
