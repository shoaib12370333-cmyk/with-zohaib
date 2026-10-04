'use client';
import { useMemo, useRef, useState } from 'react';

const DAYS = 90;

// Deterministic pseudo-random so server and client render identical bars.
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

export default function PlatformDashboard({ platforms = [], disclaimer }) {
  const [activeKey, setActiveKey] = useState(platforms[2]?.key || platforms[0]?.key);
  const [hover, setHover] = useState(null);
  const barsRef = useRef(null);
  const active = platforms.find((p) => p.key === activeKey) || platforms[0];

  const lo = Number.isFinite(active?.dailyMin) ? active.dailyMin : 30;
  const hiRaw = Number.isFinite(active?.dailyMax) ? active.dailyMax : 220;
  const hi = hiRaw > lo ? hiRaw : lo + 1;
  const series = useMemo(() => (active ? buildSeries(active.chart, active.key || 'x', lo, hi) : []), [active, lo, hi]);
  if (!active) return null;

  const color = active.color || '#F7B942';
  const max = Math.max(...series, 1);
  const last31 = sum(series.slice(-31));
  const prev31 = sum(series.slice(-62, -31));
  const delta = prev31 > 0 ? ((last31 - prev31) / prev31) * 100 : 0;

  const pointer = (clientX) => {
    const r = barsRef.current?.getBoundingClientRect();
    if (!r) return;
    const t = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setHover(Math.min(series.length - 1, Math.floor(t * series.length)));
  };
  const dayLabel = (i) => {
    const d = new Date();
    d.setDate(d.getDate() - (series.length - 1 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  const shown = hover ?? series.length - 1;

  return (
    <div className="card overflow-hidden" role="group" aria-label="Sample revenue dashboard">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-edge/10">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Platform">
          {platforms.map((p) => (
            <button
              key={p.key}
              role="tab"
              aria-selected={p.key === activeKey}
              onClick={() => setActiveKey(p.key)}
              className={`px-3.5 py-1.5 rounded-full font-mono text-[.72rem] transition-all ${
                p.key === activeKey ? 'text-white shadow-lg' : 'text-muted hover:text-fg bg-edge/[.04]'
              }`}
              style={p.key === activeKey ? { background: p.color || '#F7B942' } : undefined}
            >
              {p.name}
            </button>
          ))}
        </div>
        <span className="chip border-gold/30 text-gold">SAMPLE DATA</span>
      </div>

      <div className="p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[.68rem] tracking-[.14em] uppercase text-faint">{active.name} · daily revenue · 90 days</div>
            <div className="mt-2 font-display font-extrabold text-4xl tabular-nums">{money(series[shown])}</div>
            <div className="font-mono text-xs text-muted mt-1">{hover != null ? dayLabel(hover) : 'Today'}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[.68rem] tracking-[.14em] uppercase text-faint">Last 31 days</div>
            <div className="mt-2 font-display font-bold text-2xl tabular-nums">{money(last31)}</div>
            <div className={`font-mono text-xs mt-1 ${delta >= 0 ? 'text-teal' : 'text-rose'}`}>{delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}% vs prior 31d</div>
          </div>
        </div>

        <div
          ref={barsRef}
          className="relative mt-7 flex items-end gap-[2px] h-40 cursor-crosshair touch-pan-y"
          onPointerMove={(e) => pointer(e.clientX)}
          onPointerLeave={() => setHover(null)}
        >
          {[1, 0.5, 0].map((t) => (
            <div key={t} className="absolute inset-x-0 border-t border-dashed border-edge/10 pointer-events-none" style={{ bottom: `${t * 100}%` }} />
          ))}
          {series.map((v, i) => (
            <div
              key={`${active.key}-${i}`}
              className="flex-1 rounded-t-[2px] origin-bottom"
              style={{
                height: `${Math.max(4, (v / max) * 100)}%`,
                background: `linear-gradient(180deg, ${color}, ${color}55)`,
                opacity: i === shown ? 1 : 0.55,
                transition: 'opacity .15s',
                animation: `grow .7s cubic-bezier(.2,.7,.2,1) ${Math.min(i * 8, 500)}ms both`,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 font-mono text-[.62rem] text-faint">
          <span>{dayLabel(0)}</span><span>{dayLabel(30)}</span><span>{dayLabel(60)}</span><span>{dayLabel(89)}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-7">
          <div className="rounded-2xl border border-edge/10 bg-bg2/50 p-4">
            <div className="font-mono text-[.64rem] tracking-[.12em] uppercase text-faint">Listings optimised</div>
            <div className="mt-1 font-display font-bold text-xl">{active.listingsOptimized}</div>
          </div>
          <div className="rounded-2xl border border-edge/10 bg-bg2/50 p-4">
            <div className="font-mono text-[.64rem] tracking-[.12em] uppercase text-faint">Coaching cadence</div>
            <div className="mt-1 font-display font-bold text-xl">{active.coachingSessions}</div>
          </div>
        </div>
        {disclaimer && <p className="mt-5 text-xs text-faint">{disclaimer}</p>}
      </div>
    </div>
  );
}
