'use client';
import { useMemo, useRef, useState } from 'react';
import Reveal from './Reveal';

const W = 400;
const H = 200;
const MARGIN = { top: 10, right: 10, bottom: 22, left: 32 };
const INNER_W = W - MARGIN.left - MARGIN.right;
const INNER_H = H - MARGIN.top - MARGIN.bottom;
const GRID_LINES = 4;

function buildChart(values) {
  const n = values.length;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const pad = 6;
  const points = values.map((v, i) => {
    const x = n > 1 ? (i / (n - 1)) * INNER_W : INNER_W / 2;
    const norm = (v - min) / range; // 0..1
    const y = INNER_H - pad - norm * (INNER_H - pad * 2);
    return [x, y];
  });

  let line = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)} `;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const midX = (x0 + x1) / 2;
    line += `C${midX.toFixed(1)},${y0.toFixed(1)} ${midX.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} `;
  }
  const area = `${line} L${INNER_W},${INNER_H} L0,${INNER_H} Z`;
  return { line: line.trim(), area, points, min, max };
}

// Labels each data point with the month it landed in, ending on the current month —
// so a 12-value series reads as "Oct, Nov, Dec … Sep" instead of unlabeled dots.
function monthLabels(n) {
  const now = new Date();
  const labels = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(d.toLocaleString('en-US', { month: 'short' }));
  }
  return labels;
}

export default function PlatformDashboard({ platforms }) {
  const list = platforms && platforms.length ? platforms : [];
  const [activeKey, setActiveKey] = useState(list[2]?.key || list[0]?.key);
  const active = list.find((p) => p.key === activeKey) || list[0];
  const svgRef = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(null);

  const values = active?.chart?.length ? active.chart : [10, 20, 30, 40, 50];
  const { line, area, points, min, max } = useMemo(() => buildChart(values), [values]);
  const labels = useMemo(() => monthLabels(values.length), [values.length]);
  const showEveryLabel = values.length <= 8;

  function updateHoverFromClientX(clientX) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const xInSvg = ((clientX - rect.left) / rect.width) * W;
    const ratio = Math.min(1, Math.max(0, (xInSvg - MARGIN.left) / INNER_W));
    const idx = values.length > 1 ? Math.round(ratio * (values.length - 1)) : 0;
    setHoverIdx(idx);
  }

  if (!active) return null;

  const hoverPoint = hoverIdx != null ? points[hoverIdx] : null;
  const hoverValue = hoverIdx != null ? values[hoverIdx] : null;
  const tooltipW = 62;
  const tooltipX = hoverPoint ? Math.min(Math.max(hoverPoint[0] - tooltipW / 2, 0), INNER_W - tooltipW) : 0;

  return (
    <Reveal className="bg-ink2 border border-lineDark rounded-2xl shadow-cardLg overflow-hidden max-w-[480px] lg:max-w-none">
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
          <span className="font-mono-eyebrow text-[.66rem] text-gold border border-gold/40 px-[.6em] py-[.3em] rounded-full">
            {values.length}-MONTH VIEW
          </span>
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto block touch-none"
          key={active.key}
          onMouseMove={(e) => updateHoverFromClientX(e.clientX)}
          onMouseLeave={() => setHoverIdx(null)}
          onTouchStart={(e) => updateHoverFromClientX(e.touches[0].clientX)}
          onTouchMove={(e) => updateHoverFromClientX(e.touches[0].clientX)}
          onTouchEnd={() => setHoverIdx(null)}
        >
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

          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {Array.from({ length: GRID_LINES + 1 }, (_, i) => {
              const y = (INNER_H / GRID_LINES) * i;
              const value = Math.round(max - ((max - min) / GRID_LINES) * i);
              return (
                <g key={i}>
                  <line x1={0} y1={y} x2={INNER_W} y2={y} stroke="#2A3450" strokeWidth="1" strokeDasharray={i === GRID_LINES ? '0' : '3,4'} />
                  <text x={-8} y={y} textAnchor="end" dominantBaseline="middle" className="fill-[#5C6788]" style={{ fontSize: 8 }}>
                    {value}
                  </text>
                </g>
              );
            })}

            {labels.map((lab, i) => {
              if (!showEveryLabel && i % 2 !== 0 && i !== labels.length - 1) return null;
              return (
                <text
                  key={i}
                  x={points[i][0]}
                  y={INNER_H + 14}
                  textAnchor="middle"
                  className="fill-[#5C6788]"
                  style={{ fontSize: 8 }}
                >
                  {lab}
                </text>
              );
            })}

            <path className="growth-area" d={area} fill="url(#growthFill)" />
            <path className="growth-line" d={line} fill="none" stroke="url(#growthStroke)" strokeWidth="2.5" strokeLinecap="round" />

            {points.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i === hoverIdx ? 4 : 2} fill={i === hoverIdx ? 'var(--c-gold)' : 'var(--c-teal)'} opacity={i === hoverIdx ? 1 : 0.55} />
            ))}

            {hoverPoint && (
              <>
                <line x1={hoverPoint[0]} y1={0} x2={hoverPoint[0]} y2={INNER_H} stroke="#5C6788" strokeWidth="1" strokeDasharray="2,3" />
                <circle cx={hoverPoint[0]} cy={hoverPoint[1]} r="5" fill="var(--c-gold)" stroke="#0B1220" strokeWidth="1.5" />
                <g transform={`translate(${tooltipX},${Math.max(hoverPoint[1] - 34, 0)})`}>
                  <rect width={tooltipW} height={22} rx={5} fill="#0B1220" stroke="#33405C" />
                  <text x={tooltipW / 2} y={11} textAnchor="middle" className="fill-white font-semibold" style={{ fontSize: 9 }}>
                    {labels[hoverIdx]} · {hoverValue}
                  </text>
                </g>
              </>
            )}
          </g>
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
    </Reveal>
  );
}
