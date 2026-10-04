import Link from 'next/link';
import Icon from './Icons';

// Slides down out of the top edge on load (CSS only — works without JS).
const BAR_CSS = '@keyframes annDown{from{transform:translateY(-100%);opacity:0}to{transform:none;opacity:1}}.ann-in{animation:annDown .8s var(--ease) .15s both}';

// Ink announcement strip above the header. The header measures this element
// (data-announcement) to know how far to sit below it while it is still on screen.
export default function AnnouncementBar({ data }) {
  if (!data?.enabled || !data.text) return null;
  return (
    <div
      data-announcement=""
      role="region"
      aria-label="Announcement"
      className="ann-in dz relative z-[110] border-b border-white/10 px-4 py-2 text-center"
    >
      <style>{BAR_CSS}</style>
      <p className="mx-auto max-w-[1200px] flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 font-display text-[.78rem] font-medium leading-5 text-muted">
        <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-gold text-gold" aria-hidden="true" />
        <span>{data.text}</span>
        {data.linkLabel && (
          <Link href={data.linkHref || '/contact'} className="link-u inline-flex items-center gap-1 font-bold text-gold">
            {data.linkLabel} <Icon name="arrow" className="w-3.5 h-3.5" />
          </Link>
        )}
      </p>
    </div>
  );
}
