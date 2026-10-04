import Link from 'next/link';
import Icon from './Icons';
import Reveal from './Reveal';
import { waLink } from '@/lib/links';
import { slugifyService } from '@/lib/seo';

const SOCIALS = [
  ['instagram', 'insta', 'Instagram'],
  ['facebook', 'fb', 'Facebook'],
  ['youtube', 'youtube', 'YouTube'],
  ['tiktok', 'tiktok', 'TikTok'],
  ['linkedin', 'linkedin', 'LinkedIn'],
];

const QUICK_LINKS = [['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/blog', 'Blog'], ['/contact', 'Contact']];

// Original ink footer: round social buttons that turn teal and lift on hover.
const SOCIAL_BTN =
  'grid h-[42px] w-[42px] place-items-center rounded-full bg-surface text-fg focus-visible:rounded-full transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-1 hover:scale-105 hover:bg-[#1D9488] hover:shadow-[0_10px_22px_-8px_rgba(29,148,136,.65)]';
const COL_TITLE = 'mb-4 font-mono text-[.72rem] uppercase tracking-[.1em] text-fg';
// .link-u draws an underline in on hover (and already transitions colour)
const LINK = 'link-u hover:text-fg';

export default function Footer({ content }) {
  const brand = content?.brand || {};
  const year = new Date().getFullYear();
  const wa = waLink(brand.whatsapp);
  const services = (content?.servicesOverview || []).slice(0, 6);
  const socials = SOCIALS.filter(([key]) => /^https?:/i.test(brand[key] || ''));
  const hours = content?.contact?.hours;

  return (
    <footer className="dz bg-bg relative pt-[5.5rem]">
      {/* gentle gold hairline across the top edge — draws in as the footer scrolls into view */}
      <Reveal from="line" aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-gold via-gold/50 to-transparent" />

      {/* text colour lives here, not on the .dz footer itself (.dz sets its own colour and would win) */}
      <div className="wrap text-muted">
        {/* from="none": the grid stays put, its four columns stagger up one after another */}
        <Reveal from="none" stagger={80} className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-8">
          <Reveal>
            <Link href="/" className="group/b inline-flex items-center gap-[.7rem]">
              <span className="h-10 w-10 flex-none overflow-hidden rounded-full border-2 border-gold bg-surface transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover/b:-rotate-6 group-hover/b:scale-110">
                {brand.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brand.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center font-display text-sm font-extrabold text-gold">EZ</span>
                )}
              </span>
              <span className="leading-tight text-fg">
                <span className="block font-display text-[1.02rem] font-bold">{brand.name}</span>
                <span className="mt-[2px] block font-mono text-[.62rem] tracking-[.16em] text-gold">{brand.sub}</span>
              </span>
            </Link>
            <p className="mt-4 max-w-[26em] text-[.92rem] leading-relaxed">{content?.footer?.blurb || brand.tagline}</p>
            <div className="mt-5 flex flex-wrap gap-[.7rem]">
              {socials.map(([key, icon, label]) => (
                <a key={key} href={brand[key]} target="_blank" rel="noopener noreferrer" aria-label={label} className={SOCIAL_BTN}>
                  <Icon name={icon} className="h-[19px] w-[19px]" />
                </a>
              ))}
              {brand.whatsapp && (
                <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={SOCIAL_BTN}>
                  <Icon name="whatsapp" className="h-[19px] w-[19px]" />
                </a>
              )}
            </div>
          </Reveal>

          <Reveal as="nav" aria-label="Footer">
            <h4 className={COL_TITLE}>Quick Links</h4>
            <ul className="space-y-[.7rem] text-[.92rem]">
              {QUICK_LINKS.map(([href, label]) => (
                <li key={href}><Link href={href} className={LINK}>{label}</Link></li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="nav" aria-label="Services">
            <h4 className={COL_TITLE}>Services</h4>
            <ul className="space-y-[.7rem] text-[.92rem]">
              {services.map((s) => (
                <li key={s.slug || s.title}><Link href={`/services/${s.slug || slugifyService(s.title)}`} className={LINK}>{s.title}</Link></li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <h4 className={COL_TITLE}>Contact</h4>
            <ul className="space-y-[.7rem] text-[.92rem]">
              {brand.email && <li><a href={`mailto:${brand.email}`} className={`${LINK} break-all`}>{brand.email}</a></li>}
              {brand.phoneDisplay && <li><a href={wa} className={LINK}>{brand.phoneDisplay}</a></li>}
              {hours && <li className="text-sm text-faint">{hours}</li>}
            </ul>
            {/* magnetic wrapper keeps the pointer-follow separate from the button's own hover lift */}
            <span data-magnetic="0.2" className="mt-6 inline-block">
              <Link href="/contact" className="btn btn-primary btn-sm focus-visible:rounded-full">
                {brand.bookCallLabel || 'Book Free Call'} <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </span>
          </Reveal>
        </Reveal>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-edge/[.12] py-5 text-[.82rem]">
          <p>© {year} {brand.name} {brand.sub}. All rights reserved.</p>
          {/* right padding keeps these links clear of the floating WhatsApp button */}
          <div className="flex gap-6 pr-[4.5rem]">
            <Link href="/privacy" className={LINK}>Privacy</Link>
            <Link href="/admin/login" className={LINK}>Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
