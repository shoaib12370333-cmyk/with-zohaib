'use client';
import { useState } from 'react';
import SchemaEditor from '@/components/admin/SchemaEditor';
import SaveBar from '@/components/admin/SaveBar';
import useContentEditor from '@/components/admin/useContentEditor';
import { useToast } from '@/components/admin/Fields';

const GROUPS = [
  { id: 'home', label: 'Homepage', keys: ['hero', 'platforms', 'marqueeItems', 'trustStripLabel', 'sectionLabels', 'servicesOverview', 'featureBlock', 'process', 'stats', 'dashboard', 'testimonials', 'faqs'] },
  { id: 'about', label: 'About & values', keys: ['founder', 'values'] },
  { id: 'services', label: 'Services', keys: ['serviceCategories', 'coaching'] },
  { id: 'pages', label: 'Page headings & CTAs', keys: ['pageHeaders', 'ctaBanners'] },
];

export default function ContentPage() {
  const { content, setContent, dirty, save, status, error, replace } = useContentEditor();
  const [tab, setTab] = useState('home');
  const [toast, toastNode] = useToast();

  if (!content) return <p className="text-muted py-20 text-center">{status === 'error' ? error : 'Loading…'}</p>;
  const group = GROUPS.find((g) => g.id === tab);

  return (
    <SaveBar
      title="Site content"
      subtitle="Edit any text, image or list on the public site. Changes go live within seconds of saving."
      dirty={dirty}
      status={status}
      error={error}
      onSave={async () => { if (await save()) toast('Saved — your site is updating'); }}
      onRestore={(d) => { replace(d); toast('Version restored'); }}
    >
      <div role="tablist" className="flex flex-wrap gap-2 mb-6">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            role="tab"
            aria-selected={tab === g.id}
            onClick={() => setTab(g.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${tab === g.id ? 'bg-gold2 text-[#1a1204] border-gold2' : 'border-edge/15 text-muted hover:text-fg'}`}
          >
            {g.label}
          </button>
        ))}
      </div>
      <SchemaEditor content={content} keys={group.keys} onChange={setContent} />
      {toastNode}
    </SaveBar>
  );
}
