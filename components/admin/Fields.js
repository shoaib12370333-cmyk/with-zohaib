'use client';
import { useRef, useState } from 'react';
import Icon from '@/components/Icons';

export async function uploadImage(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
  let data;
  try { data = await res.json(); } catch { throw new Error(`Server error (status ${res.status}) — check that Vercel Blob is connected.`); }
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.url;
}

const ACRONYMS = { cta: 'CTA', faq: 'FAQ', faqs: 'FAQs', seo: 'SEO', og: 'OG', url: 'image', q: 'Question', a: 'Answer', wa: 'WhatsApp', whatsapp: 'WhatsApp', tiktok: 'TikTok', youtube: 'YouTube', linkedin: 'LinkedIn', ebay: 'eBay' };

export const humanize = (key) =>
  String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .map((w, i) => ACRONYMS[w.toLowerCase()] || (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w.toLowerCase()))
    .join(' ');

export function FieldShell({ label, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="block text-xs font-semibold text-muted mb-1.5">{label}</span>}
      {children}
      {hint && <span className="block text-[.7rem] text-faint mt-1">{hint}</span>}
    </label>
  );
}

export function TextInput({ label, value, onChange, hint, placeholder, type = 'text' }) {
  return (
    <FieldShell label={label} hint={hint}>
      <input type={type} className="adm-input" value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </FieldShell>
  );
}

export function TextArea({ label, value, onChange, hint, rows = 3 }) {
  return (
    <FieldShell label={label} hint={hint}>
      <textarea className="adm-input resize-y" rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </FieldShell>
  );
}

export function NumberInput({ label, value, onChange, hint }) {
  return (
    <FieldShell label={label} hint={hint}>
      <input type="number" className="adm-input" value={Number.isFinite(value) ? value : ''} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} />
    </FieldShell>
  );
}

export function Toggle({ label, checked, onChange, hint }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-edge/10 bg-bg/40 px-4 py-3">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-faint mt-0.5">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={!!checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 flex-none rounded-full transition-colors ${checked ? 'bg-teal' : 'bg-edge/25'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}

export function ColorInput({ label, value, onChange }) {
  const hex = /^#[0-9a-f]{6}$/i.test(value || '') ? value : '#f7b942';
  return (
    <FieldShell label={label}>
      <div className="flex gap-2">
        <input type="color" aria-label={`${label} picker`} value={hex} onChange={(e) => onChange(e.target.value)} className="h-[38px] w-12 rounded-lg border border-edge/15 bg-transparent cursor-pointer" />
        <input className="adm-input font-mono" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      </div>
    </FieldShell>
  );
}

export function SelectInput({ label, value, onChange, options }) {
  return (
    <FieldShell label={label}>
      <select className="adm-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {!options.includes(value) && <option value={value ?? ''}>{value || '— none —'}</option>}
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </FieldShell>
  );
}

export function IconPicker({ label, value, onChange, names }) {
  return (
    <FieldShell label={label}>
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-edge/10 bg-bg/40 p-2 max-h-[132px] overflow-y-auto">
        {names.map((n) => (
          <button
            key={n}
            type="button"
            title={n}
            aria-label={n}
            aria-pressed={value === n}
            onClick={() => onChange(n)}
            className={`w-9 h-9 rounded-lg grid place-items-center transition-colors ${value === n ? 'bg-gold2 text-[#1a1204]' : 'text-muted hover:bg-edge/10 hover:text-fg'}`}
          >
            <Icon name={n} className="w-[18px] h-[18px]" />
          </button>
        ))}
      </div>
    </FieldShell>
  );
}

export function ImageField({ label, value, onChange, hint }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function pick(file) {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      onChange(await uploadImage(file));
    } catch (e) {
      setError(e.message || 'Upload failed');
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  }

  return (
    <FieldShell label={label} hint={hint}>
      <div
        className="flex items-center gap-3 rounded-xl border border-dashed border-edge/20 bg-bg/40 p-3"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0]); }}
      >
        <div className="w-16 h-16 flex-none rounded-lg overflow-hidden bg-surface2 border border-edge/10 grid place-items-center text-faint">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : <Icon name="brush" className="w-6 h-6" />}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <input className="adm-input" placeholder="Paste image URL or upload →" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
          {error && <p className="text-xs text-rose">{error}</p>}
        </div>
        <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        <button type="button" disabled={busy} onClick={() => input.current?.click()} className="btn btn-ghost btn-sm !px-4 disabled:opacity-60">
          {busy ? 'Uploading…' : 'Upload'}
        </button>
        {value && <button type="button" aria-label="Remove image" onClick={() => onChange('')} className="text-faint hover:text-rose"><Icon name="close" className="w-4 h-4" /></button>}
      </div>
    </FieldShell>
  );
}

export function Card({ title, subtitle, actions, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-edge/10 bg-surface/70 ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-edge/10">
          <div>
            <h3 className="font-display text-base">{title}</h3>
            {subtitle && <p className="text-xs text-faint mt-0.5">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const show = (message, tone = 'ok') => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3200);
  };
  const node = toast ? (
    <div role="status" className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[500] px-5 py-3 rounded-full text-sm font-medium shadow-card animate-rise ${toast.tone === 'error' ? 'bg-rose text-white' : 'bg-teal text-[#041512]'}`}>
      {toast.message}
    </div>
  ) : null;
  return [show, node];
}
