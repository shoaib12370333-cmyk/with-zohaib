'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Reveal from './Reveal';

const DAYS = 90;
const BAR_MIN = 30;
const BAR_MAX = 220;

// Deterministic pseudo-random in [0,1) so the same day always renders the
// same bar height on server and client (avoids hydration mismatches) —
// only "today" (added later via an interval) is genuinely randomized.
function seeded(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Turns a handful of admin-entered checkpoint numbers into a 90-day daily
// series: interpolated between checkpoints and given light day-to-day
// texture, landing in a believable per-day sales range for a small store.
function buildDailySeries(chartValues, platformKey) {
  const values = chartValues && chartValues.length ? chartValues : [10, 20, 30, 40, 50];
  const n = values.length;
  const min = Math.min(...values);
  const max = Math.max(...values, min + 1);
  const toDollar = (v) => BAR_MIN + ((v - min) / (max - min)) * (BAR_MAX - BAR_MIN);
  const seedBase = platformKey.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  const daily = [];
  for (let i = 0; i < DAYS; i++) {
    const pos = n > 1 ? (i / (DAYS - 1)) * (n - 1) : 0;
    const i0 = Math.floor(pos);
    const i1 = Math.min(i0 + 1, n - 1);
    const frac = pos - i0;
    const base = values[i0] + (values[i1] - values[i0]) * frac;
    const dollarBase = toDollar(base);
    const noise = (seeded(seedBase + i) - 0.5) * dollarBase * 0.3;
    daily.push(Math.max(8, Math.round(dollarBase + noise)));
  }
  return daily;
}

function dateLabel(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
}

function fmtMoney(n) {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export default function PlatformDashboard({ platforms }) {
  const list = platforms && platforms.length ? platforms : [];
  const [activeKey, setActiveKey] = useState(list[2]?.key || list[0]?.key);
  const active = list.find((p) => p.key === activeKey) || list[0];
  const color = active?.color || 'var(--c-teal)';

  const daily = useMemo(() => buildDailySeries(active?.chart, active?.key || 'platform'), [active?.chart, active?.key]);

  // "Today" ticks live every ~2s with a small, believable jitter — a real
  // dashboard's live number nudges slightly, it doesn't leap around.
  const [liveToday, setLiveToday] = useState(null);
  useEffect(() => {
    setLiveToday(null);
    const base = daily[daily.length - 1];
    const tick = () => {
      const jitter = (Math.random() - 0.45) * base * 0.1;
      setLiveToday(Math.max(8, Math.round(base + jitter)));
    };
    tick();
    const id = setInterval(tick, 2000);
    return () => clearInterval(id);
  }, [daily]);

  const barsRef = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(null);

  if (!active) return null;

  const series = liveToday != null ? [...daily.slice(0, -1), liveToday] : daily;
  const sum = (arr) => arr.reduce((a, b) => a + b, 0);

  const today = series[series.length - 1];
  const last7 = sum(series.slice(-7));
  const last31 = sum(series.slice(-31));
  const last90 = sum(series);
  const prev31 = sum(daily.slice(-62, -31));
  const rawPct = prev31 > 0 ? Math.abs(((last31 - prev31) / prev31) * 100) : 14;
  const pctChange = Math.min(32, Math.max(6, rawPct));

  const maxBar = Math.max(...series, 1);
  const yTicks = [1, 0.5, 0];

  function handleBarMove(clientX) {
    const el = barsRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setHoverIdx(Math.min(series.length - 1, Math.floor(ratio * series.length)));
  }

  return (
    <Reveal className="bg-ink2 border border-lineDark rounded-2xl shadow-cardLg overflow-hidden max-w-[480px] lg:max-w-none">
      <div className="flex items-center justify-between px-[1.1rem] py-[.9rem] border-b border-lineDark">
        <div className="flex gap-[.4rem] flex-wrap">
          {list.map((p) => (
            <button
              key={p.key}
              onClick={() => setActiveKey(p.key)}
              style={p.key === activeKey ? { backgroundColor: p.color || 'var(--c-teal)' } : undefined}
              className={`font-mono-eyebrow text-[.68rem] tracking-[.03em] px-[.7em] py-[.35em] rounded-full transition-colors ${
                p.key === activeKey ? 'text-white' : 'text-[#8B93A6] hover:text-white'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <span className="flex items-center gap-[.4rem] text-[#7B8499]">
          <i className="w-[6px] h-[6px] rounded-full block animate-pulse" style={{ backgroundColor: color }} />
          <span className="font-mono-eyebrow text-[.6rem] tracking-[.1em]">LIVE</span>
        </span>
      </div>

      <div className="px-[1.1rem] pt-[1.3rem] pb-1">
        <div className="flex justify-between items-end mb-[1rem]">
          <div>
            <span className="block font-display font-bold text-[1.05rem] text-white">Sales</span>
            <span className="block font-mono-eyebrow text-[.62rem] tracking-[.05em] text-[#7B8499] mt-[.2rem]">
              {active.name} · daily revenue
            </span>
          </div>
          <span className="font-mono-eyebrow text-[.66rem] text-gold border border-gold/40 px-[.6em] py-[.3em] rounded-full">
            90-DAY VIEW
          </span>
        </div>

        <div
          ref={barsRef}
          className="flex items-end gap-[2px] h-[118px] relative cursor-crosshair"
          onMouseMove={(e) => handleBarMove(e.clientX)}
          onMouseLeave={() => setHoverIdx(null)}
          onTouchStart={(e) => handleBarMove(e.touches[0].clientX)}
          onTouchMove={(e) => handleBarMove(e.touches[0].clientX)}
          onTouchEnd={() => setHoverIdx(null)}
        >
          {yTicks.map((t) => (
            <div key={t} className="absolute left-0 right-0 border-t border-dashed border-[#232D48] pointer-events-none" style={{ bottom: `${t * 100}%` }} />
          ))}
          {series.map((v, i) => {
            const isToday = i === series.length - 1;
            const isHover = hoverIdx === i;
            const h = Math.max(3, (v / maxBar) * 100);
            return (
              <div
                key={i}
                className="flex-1 rounded-t-[1.5px]"
                style={{
                  height: `${h}%`,
                  backgroundColor: color,
                  opacity: isToday || isHover ? 1 : 0.5,
                  boxShadow: isToday ? `0 0 8px 0 ${color}99` : undefined,
                  transition: isToday ? 'height 0.6s ease' : 'opacity 0.15s ease',
                }}
              />
            );
          })}

          {hoverIdx != null && (
            <div
              className="absolute bottom-full mb-1.5 -translate-x-1/2 bg-[#0B1220] border border-lineDark rounded-md px-2 py-1 pointer-events-none whitespace-nowrap z-10"
              style={{ left: `${((hoverIdx + 0.5) / series.length) * 100}%` }}
            >
              <span className="block font-mono-eyebrow text-[.58rem] text-[#7B8499]">{dateLabel(series.length - 1 - hoverIdx)}</span>
              <span className="block font-display font-bold text-[.72rem] text-white">{fmtMoney(series[hoverIdx])}</span>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-[.4rem]">
          {[89, 67, 45, 22, 0].map((daysAgo) => (
            <span key={daysAgo} className="font-mono-eyebrow text-[.58rem] text-[#5C6788]">
              {dateLabel(daysAgo)}
            </span>
          ))}
        </div>
      </div>

      <div className="px-[1.1rem] pb-2 mt-3">
        <div className="flex justify-between items-center py-[.55rem] border-t border-lineDark">
          <span className="font-mono-eyebrow text-[.66rem] text-[#9FA8BA]">Today</span>
          <span className="font-display font-bold text-white text-[.92rem] tabular-nums">{fmtMoney(today)}</span>
        </div>
        <div className="flex justify-between items-center py-[.55rem] border-t border-lineDark">
          <span className="font-mono-eyebrow text-[.66rem] text-[#9FA8BA]">Last 7 days</span>
          <span className="font-display font-bold text-white text-[.92rem] tabular-nums">{fmtMoney(last7)}</span>
        </div>
        <div className="flex justify-between items-center py-[.55rem] border-t border-lineDark">
          <span className="flex items-center gap-2 font-mono-eyebrow text-[.66rem] text-[#9FA8BA]">
            Last 31 days
            <span className="flex items-center gap-[.2em] text-teal font-semibold">▲ {pctChange.toFixed(1)}%</span>
          </span>
          <span className="font-display font-bold text-white text-[.92rem] tabular-nums">{fmtMoney(last31)}</span>
        </div>
        <div className="flex justify-between items-center py-[.55rem] border-t border-b border-lineDark">
          <span className="font-mono-eyebrow text-[.66rem] text-[#9FA8BA]">Last 90 days</span>
          <span className="font-display font-bold text-white text-[.92rem] tabular-nums">{fmtMoney(last90)}</span>
        </div>
      </div>

      <div className="flex justify-between px-[1.1rem] py-[.9rem]">
        <span className="font-mono-eyebrow text-[.64rem] text-[#7B8499]">
          LISTINGS OPTIMIZED <b className="text-white font-semibold">{active.listingsOptimized}</b>
        </span>
        <span className="font-mono-eyebrow text-[.64rem] text-[#7B8499]">
          COACHING SESSIONS <b className="text-white font-semibold">{active.coachingSessions}</b>
        </span>
      </div>
    </Reveal>
  );
}
