'use client';
import { useEffect, useState } from 'react';
import AdminNav from '@/components/admin/AdminNav';

const SPACING_FIELDS = [
  { key: 'hero', label: 'Hero (space below the headline/dashboard before the marquee)' },
  { key: 'services', label: '"What We Do" service cards section' },
  { key: 'featureBlock', label: 'Flagship spotlight block ("Stuck isn\'t the same as...")' },
  { key: 'process', label: '"How It Works" steps section' },
  { key: 'stats', label: 'Stats band (4 / 8 / 3-Step / 100%)' },
  { key: 'testimonials', label: 'Success stories / testimonials section' },
  { key: 'cta', label: 'Bottom call-to-action banner' },
  { key: 'pageHeader', label: 'Top banner on About / Services / Contact pages' },
];

const VISIBILITY_FIELDS = [
  { key: 'founderStrip', label: 'Founder photo strip in the hero (under the headline)' },
  { key: 'marquee', label: 'Platform marquee (scrolling strip)' },
  { key: 'featureBlock', label: 'Flagship spotlight block' },
  { key: 'process', label: '"How It Works" section' },
  { key: 'stats', label: 'Stats band' },
  { key: 'testimonials', label: 'Testimonials section' },
  { key: 'ctaHome', label: 'Bottom call-to-action banner (Home page)' },
  { key: 'floatingWhatsApp', label: 'Floating WhatsApp button (bottom-right, every page)' },
  { key: 'analytics', label: 'Visitor analytics (Vercel Analytics)' },
];

export default function LayoutPage() {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/admin/content').then((r) => r.json()).then(setContent);
  }, []);

  function setSpacing(key, value) {
    setContent((c) => ({ ...c, layout: { ...c.layout, [key]: Number(value) } }));
  }
  function setTextSize(key, value) {
    setContent((c) => ({ ...c, textSizes: { ...c.textSizes, [key]: Number(value) } }));
  }
  function setVisible(key, value) {
    setContent((c) => ({ ...c, visibility: { ...c.visibility, [key]: value } }));
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
          <span className="font-mono-eyebrow text-[.7rem] text-tealDeep tracking-[.1em] uppercase">Layout</span>
          <h1 className="font-display font-bold">Spacing &amp; Section Visibility</h1>
        </div>
        <div className="flex items-center gap-3">
          {status === 'saved' && <span className="text-teal text-sm font-semibold">Saved ✓</span>}
          {status === 'error' && <span className="text-red-600 text-sm font-semibold">Save failed</span>}
          <button onClick={handleSave} disabled={status === 'saving'} className="bg-gold hover:bg-goldDeep text-ink font-display font-bold text-sm px-5 py-2.5 rounded-full disabled:opacity-60">
            {status === 'saving' ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="max-w-[700px] mx-auto px-5 sm:px-8 pt-8 space-y-10">
        <div>
          <h2 className="font-display font-bold text-lg mb-1">Text Sizes</h2>
          <p className="text-slateSoft text-sm mb-4">Controls how big the main headings are across the whole site — measured in a relative unit (bigger number = bigger text).</p>
          <div className="bg-white border border-line rounded-2xl p-6 space-y-5">
            {[
              { key: 'heroHeadline', label: 'Home page hero headline', min: 2, max: 6.5 },
              { key: 'pageTitle', label: 'About / Services / Contact page titles', min: 1.5, max: 4.5 },
              { key: 'sectionHeading', label: 'Section headings (e.g. "What We Do")', min: 1.2, max: 3.2 },
              { key: 'body', label: 'Body paragraph text', min: 0.85, max: 1.5 },
            ].map((f) => (
              <div key={f.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-display font-semibold text-sm">{f.label}</label>
                  <span className="font-mono-eyebrow text-xs text-slateSoft">{content.textSizes[f.key]}rem</span>
                </div>
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  step="0.1"
                  value={content.textSizes[f.key] ?? 2}
                  onChange={(e) => setTextSize(f.key, e.target.value)}
                  className="w-full accent-teal"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg mb-1">Marquee Speed</h2>
          <p className="text-slateSoft text-sm mb-4">How fast the scrolling platform strip moves. Higher number = slower scroll (it's the time for one full loop, in seconds).</p>
          <div className="bg-white border border-line rounded-2xl p-6">
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-display font-semibold text-sm">Loop duration</label>
              <span className="font-mono-eyebrow text-xs text-slateSoft">{content.layout.marqueeSpeed ?? 26}s {content.layout.marqueeSpeed <= 12 ? '(fast)' : content.layout.marqueeSpeed >= 36 ? '(slow)' : ''}</span>
            </div>
            <input
              type="range"
              min="6"
              max="50"
              step="1"
              value={content.layout.marqueeSpeed ?? 26}
              onChange={(e) => setSpacing('marqueeSpeed', e.target.value)}
              className="w-full accent-teal"
            />
          </div>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg mb-1">Spacing</h2>
          <p className="text-slateSoft text-sm mb-4">How much empty space each section has above and below it. Lower = tighter, higher = more breathing room. Measured in a relative unit — 4 is the normal default.</p>
          <div className="bg-white border border-line rounded-2xl p-6 space-y-5">
            {SPACING_FIELDS.map((f) => (
              <div key={f.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-display font-semibold text-sm">{f.label}</label>
                  <span className="font-mono-eyebrow text-xs text-slateSoft">{content.layout[f.key]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="0.5"
                  value={content.layout[f.key] ?? 4}
                  onChange={(e) => setSpacing(f.key, e.target.value)}
                  className="w-full accent-teal"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg mb-1">Section Visibility</h2>
          <p className="text-slateSoft text-sm mb-4">Turn any of these sections off completely — they'll disappear from the live site until you turn them back on. Nothing is deleted, just hidden.</p>
          <div className="bg-white border border-line rounded-2xl p-6 space-y-1">
            {VISIBILITY_FIELDS.map((f) => (
              <label key={f.key} className="flex items-center justify-between py-3 border-b border-line last:border-0 cursor-pointer">
                <span className="font-display font-semibold text-sm">{f.label}</span>
                <input
                  type="checkbox"
                  checked={content.visibility[f.key] !== false}
                  onChange={(e) => setVisible(f.key, e.target.checked)}
                  className="w-5 h-5 accent-teal"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
