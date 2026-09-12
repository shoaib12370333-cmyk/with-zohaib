import Link from 'next/link';
import Icon from './Icons';
import { waLink as buildWaLink } from '@/lib/links';

export default function Footer({ content }) {
  const brand = content?.brand || {};
  const year = new Date().getFullYear();
  const waLink = buildWaLink(brand.whatsapp);

  return (
    <footer className="bg-ink text-[#AEB6C4] pt-[5.5rem]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10">
          <div>
            <div className="flex items-center gap-[.7rem]">
              <span className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold bg-ink2 flex-none">
                {brand.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brand.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-gold font-display font-extrabold text-sm">EZ</span>
                )}
              </span>
              <span className="leading-tight text-white">
                <span className="block font-display font-bold text-[1.02rem]">{brand.name || 'E-Commerce'}</span>
                <span className="block font-mono-eyebrow text-[.62rem] tracking-[.16em] text-gold mt-[2px]">{brand.sub || 'WITH ZOHAIB'}</span>
              </span>
            </div>
            <p className="mt-4 text-[.92rem] max-w-[26em]">{brand.tagline}</p>
            <div className="flex gap-[.7rem] mt-5">
              <a href={brand.instagram || '#'} aria-label="Instagram" className="w-[42px] h-[42px] rounded-full bg-ink2 text-white flex items-center justify-center hover:bg-teal hover:-translate-y-0.5 transition-all">
                <Icon name="insta" className="w-[19px] h-[19px]" />
              </a>
              <a href={brand.facebook || '#'} aria-label="Facebook" className="w-[42px] h-[42px] rounded-full bg-ink2 text-white flex items-center justify-center hover:bg-teal hover:-translate-y-0.5 transition-all">
                <Icon name="fb" className="w-[19px] h-[19px]" />
              </a>
              <a href={waLink} aria-label="WhatsApp" className="w-[42px] h-[42px] rounded-full bg-ink2 text-white flex items-center justify-center hover:bg-teal hover:-translate-y-0.5 transition-all">
                <Icon name="whatsapp" className="w-[19px] h-[19px]" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-mono-eyebrow text-[.72rem] tracking-[.1em] text-white uppercase mb-4">Quick Links</h4>
            <ul className="space-y-[.7rem] text-[.92rem]">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono-eyebrow text-[.72rem] tracking-[.1em] text-white uppercase mb-4">Services</h4>
            <ul className="space-y-[.7rem] text-[.92rem]">
              <li><Link href="/services" className="hover:text-white">Marketplace Setup</Link></li>
              <li><Link href="/services" className="hover:text-white">1-on-1 Coaching</Link></li>
              <li><Link href="/services" className="hover:text-white">Graphic Design</Link></li>
              <li><Link href="/services" className="hover:text-white">Web &amp; App Development</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono-eyebrow text-[.72rem] tracking-[.1em] text-white uppercase mb-4">Contact</h4>
            <ul className="space-y-[.7rem] text-[.92rem]">
              <li>{brand.email}</li>
              <li><a href={waLink} className="hover:text-white">{brand.phoneDisplay}</a></li>
              <li><Link href="/contact" className="hover:text-white">Book a Free Call →</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4 border-t border-lineDark py-5 text-[.82rem]">
          <p>© {year} {brand.name} {brand.sub}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/admin/login" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
