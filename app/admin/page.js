'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SectionCard, Field, TextArea, ListTextArea, ImageField, RangeField, SelectField, RemoveButton, AddButton } from '@/components/admin/Fields';
import AdminNav from '@/components/admin/AdminNav';

function setPath(obj, path, value) {
  const keys = path.split('.');
  const clone = structuredClone(obj);
  let cur = clone;
  for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
  cur[keys[keys.length - 1]] = value;
  return clone;
}
function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}

export default function AdminPage() {
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then(setContent)
      .catch(() => setStatus('error-load'));
  }, []);

  const set = (path, value) => setContent((c) => setPath(c, path, value));

  const addItem = (path, template) => {
    setContent((c) => {
      const clone = structuredClone(c);
      const arr = getPath(clone, path);
      arr.push(template);
      return clone;
    });
  };
  const removeItem = (path, index) => {
    setContent((c) => {
      const clone = structuredClone(c);
      const arr = getPath(clone, path);
      arr.splice(index, 1);
      return clone;
    });
  };

  async function handleUpload(file, onDone) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server error (status ${res.status}) — check that Vercel Blob is connected and redeployed.`);
      }
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onDone(data.url);
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
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

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  if (!content) {
    return (
      <main className="min-h-screen">
        <AdminNav />
        <div className="flex items-center justify-center text-slateSoft py-24">
          {status === 'error-load' ? 'Could not load content.' : 'Loading…'}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper pb-32">
      <AdminNav />
      <div className="bg-white border-b border-line px-5 sm:px-8 py-3 flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="font-mono-eyebrow text-[.7rem] text-tealDeep tracking-[.1em] uppercase">Content</span>
          <h1 className="font-display font-bold">Edit Site Content</h1>
        </div>
        <div className="flex items-center gap-3">
          {status === 'saved' && <span className="text-teal text-sm font-semibold">Saved ✓</span>}
          {status === 'error' && <span className="text-red-600 text-sm font-semibold">Save failed</span>}
          <button
            onClick={handleSave}
            disabled={status === 'saving'}
            className="bg-gold hover:bg-goldDeep text-ink font-display font-bold text-sm px-5 py-2.5 rounded-full disabled:opacity-60"
          >
            {status === 'saving' ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-5 sm:px-8 pt-8">

        <SectionCard title="Brand" subtitle="Name, logo photo, contact details shown everywhere">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Business name (line 1)" value={content.brand.name} onChange={(v) => set('brand.name', v)} />
            <Field label="Business name (line 2)" value={content.brand.sub} onChange={(v) => set('brand.sub', v)} />
          </div>
          <TextArea label="Footer tagline" value={content.brand.tagline} onChange={(v) => set('brand.tagline', v)} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="WhatsApp number (no +, no spaces, e.g. 923213133661)" value={content.brand.whatsapp} onChange={(v) => set('brand.whatsapp', v)} />
            <Field label="Phone number as displayed" value={content.brand.phoneDisplay} onChange={(v) => set('brand.phoneDisplay', v)} />
            <Field label="Email" value={content.brand.email} onChange={(v) => set('brand.email', v)} />
            <Field label="Instagram URL" value={content.brand.instagram} onChange={(v) => set('brand.instagram', v)} />
            <Field label="Facebook URL" value={content.brand.facebook} onChange={(v) => set('brand.facebook', v)} />
            <Field label="Facebook Page username (for the 'Message on Facebook' button — from your Page's About section)" value={content.brand.messengerUsername} onChange={(v) => set('brand.messengerUsername', v)} placeholder="e.g. ecommercewithzohaib" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <ImageField label="Header/footer photo (square)" value={content.brand.avatarUrl} uploading={uploading} onUpload={handleUpload} onChange={(url) => set('brand.avatarUrl', url)} />
            <ImageField label="About page photo (portrait)" value={content.brand.portraitUrl} uploading={uploading} onUpload={handleUpload} onChange={(url) => set('brand.portraitUrl', url)} />
            <ImageField label="Favicon (browser tab icon — leave empty to use header photo)" value={content.brand.faviconUrl} uploading={uploading} onUpload={handleUpload} onChange={(url) => set('brand.faviconUrl', url)} />
          </div>
        </SectionCard>

        <SectionCard title="Founder" subtitle="Shown in the hero strip and the About page">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" value={content.founder.name} onChange={(v) => set('founder.name', v)} />
            <Field label="Role / title" value={content.founder.role} onChange={(v) => set('founder.role', v)} />
          </div>
          {content.founder.bio.map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <TextArea label={`Bio paragraph ${i + 1}`} value={p} onChange={(v) => set(`founder.bio.${i}`, v)} rows={2} />
              <div className="pt-7"><RemoveButton onClick={() => removeItem('founder.bio', i)} /></div>
            </div>
          ))}
          <AddButton label="+ Add bio paragraph" onClick={() => addItem('founder.bio', '')} />
          <ListTextArea label="Who we work best with" items={content.founder.whoWeWorkWith} onChange={(v) => set('founder.whoWeWorkWith', v)} />
        </SectionCard>

        <SectionCard title="Hero (Home page top)" subtitle="Headline, subtext, buttons">
          <Field label="Eyebrow label" value={content.hero.eyebrow} onChange={(v) => set('hero.eyebrow', v)} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Headline — text before the rotating word" value={content.hero.headlinePrefix} onChange={(v) => set('hero.headlinePrefix', v)} />
            <Field label="Headline — text after the rotating word" value={content.hero.headlineSuffix} onChange={(v) => set('hero.headlineSuffix', v)} />
          </div>
          <p className="text-xs text-slateSoft -mt-2">The rotating word cycles through your platform names below automatically.</p>
          <TextArea label="Supporting paragraph" value={content.hero.lead} onChange={(v) => set('hero.lead', v)} rows={3} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Primary button text" value={content.hero.ctaPrimary} onChange={(v) => set('hero.ctaPrimary', v)} />
            <Field label="Secondary button text" value={content.hero.ctaSecondary} onChange={(v) => set('hero.ctaSecondary', v)} />
          </div>
          <ListTextArea label="Trust checkmarks" items={content.hero.trust} onChange={(v) => set('hero.trust', v)} rows={3} />
          <ImageField label="Side photo (shows behind the live chart card — leave empty to show just the chart)" value={content.hero.sideImageUrl} uploading={uploading} onUpload={handleUpload} onChange={(url) => set('hero.sideImageUrl', url)} />
          {content.hero.sideImageUrl && (
            <div className="grid sm:grid-cols-2 gap-4">
              <SelectField
                label="Photo fit (Cover fills the frame and may crop; Contain shows the whole photo)"
                value={content.hero.sideImageFit || 'cover'}
                onChange={(v) => set('hero.sideImageFit', v)}
                options={[
                  { value: 'cover', label: 'Cover (fill frame, may crop)' },
                  { value: 'contain', label: 'Contain (show whole photo)' },
                ]}
              />
              <SelectField
                label="Photo position (which part stays visible when cropped)"
                value={content.hero.sideImagePosition || 'top'}
                onChange={(v) => set('hero.sideImagePosition', v)}
                options={[
                  { value: 'top', label: 'Top' },
                  { value: 'center', label: 'Center' },
                  { value: 'bottom', label: 'Bottom' },
                ]}
              />
            </div>
          )}
        </SectionCard>

        <SectionCard title="Trust Marquee" subtitle="The scrolling strip of platform names right under the hero">
          <Field label="Label above the strip" value={content.trustStripLabel} onChange={(v) => set('trustStripLabel', v)} />
          {content.marqueeItems.map((m, i) => (
            <div key={i} className="border border-line rounded-xl p-4 flex items-center gap-4">
              <ImageField label="Logo (optional)" value={m.logoUrl} uploading={uploading} onUpload={handleUpload} onChange={(url) => set(`marqueeItems.${i}.logoUrl`, url)} />
              <div className="flex-1">
                <Field label="Name (leave empty to show just the logo, no text)" value={m.name} onChange={(v) => set(`marqueeItems.${i}.name`, v)} />
                <RangeField
                  label={`Logo size (${m.logoSize || 48}px) — card stays the same size`}
                  value={m.logoSize || 48}
                  min={24}
                  max={52}
                  onChange={(v) => set(`marqueeItems.${i}.logoSize`, v)}
                />
              </div>
              <RemoveButton onClick={() => removeItem('marqueeItems', i)} />
            </div>
          ))}
          <AddButton label="+ Add marquee item" onClick={() => addItem('marqueeItems', { name: 'New', logoUrl: '', logoSize: 64 })} />
        </SectionCard>

        <SectionCard title="Platforms & Live Chart" subtitle="Tabs in the hero dashboard — click a tab on the live site to see its chart">
          {content.platforms.map((p, i) => (
            <div key={i} className="border border-line rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-display font-bold text-sm">Platform {i + 1}</span>
                <RemoveButton onClick={() => removeItem('platforms', i)} />
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <Field label="Name" value={p.name} onChange={(v) => set(`platforms.${i}.name`, v)} />
                <Field label="Listings optimized" value={p.listingsOptimized} onChange={(v) => set(`platforms.${i}.listingsOptimized`, v)} />
                <Field label="Coaching sessions (e.g. 4/mo)" value={p.coachingSessions} onChange={(v) => set(`platforms.${i}.coachingSessions`, v)} />
              </div>
              <Field
                label="Chart values, comma-separated (line only goes up-and-down based on these)"
                value={(p.chart || []).join(', ')}
                onChange={(v) => set(`platforms.${i}.chart`, v.split(',').map((n) => Number(n.trim())).filter((n) => !isNaN(n)))}
              />
            </div>
          ))}
          <AddButton label="+ Add platform" onClick={() => addItem('platforms', { key: `platform-${Date.now()}`, name: 'New Platform', listingsOptimized: 0, coachingSessions: '0/mo', chart: [10, 20, 30, 40, 50] })} />
        </SectionCard>

        <SectionCard title="What We Do (Home page service cards)">
          {content.servicesOverview.map((s, i) => (
            <div key={i} className="border border-line rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-display font-bold text-sm">Card {i + 1}</span>
                <RemoveButton onClick={() => removeItem('servicesOverview', i)} />
              </div>
              <Field label="Title" value={s.title} onChange={(v) => set(`servicesOverview.${i}.title`, v)} />
              <TextArea label="Description" value={s.description} onChange={(v) => set(`servicesOverview.${i}.description`, v)} rows={2} />
            </div>
          ))}
          <AddButton onClick={() => addItem('servicesOverview', { icon: 'shop', title: 'New Service', description: '' })} />
        </SectionCard>

        <SectionCard title="Flagship Spotlight Block">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Eyebrow" value={content.featureBlock.eyebrow} onChange={(v) => set('featureBlock.eyebrow', v)} />
            <Field label="Tag (on dark panel)" value={content.featureBlock.tag} onChange={(v) => set('featureBlock.tag', v)} />
          </div>
          <Field label="Title" value={content.featureBlock.title} onChange={(v) => set('featureBlock.title', v)} />
          <TextArea label="Description" value={content.featureBlock.description} onChange={(v) => set('featureBlock.description', v)} rows={3} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Button text" value={content.featureBlock.ctaLabel} onChange={(v) => set('featureBlock.ctaLabel', v)} />
            <Field label="Big number/text on panel" value={content.featureBlock.bigNum} onChange={(v) => set('featureBlock.bigNum', v)} />
          </div>
          <TextArea label="Panel caption" value={content.featureBlock.caption} onChange={(v) => set('featureBlock.caption', v)} rows={2} />
        </SectionCard>

        <SectionCard title="How It Works (process steps)">
          {content.process.map((p, i) => (
            <div key={i} className="border border-line rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-display font-bold text-sm">Step {i + 1}</span>
                <RemoveButton onClick={() => removeItem('process', i)} />
              </div>
              <Field label="Small label (e.g. 01 / STRATEGY CALL)" value={p.num} onChange={(v) => set(`process.${i}.num`, v)} />
              <Field label="Title" value={p.title} onChange={(v) => set(`process.${i}.title`, v)} />
              <TextArea label="Description" value={p.description} onChange={(v) => set(`process.${i}.description`, v)} rows={2} />
            </div>
          ))}
          <AddButton onClick={() => addItem('process', { num: '', title: '', description: '' })} />
        </SectionCard>

        <SectionCard title="Stats Band">
          {content.stats.map((s, i) => (
            <div key={i} className="grid sm:grid-cols-4 gap-3 border border-line rounded-xl p-4 items-end">
              <Field label="Value" value={s.value} onChange={(v) => set(`stats.${i}.value`, isNaN(Number(v)) ? v : Number(v))} />
              <Field label="Suffix (e.g. %)" value={s.suffix} onChange={(v) => set(`stats.${i}.suffix`, v)} />
              <Field label="Label" value={s.label} onChange={(v) => set(`stats.${i}.label`, v)} />
              <label className="flex items-center gap-2 text-sm mb-2">
                <input type="checkbox" checked={!!s.numeric} onChange={(e) => set(`stats.${i}.numeric`, e.target.checked)} />
                Animate as number
              </label>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Testimonials">
          {content.testimonials.map((t, i) => (
            <div key={i} className="border border-line rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-display font-bold text-sm">Testimonial {i + 1}</span>
                <RemoveButton onClick={() => removeItem('testimonials', i)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Name" value={t.name} onChange={(v) => set(`testimonials.${i}.name`, v)} />
                <Field label="Role" value={t.role} onChange={(v) => set(`testimonials.${i}.role`, v)} />
              </div>
              <TextArea label="Quote" value={t.quote} onChange={(v) => set(`testimonials.${i}.quote`, v)} rows={2} />
            </div>
          ))}
          <AddButton onClick={() => addItem('testimonials', { name: '', role: '', quote: '' })} />
        </SectionCard>

        <SectionCard title="Values (About page)">
          {content.values.map((v, i) => (
            <div key={i} className="border border-line rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-display font-bold text-sm">Value {i + 1}</span>
                <RemoveButton onClick={() => removeItem('values', i)} />
              </div>
              <Field label="Title" value={v.title} onChange={(val) => set(`values.${i}.title`, val)} />
              <TextArea label="Description" value={v.description} onChange={(val) => set(`values.${i}.description`, val)} rows={2} />
            </div>
          ))}
          <AddButton onClick={() => addItem('values', { icon: 'target', title: '', description: '' })} />
        </SectionCard>

        <SectionCard title="Service Categories (Services page)">
          {content.serviceCategories.map((cat, ci) => (
            <div key={ci} className="border border-line rounded-xl p-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Category label" value={cat.title} onChange={(v) => set(`serviceCategories.${ci}.title`, v)} />
                <Field label="Category heading" value={cat.heading} onChange={(v) => set(`serviceCategories.${ci}.heading`, v)} />
              </div>
              {cat.items.map((item, ii) => (
                <div key={ii} className="border border-line rounded-lg p-3 bg-paper">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-display font-semibold text-xs">{cat.title} — item {ii + 1}</span>
                    <RemoveButton onClick={() => removeItem(`serviceCategories.${ci}.items`, ii)} />
                  </div>
                  <Field label="Title" value={item.title} onChange={(v) => set(`serviceCategories.${ci}.items.${ii}.title`, v)} />
                  <TextArea label="Description" value={item.description} onChange={(v) => set(`serviceCategories.${ci}.items.${ii}.description`, v)} rows={2} />
                  <ListTextArea label="What's included" items={item.includes} onChange={(v) => set(`serviceCategories.${ci}.items.${ii}.includes`, v)} rows={3} />
                </div>
              ))}
              <AddButton label="+ Add item to this category" onClick={() => addItem(`serviceCategories.${ci}.items`, { title: 'New', description: '', includes: [] })} />
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Coaching Block (Services page)">
          <Field label="Title" value={content.coaching.title} onChange={(v) => set('coaching.title', v)} />
          <TextArea label="Description" value={content.coaching.description} onChange={(v) => set('coaching.description', v)} rows={2} />
          <ListTextArea label="Platform pills" items={content.coaching.pills} onChange={(v) => set('coaching.pills', v)} rows={3} />
          <ListTextArea label="What's included" items={content.coaching.includes} onChange={(v) => set('coaching.includes', v)} rows={4} />
        </SectionCard>

        <SectionCard title="Contact Page">
          <Field label="Response time text" value={content.contact.responseTime} onChange={(v) => set('contact.responseTime', v)} />
          <Field label="Floating WhatsApp button — pre-filled message" value={content.floatingWhatsapp.message} onChange={(v) => set('floatingWhatsapp.message', v)} />
        </SectionCard>

        <SectionCard title="FAQs">
          {content.faqs.map((f, i) => (
            <div key={i} className="border border-line rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-display font-bold text-sm">FAQ {i + 1}</span>
                <RemoveButton onClick={() => removeItem('faqs', i)} />
              </div>
              <Field label="Question" value={f.q} onChange={(v) => set(`faqs.${i}.q`, v)} />
              <TextArea label="Answer" value={f.a} onChange={(v) => set(`faqs.${i}.a`, v)} rows={3} />
            </div>
          ))}
          <AddButton onClick={() => addItem('faqs', { q: '', a: '' })} />
        </SectionCard>

      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-line px-5 sm:px-8 py-4 flex justify-end gap-3">
        {status === 'saved' && <span className="text-teal text-sm font-semibold self-center">Saved ✓</span>}
        {status === 'error' && <span className="text-red-600 text-sm font-semibold self-center">Save failed — try again</span>}
        <button
          onClick={handleSave}
          disabled={status === 'saving'}
          className="bg-gold hover:bg-goldDeep text-ink font-display font-bold px-6 py-3 rounded-full disabled:opacity-60"
        >
          {status === 'saving' ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </main>
  );
}
