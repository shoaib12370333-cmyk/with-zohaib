'use client';
import { useMemo, useState } from 'react';

const W = 400;
const H = 170;

function buildPaths(values) {
  const n = values.length;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const pad = 14;
  const points = values.map((v, i) => {
    const x = (i / (n - 1)) * W;
    const norm = (v - min) / range; // 0..1
    const y = H - pad - norm * (H - pad * 1.6);
    return [x, y];
  });

  let line = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)} `;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const midX = (x0 + x1) / 2;
    line += `C${midX.toFixed(1)},${y0.toFixed(1)} ${midX.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} `;
  }
  const area = `${line} L${W},${H} L0,${H} Z`;
  const last = points[points.length - 1];
  return { line: line.trim(), area, lastPoint: last, midPoint: points[Math.floor(points.length / 2)] };
}

export default function PlatformDashboard({ platforms }) {
  const list = platforms && platforms.length ? platforms : [];
  const [activeKey, setActiveKey] = useState(list[2]?.key || list[0]?.key);
  const active = list.find((p) => p.key === activeKey) || list[0];

  const { line, area, lastPoint, midPoint } = useMemo(
    () => buildPaths(active?.chart?.length ? active.chart : [10, 20, 30, 40, 50]),
    [active]
  );

  if (!active) return null;

  return (
    <div className="reveal bg-ink2 border border-lineDark rounded-2xl shadow-cardLg overflow-hidden max-w-[480px] lg:max-w-none">
      <div className="flex items-center justify-between px-[1.1rem] py-[.9rem] border-b border-lineDark">
        <div className="flex gap-[.4rem] flex-wrap">
          {list.map((p) => (
            <button
              key={p.key}
              onClick={() => setActiveKey(p.key)}
              className={`font-mono-eyebrow text-[.68rem] tracking-[.03em] px-[.7em] py-[.35em] rounded-full transition-colors ${
                p.key === activeKey ? 'bg-teal text-white' : 'text-[#8B93A6] hover:text-white'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="flex gap-[5px]">
          <i className="w-[7px] h-[7px] rounded-full bg-[#33405C] block" />
          <i className="w-[7px] h-[7px] rounded-full bg-[#33405C] block" />
          <i className="w-[7px] h-[7px] rounded-full bg-[#33405C] block" />
        </div>
      </div>

      <div className="px-[1.1rem] pt-[1.3rem] pb-4">
        <div className="flex justify-between items-end mb-[.6rem]">
          <div>
            <span className="block font-mono-eyebrow text-[.64rem] tracking-[.1em] text-[#7B8499]">STORE STATUS</span>
            <span className="block font-display font-bold text-[1.3rem] text-teal mt-[.15rem]">Growing ↑</span>
          </div>
          <span className="font-mono-eyebrow text-[.66rem] text-gold border border-gold/40 px-[.6em] py-[.3em] rounded-full">90-DAY VIEW</span>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" key={active.key}>
          <defs>
            <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--c-teal)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--c-teal)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="growthStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--c-teal)" />
              <stop offset="100%" stopColor="var(--c-gold)" />
            </linearGradient>
          </defs>
          <path className="growth-area" d={area} fill="url(#growthFill)" />
          <path className="growth-line" d={line} fill="none" stroke="url(#growthStroke)" strokeWidth="3" strokeLinecap="round" />
          {midPoint && <circle cx={midPoint[0]} cy={midPoint[1]} r="4" fill="var(--c-gold)" />}
          {lastPoint && <circle cx={lastPoint[0]} cy={lastPoint[1]} r="5" fill="var(--c-gold)" />}
        </svg>
      </div>

      <div className="flex justify-between px-[1.1rem] py-[.9rem] border-t border-lineDark">
        <span className="font-mono-eyebrow text-[.64rem] text-[#7B8499]">
          LISTINGS OPTIMIZED <b className="text-white font-semibold">{active.listingsOptimized}</b>
        </span>
        <span className="font-mono-eyebrow text-[.64rem] text-[#7B8499]">
          COACHING SESSIONS <b className="text-white font-semibold">{active.coachingSessions}</b>
        </span>
      </div>
    </div>
  );
}
