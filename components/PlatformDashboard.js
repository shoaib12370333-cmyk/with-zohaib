'use client';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

const DAYS = 90;
const SAMPLE_NOTE = 'Illustrative sample data — not real client results.';

// Deterministic pseudo-random so server and client render identical bars.
// (Math.random is only used inside the post-mount effect that animates today's bar.)
function seeded(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Turns the admin-entered checkpoints into a 90-day SAMPLE daily series.
function buildSeries(chart, key, lo, hi) {
  const values = chart?.length ? chart : [10, 20, 30, 40, 50];
  const n = values.length;
  const min = Math.min(...values);
  const max = Math.max(...values, min + 1);
  const toVal = (v) => lo + ((v - min) / (max - min)) * (hi - lo);
  const base = [...key].reduce((a, c) => a + c.charCodeAt(0), 0);
  return Array.from({ length: DAYS }, (_, i) => {
    const pos = n > 1 ? (i / (DAYS - 1)) * (n - 1) : 0;
    const i0 = Math.floor(pos);
    const i1 = Math.min(i0 + 1, n - 1);
    const v = values[i0] + (values[i1] - values[i0]) * (pos - i0);
    const noise = (seeded(base + i * 7.13) - 0.5) * (hi - lo) * 0.16;
    return Math.min(hi, Math.max(lo, Math.round(toVal(v) + noise)));
  });
}

const money = (n) => `$${Math.round(n).toLocaleString('en-US')}`;
const sum = (a) => a.reduce((x, y) => x + y, 0);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const HEX6 = /^#[0-9a-f]{6}$/i;

// Readable label colour on a brand-coloured pill: whichever of white or ink gives
// the higher WCAG contrast (the label is tiny mono text, so it needs the 4.5:1 body-text bar,
// not the 3:1 large-text one). The crossover sits at a relative luminance of about 0.179.
const INK_LUM = 0.005; // relative luminance of #0A0F1E
function textOn(color) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((color || '').trim());
  if (!m) return '#fff';
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const onWhite = 1.05 / (lum + 0.05);
  const onInk = (lum + 0.05) / (INK_LUM + 0.05);
  return onWhite >= onInk ? '#fff' : '#0A0F1E';
}

// "Aug 14" style label for a bar, N days back from today. Only ever called from a
// pointer handler / after mount, so server and client markup never disagree.
function dateLabel(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Eases the displayed figures toward new targets (e.g. when the platform tab
// changes) instead of snapping. First render shows the real numbers immediately
// so server HTML and hydration match; reduced-motion users get the snap.
function useCountUp(targets) {
  const key = targets.join('|');
  const [shown, setShown] = useState(targets);
  const current = useRef(targets); // what is on screen right now (mid-flight safe)

  useEffect(() => {
    const to = targets;
    const from = current.current;
    if (to.every((v, i) => v === from[i])) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      current.current = to;
      setShown(to);
      return undefined;
    }
    let raf = 0;
    const t0 = performance.now();
    const DURATION = 950;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / DURATION);
      const e = 1 - (1 - p) ** 4; // easeOutQuart
      current.current = p === 1 ? to : to.map((v, i) => from[i] + (v - from[i]) * e);
      setShown(current.current);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // `key` is the stable identity of `targets`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return shown;
}

// Summary rows + footer. Lives in its own component so the per-frame count-up
// re-renders only this block, never the 90 bars.
function Figures({ today, last7, last31, last90, delta, listings, sessions }) {
  const listingsNum = Number(listings);
  const numericListings = listings !== '' && listings != null && Number.isFinite(listingsNum);
  const v = useCountUp([today, last7, last31, last90, Math.abs(delta), numericListings ? listingsNum : 0]);
  const up = delta >= 0;
  const row = 'flex justify-between items-center py-[.55rem] border-t border-edge/10';
  const label = 'font-mono text-[.66rem] text-faint';
  const val = 'font-display font-bold text-fg text-[.92rem] tabular-nums';

  return (
    <>
      <div className="px-[1.1rem] pb-2 mt-3">
        <div className={row}><span className={label}>Today</span><span className={val}>{money(v[0])}</span></div>
        <div className={row}><span className={label}>Last 7 days</span><span className={val}>{money(v[1])}</span></div>
        <div className={row}>
          <span className={`flex items-center gap-2 ${label}`}>
            Last 31 days
            <span className={`font-semibold tabular-nums ${up ? 'text-teal' : 'text-[#FF7A90]'}`} title="vs the previous 31 days (sample data)">
              {up ? '▲' : '▼'} {v[4].toFixed(1)}%
            </span>
          </span>
          <span className={val}>{money(v[2])}</span>
        </div>
        <div className={`${row} border-b`}><span className={label}>Last 90 days</span><span className={val}>{money(v[3])}</span></div>
      </div>

      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 px-[1.1rem] py-[.9rem]">
        <span className="font-mono text-[.64rem] text-faint/80">
          LISTINGS OPTIMIZED <b className="text-fg font-semibold tabular-nums">{numericListings ? Math.round(v[5]) : listings}</b>
        </span>
        <span className="font-mono text-[.64rem] text-faint/80">
          COACHING SESSIONS <b className="text-fg font-semibold">{sessions}</b>
        </span>
      </div>
    </>
  );
}

export default function PlatformDashboard({ platforms = [], disclaimer }) {
  const uid = useId();
  const list = Array.isArray(platforms) ? platforms : [];
  const [activeKey, setActiveKey] = useState(list[2]?.key || list[0]?.key);
  const [switched, setSwitched] = useState(false); // false = first paint (bars wait for the card's entrance)
  const [hover, setHover] = useState(null);
  const [months, setMonths] = useState(null); // calendar months — computed after mount (hydration-safe)
  const [pill, setPill] = useState(null); // measured box of the active tab → sliding highlight

  const barsRef = useRef(null);
  const tabsRef = useRef(null);
  const btnRefs = useRef({});
  const clearTimer = useRef(0);

  const active = list.find((p) => p.key === activeKey) || list[0];
  const activeId = active?.key;

  const lo = Number.isFinite(active?.dailyMin) ? active.dailyMin : 30;
  const hiRaw = Number.isFinite(active?.dailyMax) ? active.dailyMax : 220;
  const hi = hiRaw > lo ? hiRaw : lo + 1;
  const baseSeries = useMemo(() => (active ? buildSeries(active.chart, active.key || 'x', lo, hi) : []), [active, lo, hi]);

  // "Live" today bar. Server and first client render show the same deterministic starting
  // value (so hydration matches); after mount the bar creeps upward in small, slightly
  // irregular steps — the way a day's revenue builds up — and settles near its ceiling.
  const baseToday = baseSeries.length ? baseSeries[baseSeries.length - 1] : lo;
  const startToday = Math.max(lo, Math.round(baseToday * 0.72));
  const capToday = Math.max(startToday + 1, Math.min(hi, Math.round(baseToday * 1.1)));
  const [live, setLive] = useState(null);

  useEffect(() => {
    if (!activeId || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let cur = startToday;
    let timer = 0;
    const tick = () => {
      if (document.visibilityState === 'visible') {
        const step = (capToday - startToday) * (0.03 + Math.random() * 0.04); // 3–7% of the climb
        const dip = Math.random() < 0.12; // the odd small pull-back keeps it believable
        cur = clamp(cur + (dip ? -step * 0.35 : step), startToday, capToday);
        setLive({ key: activeId, v: Math.round(cur) });
      }
      timer = setTimeout(tick, 1200 + Math.random() * 1200);
    };
    setLive({ key: activeId, v: startToday });
    timer = setTimeout(tick, 1200);
    return () => clearTimeout(timer);
  }, [activeId, startToday, capToday]);

  // x-axis: the last 4 calendar months, filled in on the client only.
  useEffect(() => {
    const now = new Date();
    setMonths([3, 2, 1, 0].map((i) => new Date(now.getFullYear(), now.getMonth() - i, 1).toLocaleString('en-US', { month: 'short' })));
  }, []);

  // Slide the highlight under whichever tab is active (wrap-safe: uses offsetTop too).
  const measure = useCallback(() => {
    const b = btnRefs.current[activeId];
    if (!b) return;
    const next = { x: b.offsetLeft, y: b.offsetTop, w: b.offsetWidth, h: b.offsetHeight };
    setPill((p) => (p && p.x === next.x && p.y === next.y && p.w === next.w && p.h === next.h ? p : next));
  }, [activeId]);

  useEffect(() => {
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    if (tabsRef.current) ro.observe(tabsRef.current);
    Object.values(btnRefs.current).forEach((b) => b && ro.observe(b));
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => () => clearTimeout(clearTimer.current), []);

  if (!active) return null;

  const color = active.color || '#E2A63D';
  const glow = HEX6.test(color) ? `${color}99` : color;
  // Today's bar is the live one; every other bar keeps its fixed sample value.
  // (a value left over from another platform tab is ignored for the one frame before the effect resets it)
  const series = [...baseSeries.slice(0, -1), live && live.key === activeId ? live.v : startToday];
  // Fixed scale (includes the ceiling today can reach) so bars never rescale while it climbs.
  const max = Math.max(...baseSeries.slice(0, -1), capToday, 1);
  const today = series[series.length - 1];
  const last7 = sum(series.slice(-7));
  const last31 = sum(series.slice(-31));
  const last90 = sum(series);
  const prev31 = sum(series.slice(-62, -31));
  const delta = prev31 > 0 ? ((last31 - prev31) / prev31) * 100 : 0;

  const select = (key) => {
    if (key === activeKey) return;
    setActiveKey(key);
    setSwitched(true);
    setHover(null);
  };

  const onTabKey = (e) => {
    const i = list.findIndex((p) => p.key === active.key);
    let n = -1;
    if (e.key === 'ArrowRight') n = (i + 1) % list.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + list.length) % list.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = list.length - 1;
    if (n < 0) return;
    e.preventDefault();
    select(list[n].key);
    btnRefs.current[list[n].key]?.focus();
  };

  const pointerAt = (clientX) => {
    const r = barsRef.current?.getBoundingClientRect();
    if (!r || !r.width) return;
    const t = clamp((clientX - r.left) / r.width, 0, 1);
    setHover(Math.min(series.length - 1, Math.floor(t * series.length)));
  };
  // Mouse: tooltip follows the cursor and leaves with it. Touch: it stays a moment after the finger lifts.
  const releasePointer = (e) => {
    clearTimeout(clearTimer.current);
    if (e.pointerType === 'mouse') setHover(null);
    else clearTimer.current = setTimeout(() => setHover(null), 2200);
  };

  const tipLeft = hover == null ? 0 : clamp(((hover + 0.5) / series.length) * 100, 12, 88);
  const barBase = switched ? 0 : 450; // first paint: wait for the hero card to settle, then grow

  return (
    <div
      role="group"
      aria-label="Sample revenue dashboard (illustrative data)"
      className="relative bg-surface border border-edge/10 rounded-2xl shadow-cardLg overflow-hidden max-w-[480px] lg:max-w-none"
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-[1.1rem] py-[.9rem] border-b border-edge/10">
        <div ref={tabsRef} role="tablist" aria-label="Platform" onKeyDown={onTabKey} className="relative flex flex-wrap gap-[.4rem]">
          {pill && (
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 rounded-full pointer-events-none transition-[transform,width,height,background-color,box-shadow] duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
              style={{
                width: pill.w,
                height: pill.h,
                transform: `translate3d(${pill.x}px, ${pill.y}px, 0)`,
                backgroundColor: color,
                boxShadow: `0 8px 20px -8px ${glow}`,
              }}
            />
          )}
          {list.map((p) => {
            const on = p.key === active.key;
            const c = p.color || '#E2A63D';
            return (
              <button
                key={p.key}
                ref={(el) => { btnRefs.current[p.key] = el; }}
                id={`${uid}-tab-${p.key}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`${uid}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => select(p.key)}
                className={`relative z-10 px-[.7em] py-[.35em] rounded-full font-mono text-[.68rem] tracking-[.03em] transition-colors duration-300 ${on ? '' : 'text-faint hover:text-fg'}`}
                style={on ? { color: textOn(c), backgroundColor: pill ? 'transparent' : c } : undefined}
              >
                {p.name}
              </button>
            );
          })}
        </div>
        {/* LIVE badge: a pulsing dot in the active platform's colour. The disclaimer line at the
            bottom of the card still states the figures are illustrative. */}
        <span className="flex items-center gap-[.4rem] text-faint">
          <i className="pulse-dot w-[6px] h-[6px] rounded-full block" style={{ backgroundColor: color, color }} aria-hidden="true" />
          <span className="font-mono text-[.6rem] tracking-[.1em]">LIVE</span>
        </span>
      </div>

      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${active.key}`}>
        <div className="px-[1.1rem] pt-[1.3rem] pb-1">
          <div className="flex justify-between items-end gap-3 mb-4">
            <div>
              <span className="block font-display font-bold text-[1.05rem] text-fg">Sales</span>
              <span key={active.key} className="block font-mono text-[.62rem] tracking-[.05em] text-faint/80 mt-[.2rem] animate-rise">
                {active.name} · daily revenue
              </span>
            </div>
            <span className="font-mono text-[.66rem] text-gold border border-gold/40 px-[.6em] py-[.3em] rounded-full whitespace-nowrap">90-DAY VIEW</span>
          </div>

          <div
            ref={barsRef}
            role="img"
            aria-label={`${active.name} sample daily revenue over the last 90 days. Today: ${money(today)}.`}
            className="relative flex items-end gap-[2px] h-[120px] cursor-crosshair touch-pan-y select-none"
            onPointerDown={(e) => { clearTimeout(clearTimer.current); pointerAt(e.clientX); }}
            onPointerMove={(e) => pointerAt(e.clientX)}
            onPointerUp={releasePointer}
            onPointerLeave={releasePointer}
            onPointerCancel={() => setHover(null)}
          >
            {[1, 0.5, 0].map((t) => (
              <div key={t} className="absolute inset-x-0 border-t border-dashed border-edge/[.12] pointer-events-none" style={{ bottom: `${t * 100}%` }} />
            ))}

            {series.map((v, i) => {
              const isToday = i === series.length - 1;
              // hovered bar is fully lit and its neighbours fall off smoothly → a soft "ripple"
              const op = hover == null ? (isToday ? 1 : 0.55) : Math.max(isToday ? 0.85 : 0.4, 1 - Math.abs(i - hover) * 0.11);
              return (
                <div
                  key={`${active.key}-${i}`}
                  className="flex-1 origin-bottom rounded-t-[1.5px]"
                  style={{
                    height: `${Math.max(3, (v / max) * 100)}%`,
                    backgroundColor: color,
                    opacity: op,
                    boxShadow: isToday ? `0 0 10px 0 ${glow}` : undefined,
                    transition: isToday ? 'opacity .2s ease, height 1.1s cubic-bezier(.2,.7,.2,1)' : 'opacity .2s ease',
                    animation: `grow .7s var(--ease) ${barBase + i * 7}ms both`,
                  }}
                />
              );
            })}

            {hover != null && (
              // outer box positions (translate), inner box animates — so the two transforms never fight
              <div className="absolute bottom-full mb-2 -translate-x-1/2 pointer-events-none z-10" style={{ left: `${tipLeft}%` }}>
                <div className="bg-bg border border-edge/15 rounded-md px-2 py-1 whitespace-nowrap shadow-card animate-rise">
                  <span className="block font-mono text-[.58rem] text-faint">{dateLabel(series.length - 1 - hover)}</span>
                  <span className="block font-display font-bold text-[.72rem] text-fg">{money(series[hover])}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-[.4rem] transition-opacity duration-500" style={{ opacity: months ? 1 : 0 }} aria-hidden="true">
            {(months || ['', '', '', '']).map((m, i) => (
              <span key={i} className="font-mono text-[.6rem] tracking-[.05em] text-faint/70">{m || ' '}</span>
            ))}
          </div>
        </div>

        <Figures
          today={today}
          last7={last7}
          last31={last31}
          last90={last90}
          delta={delta}
          listings={active.listingsOptimized}
          sessions={active.coachingSessions}
        />
      </div>

      <p className="px-[1.1rem] py-[.7rem] border-t border-edge/10 bg-edge/[.03] text-[.7rem] leading-snug text-faint">{disclaimer || SAMPLE_NOTE}</p>
    </div>
  );
}
