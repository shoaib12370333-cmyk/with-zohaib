import Link from 'next/link';
import Icon from './Icons';
import { waLink } from '@/lib/links';

const SOCIALS = [
  ['instagram', 'insta', 'Instagram'],
  ['facebook', 'fb', 'Facebook'],
  ['youtube', 'youtube', 'YouTube'],
  ['tiktok', 'tiktok', 'TikTok'],
  ['linkedin', 'linkedin', 'LinkedIn'],
];

export default function Footer({ content }) {
  const brand = content?.brand || {};
  const year = new Date().getFullYear();
  const wa = waLink(brand.whatsapp);
  const services = (content?.servicesOverview || []).slice(0, 6);
  const socials = SOCIALS.filter(([key]) => /^https?:/i.test(brand[key] || ''));

  return (
    <footer className="relative mt-10 border-t border-edge/10 bg-bg2 overflow-hidden">
      <div className="aurora"><i className="w-[40rem] h-[40rem] bg-gold/10 -bottom-60 -left-40" /><i className="w-[34rem] h-[34rem] bg-teal/10 -top-60 right-0" /></div>
      <div className="wrap relative pt-16 pb-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gold/70 bg-surface2 grid place-items-center">
                {brand.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brand.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display font-extrabold text-sm text-gold">EZ</span>
                )}
              </span>
              <span className="leading-none">
                <span className="block font-display font-bold text-lg">{brand.name}</span>
                <span className="block font-mono text-[.6rem] tracking-[.22em] text-gold mt-1">{brand.sub}</span>
              </span>
            </Link>
            <p className="mt-5 text-muted max-w-[34ch] leading-relaxed">{content?.footer?.blurb || brand.tagline}</p>
            <div className="flex gap-2 mt-6">
              {socials.map(([key, icon, label]) => (
                <a key={key} href={brand[key]} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-10 h-10 rounded-full border border-edge/15 grid place-items-center text-muted hover:text-gold hover:border-gold/60 hover:-translate-y-0.5 transition-all">
                  <Icon name={icon} className="w-[18px] h-[18px]" />
                </a>
              ))}
              {brand.whatsapp && (
                <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full border border-edge/15 grid place-items-center text-muted hover:text-gold hover:border-gold/60 hover:-translate-y-0.5 transition-all">
                  <Icon name="whatsapp" className="w-[18px] h-[18px]" />
                </a>
              )}
            </div>
          </div>

          <nav aria-label="Footer">
            <h4 className="font-mono text-[.7rem] tracking-[.18em] uppercase text-faint mb-5">Explore</h4>
            <ul className="space-y-3 text-[.95rem]">
              {[['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/blog', 'Blog'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href}><Link href={href} className="text-muted hover:text-fg transition-colors">{label}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <h4 className="font-mono text-[.7rem] tracking-[.18em] uppercase text-faint mb-5">Services</h4>
            <ul className="space-y-3 text-[.95rem]">
              {services.map((s) => (
                <li key={s.slug}><Link href={`/services/${s.slug}`} className="text-muted hover:text-fg transition-colors">{s.title}</Link></li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="font-mono text-[.7rem] tracking-[.18em] uppercase text-faint mb-5">Talk to us</h4>
            <ul className="space-y-3 text-[.95rem]">
              {brand.email && <li><a href={`mailto:${brand.email}`} className="text-muted hover:text-fg transition-colors break-all">{brand.email}</a></li>}
              {brand.phoneDisplay && <li><a href={wa} className="text-muted hover:text-fg transition-colors">{brand.phoneDisplay}</a></li>}
              <li className="text-faint text-sm">{content?.contact?.hours}</li>
            </ul>
            <Link href="/contact" className="btn btn-primary btn-sm mt-6">{brand.bookCallLabel || 'Book Free Call'} <Icon name="arrow" className="w-4 h-4" /></Link>
          </div>
        </div>

        <div className="hairline mt-14" />
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 text-[.82rem] text-faint">
          <p>© {year} {brand.name} {brand.sub}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-fg transition-colors">Privacy</Link>
            <Link href="/admin/login" className="hover:text-fg transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
