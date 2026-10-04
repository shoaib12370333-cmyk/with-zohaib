// Logo wall. Uses an uploaded logo when present, otherwise a clean wordmark chip.
export default function Marquee({ label, items = [] }) {
  if (!items.length) return null;
  const row = [...items, ...items];
  return (
    <section aria-label={label} className="relative py-10 border-y border-edge/10 bg-bg2/60">
      <p className="text-center font-mono text-[.7rem] tracking-[.2em] uppercase text-faint mb-7">{label}</p>
      <div className="marquee-mask overflow-hidden">
        <div className="marquee" style={{ '--speed': `${Math.max(20, items.length * 7)}s` }}>
          {row.map((it, i) => (
            <div key={`${it.name}-${i}`} aria-hidden={i >= items.length} className="mx-3 flex-none h-14 min-w-[10rem] px-7 rounded-2xl border border-edge/10 bg-surface/60 grid place-items-center">
              {it.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.logoUrl} alt={it.name} loading="lazy" decoding="async" className="max-h-8 max-w-[8rem] object-contain" />
              ) : (
                <span className="font-display font-bold text-lg tracking-tight text-muted">{it.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
