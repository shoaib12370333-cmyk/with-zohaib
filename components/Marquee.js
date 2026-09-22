export default function Marquee({ label, items, speed = 26 }) {
  const list = items && items.length ? items : [];
  // Repeat generously (not just x2) so the strip never runs out of content on
  // wide screens — as long as both halves below are identical, the -50%
  // animation loop stays perfectly seamless no matter the repeat count.
  const REPEATS = 6;
  const repeated = Array.from({ length: REPEATS }, () => list).flat();

  return (
    <div className="marquee-wrap bg-paper border-y border-line py-5 overflow-hidden">
      <p className="font-mono-eyebrow text-[.7rem] tracking-[.14em] text-slateSoft text-center mb-4">{label}</p>
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {repeated.map((item, i) => {
          const hasName = item.name && item.name.trim().length > 0;
          const logoOnly = item.logoUrl && !hasName;
          const logoSize = item.logoSize || (logoOnly ? 64 : 24);
          return (
            <span
              key={i}
              className="font-display font-extrabold text-[1.1rem] text-ink whitespace-nowrap flex items-center justify-center gap-3 px-8 py-[.7rem] min-w-[160px] border-[1.5px] border-line rounded-lg bg-white shadow-sm mr-3"
            >
              {item.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.logoUrl}
                  alt={item.name || ''}
                  className="w-auto object-contain flex-none mx-auto"
                  style={{ height: `${logoSize}px`, maxWidth: `${logoSize * 2.3}px` }}
                />
              )}
              {hasName && item.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
