'use client';
import { useState } from 'react';
import Icon, { ICON_NAMES } from '@/components/Icons';
import { TextInput, TextArea, NumberInput, Toggle, ColorInput, IconPicker, ImageField, humanize } from './Fields';

// Schema-driven editor: renders a form for ANY JSON value. The shape comes from
// lib/defaultContent.js, so new content fields appear here automatically.

const LONG_KEYS = /^(description|lead|quote|a|bio|body|blurb|text|caption|message|tagline|title|heading)$/i;

function blank(template) {
  if (Array.isArray(template)) return [];
  if (template && typeof template === 'object') return Object.fromEntries(Object.entries(template).map(([k, v]) => [k, blank(v)]));
  if (typeof template === 'number') return 0;
  if (typeof template === 'boolean') return false;
  return '';
}

function itemTitle(item, i) {
  if (item && typeof item === 'object') {
    const t = item.title || item.name || item.q || item.label || item.heading || item.key;
    if (typeof t === 'string' && t.trim()) return t;
  }
  return `Item ${i + 1}`;
}

function setAt(arr, i, v) {
  const next = arr.slice();
  next[i] = v;
  return next;
}

function move(arr, i, d) {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = arr.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function ArrayEditor({ label, value, onChange, fieldKey }) {
  const first = value[0];
  const isObjects = first && typeof first === 'object' && !Array.isArray(first);
  const isNumbers = typeof first === 'number';
  const [open, setOpen] = useState({});

  if (isNumbers) {
    return (
      <TextInput
        label={label}
        hint="Comma-separated numbers"
        value={value.join(', ')}
        onChange={(v) => onChange(v.split(',').map((s) => Number(s.trim())).filter((n) => Number.isFinite(n)))}
      />
    );
  }

  const template = isObjects ? first : '';
  const add = () => onChange([...value, isObjects ? blank(template) : '']);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted">{label} <span className="text-faint font-normal">({value.length})</span></span>
        <button type="button" onClick={add} className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline">
          <Icon name="plus" className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      <div className="space-y-2.5">
        {value.map((item, i) => {
          const key = `${fieldKey}-${i}`;
          const expanded = isObjects ? !!open[key] : true;
          return (
            <div key={key} className="rounded-xl border border-edge/10 bg-bg/40">
              <div className="flex items-center gap-1 px-3 py-2">
                {isObjects ? (
                  <button type="button" onClick={() => setOpen((o) => ({ ...o, [key]: !o[key] }))} className="flex-1 min-w-0 flex items-center gap-2 text-left" aria-expanded={expanded}>
                    <Icon name="arrow" className={`w-3.5 h-3.5 flex-none text-faint transition-transform ${expanded ? 'rotate-90' : ''}`} />
                    <span className="truncate text-sm font-medium">{itemTitle(item, i)}</span>
                  </button>
                ) : (
                  <span className="flex-1 font-mono text-[.65rem] text-faint">{i + 1}</span>
                )}
                <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => onChange(move(value, i, -1))} className="p-1.5 text-faint hover:text-fg disabled:opacity-30">↑</button>
                <button type="button" aria-label="Move down" disabled={i === value.length - 1} onClick={() => onChange(move(value, i, 1))} className="p-1.5 text-faint hover:text-fg disabled:opacity-30">↓</button>
                {isObjects && <button type="button" aria-label="Duplicate" onClick={() => onChange([...value.slice(0, i + 1), structuredClone(item), ...value.slice(i + 1)])} className="p-1.5 text-faint hover:text-fg text-xs">⧉</button>}
                <button
                  type="button"
                  aria-label="Delete"
                  onClick={() => { if (!isObjects || confirm(`Delete “${itemTitle(item, i)}”?`)) onChange(value.filter((_, k) => k !== i)); }}
                  className="p-1.5 text-faint hover:text-rose"
                ><Icon name="trash" className="w-4 h-4" /></button>
              </div>
              {expanded && (
                <div className={isObjects ? 'px-3 pb-3 pt-1' : 'px-3 pb-3'}>
                  <Node value={item} fieldKey={fieldKey} onChange={(v) => onChange(setAt(value, i, v))} />
                </div>
              )}
            </div>
          );
        })}
        {value.length === 0 && <p className="text-xs text-faint py-2">Nothing here yet.</p>}
      </div>
    </div>
  );
}

export function Node({ label, value, onChange, fieldKey = '' }) {
  const key = fieldKey.split('.').pop();

  if (Array.isArray(value)) return <ArrayEditor label={label || humanize(key)} value={value} onChange={onChange} fieldKey={fieldKey} />;

  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    const simple = entries.filter(([, v]) => v === null || typeof v !== 'object');
    const complex = entries.filter(([, v]) => v && typeof v === 'object');
    const set = (k, v) => onChange({ ...value, [k]: v });
    return (
      <div className="space-y-4">
        {label && <div className="font-display text-sm font-semibold pt-1">{label}</div>}
        {simple.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {simple.map(([k, v]) => {
              const wide = typeof v === 'string' && (LONG_KEYS.test(k) && (v.length > 60 || /^(description|lead|quote|a|bio|body|text|message)$/i.test(k)));
              const media = typeof v === 'string' && /Url$/.test(k);
              return (
                <div key={k} className={wide || media ? 'sm:col-span-2' : ''}>
                  <Node label={humanize(k)} value={v} onChange={(nv) => set(k, nv)} fieldKey={`${fieldKey}.${k}`} />
                </div>
              );
            })}
          </div>
        )}
        {complex.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-edge/10 p-4">
            <Node label={humanize(k)} value={v} onChange={(nv) => set(k, nv)} fieldKey={`${fieldKey}.${k}`} />
          </div>
        ))}
      </div>
    );
  }

  const lbl = label || humanize(key);
  if (typeof value === 'boolean') return <Toggle label={lbl} checked={value} onChange={onChange} />;
  if (typeof value === 'number') return <NumberInput label={lbl} value={value} onChange={onChange} />;

  // strings
  if (key === 'icon') return <IconPicker label={lbl} value={value} onChange={onChange} names={ICON_NAMES} />;
  if (/color/i.test(key) && /^#/.test(value || '#')) return <ColorInput label={lbl} value={value} onChange={onChange} />;
  if (/Url$/.test(key) && !/^(bookingUrl)$/.test(key)) return <ImageField label={lbl} value={value} onChange={onChange} />;
  const long = LONG_KEYS.test(key) && ((value || '').length > 60 || /^(description|lead|quote|a|bio|body|text|message)$/i.test(key));
  if (long || (value || '').length > 90 || (value || '').includes('\n')) return <TextArea label={lbl} value={value} onChange={onChange} rows={Math.min(8, Math.max(3, Math.ceil((value || '').length / 80)))} />;
  return <TextInput label={lbl} value={value} onChange={onChange} />;
}

/** Edit several top-level keys of `content` at once. */
export default function SchemaEditor({ content, keys, onChange, titles = {} }) {
  return (
    <div className="space-y-5">
      {keys.filter((k) => k in content).map((k) => (
        <section key={k} id={`sec-${k}`} className="rounded-2xl border border-edge/10 bg-surface/70 p-5 scroll-mt-24">
          <Node label={titles[k] || humanize(k)} value={content[k]} fieldKey={k} onChange={(v) => onChange({ ...content, [k]: v })} />
        </section>
      ))}
    </div>
  );
}
