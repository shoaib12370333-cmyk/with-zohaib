'use client';
import { useEffect, useState } from 'react';
import AdminNav from '@/components/admin/AdminNav';

const COLOR_FIELDS = [
  { key: 'ink', label: 'Dark background (header, footer, dark sections)' },
  { key: 'ink2', label: 'Dark background — secondary shade (cards on dark)' },
  { key: 'paper', label: 'Light section background' },
  { key: 'paper2', label: 'Light background — secondary shade (icon boxes)' },
  { key: 'gold', label: 'Accent color (buttons, highlights)' },
  { key: 'goldDeep', label: 'Accent color — hover shade' },
  { key: 'teal', label: 'Secondary accent (chart, icons)' },
  { key: 'tealDeep', label: 'Secondary accent — hover shade' },
  { key: 'slate', label: 'Body text color' },
  { key: 'slateSoft', label: 'Muted / secondary text color' },
  { key: 'line', label: 'Border / divider color' },
];

export default function DesignPage() {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/admin/content').then((r) => r.json()).then(setContent);
  }, []);

  function setColor(key, value) {
    setContent((c) => ({ ...c, theme: { ...c.theme, [key]: value } }));
  }

  async function handleSave() {
    setStatus('saving');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error();
      setStatus('saved');
    } catch {
      setStatus('error');
    } finally {
      setTimeout(() => setStatus(''), 2500);
    }
  }

  if (!content) {
    return (
      <main className="min-h-screen">
        <AdminNav />
        <div className="p-8 text-slateSoft">Loading…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper pb-24">
      <AdminNav />
      <div className="bg-white border-b border-line px-5 sm:px-8 py-3 flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="font-mono-eyebrow text-[.7rem] text-tealDeep tracking-[.1em] uppercase">Design</span>
          <h1 className="font-display font-bold">Colors</h1>
        </div>
        <div className="flex items-center gap-3">
          {status === 'saved' && <span className="text-teal text-sm font-semibold">Saved ✓</span>}
          {status === 'error' && <span className="text-red-600 text-sm font-semibold">Save failed</span>}
          <button onClick={handleSave} disabled={status === 'saving'} className="bg-gold hover:bg-goldDeep text-ink font-display font-bold text-sm px-5 py-2.5 rounded-full disabled:opacity-60">
            {status === 'saving' ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="max-w-[700px] mx-auto px-5 sm:px-8 pt-8">
        <p className="text-slateSoft text-sm mb-6">
          These colors control the whole site's look everywhere at once — the header, buttons, backgrounds, and text. They don't change one button at a time; changing "Accent color" here changes every button, badge, and highlight across every page.
        </p>
        <div className="bg-white border border-line rounded-2xl p-6 space-y-4">
          {COLOR_FIELDS.map((f) => (
            <div key={f.key} className="flex items-center justify-between gap-4 py-2 border-b border-line last:border-0">
              <div>
                <div className="font-display font-semibold text-sm">{f.label}</div>
                <div className="text-xs text-slateSoft font-mono-eyebrow mt-0.5">{content.theme[f.key]}</div>
              </div>
              <div className="flex items-center gap-2 flex-none">
                <input
                  type="color"
                  value={content.theme[f.key] || '#000000'}
                  onChange={(e) => setColor(f.key, e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-line"
                />
                <input
                  type="text"
                  value={content.theme[f.key] || ''}
                  onChange={(e) => setColor(f.key, e.target.value)}
                  className="w-24 px-2 py-1.5 border border-line rounded text-sm font-mono-eyebrow"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
