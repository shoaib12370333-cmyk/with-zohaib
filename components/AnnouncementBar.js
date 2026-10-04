import Link from 'next/link';
import Icon from './Icons';

export default function AnnouncementBar({ data }) {
  if (!data?.enabled || !data.text) return null;
  return (
    <div className="relative z-[110] bg-gradient-to-r from-gold/20 via-gold/10 to-teal/20 border-b border-gold/20 text-center text-[.82rem] py-2.5 px-4">
      <span className="text-fg/90">{data.text}</span>
      {data.linkLabel && (
        <Link href={data.linkHref || '/contact'} className="ml-2 font-semibold text-gold hover:underline inline-flex items-center gap-1">
          {data.linkLabel} <Icon name="arrow" className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}
