const CARD_W = 160;
const CARD_H = 96;
const CARD_PAD = 14;
const MAX_LOGO_H = CARD_H - CARD_PAD * 2;
const MAX_LOGO_W = CARD_W - CARD_PAD * 2;

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
          // The card size never changes — the logo size slider only controls
          // how much of that fixed card the logo fills (capped at the card's
          // padded content area so it can never grow the box).
          const requestedLogoH = item.logoSize || (logoOnly ? 64 : 24);
          const logoH = Math.min(requestedLogoH, MAX_LOGO_H);
          return (
            <span
              key={i}
              style={{ width: CARD_W, height: CARD_H, padding: CARD_PAD }}
              className="font-display font-extrabold text-[1.1rem] text-ink whitespace-nowrap flex items-center justify-center gap-3 flex-none border-[1.5px] border-line rounded-lg bg-white shadow-sm mr-3 box-border"
            >
              {item.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.logoUrl}
                  alt={item.name || ''}
                  className="w-auto object-contain flex-none mx-auto"
                  style={{ height: `${logoH}px`, maxWidth: `${MAX_LOGO_W}px` }}
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
