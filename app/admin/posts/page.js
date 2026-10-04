'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from '@/components/Icons';
import { renderMarkdown, slugify } from '@/lib/markdown';
import { ImageField, TextInput, TextArea, Toggle, useToast } from '@/components/admin/Fields';

const toLocalInput = (d) => {
  const dt = new Date(d);
  dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
  return dt.toISOString().slice(0, 16);
};
const NEW = () => ({ id: null, title: '', slug: '', excerpt: '', body: '', cover_url: '', tags: [], published: false, published_at: new Date().toISOString() });

export default function PostsPage() {
  const [posts, setPosts] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [toast, toastNode] = useToast();

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/posts');
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const html = useMemo(() => (editing && preview ? renderMarkdown(editing.body).html : ''), [editing, preview]);

  function edit(p) {
    setEditing(p ? { ...p, tags: Array.isArray(p.tags) ? p.tags : [] } : NEW());
    setSlugTouched(!!p);
    setPreview(false);
  }
  const patch = (k, v) => setEditing((e) => ({ ...e, [k]: v, ...(k === 'title' && !slugTouched ? { slug: slugify(v) } : {}) }));

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      toast(editing.published ? 'Published' : 'Draft saved');
      setEditing({ ...data, tags: data.tags || [] });
      await load();
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  }
  async function remove() {
    if (!editing?.id || !confirm(`Delete “${editing.title}” permanently?`)) return;
    const res = await fetch(`/api/admin/posts?id=${editing.id}`, { method: 'DELETE' });
    if (res.ok) { toast('Deleted'); setEditing(null); load(); } else toast('Delete failed', 'error');
  }

  if (editing) {
    return (
      <div>
        <div className="sticky top-0 z-30 -mx-4 sm:-mx-8 px-4 sm:px-8 py-4 mb-6 bg-bg/90 backdrop-blur border-b border-edge/10 flex flex-wrap items-center justify-between gap-3">
          <button onClick={() => setEditing(null)} className="text-sm text-muted hover:text-fg">← All posts</button>
          <div className="flex items-center gap-2">
            {editing.id && <button onClick={remove} className="btn btn-ghost btn-sm !text-rose"><Icon name="trash" className="w-4 h-4" /></button>}
            {editing.id && editing.published && <a href={`/blog/${editing.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">View live</a>}
            <button onClick={save} disabled={saving || !editing.title.trim()} className="btn btn-primary btn-sm disabled:opacity-40">{saving ? 'Saving…' : editing.published ? 'Save & publish' : 'Save draft'}</button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            <TextInput label="Title" value={editing.title} onChange={(v) => patch('title', v)} placeholder="A clear, specific headline" />
            <TextArea label="Excerpt (shown on cards & Google)" value={editing.excerpt} onChange={(v) => patch('excerpt', v)} rows={2} hint="Aim for 1–2 sentences, under 160 characters." />
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-muted">Body (Markdown)</span>
                <div className="flex rounded-full border border-edge/15 p-0.5 text-xs">
                  {[['Write', false], ['Preview', true]].map(([l, v]) => (
                    <button key={l} onClick={() => setPreview(v)} className={`px-3 py-1 rounded-full ${preview === v ? 'bg-gold2 text-[#1a1204] font-semibold' : 'text-muted'}`}>{l}</button>
                  ))}
                </div>
              </div>
              {preview ? (
                <div className="prose-x rounded-xl border border-edge/10 bg-bg/40 p-6 min-h-[420px]" dangerouslySetInnerHTML={{ __html: html || '<p>Nothing to preview yet.</p>' }} />
              ) : (
                <textarea
                  className="adm-input font-mono !text-[.85rem] leading-relaxed min-h-[420px]"
                  value={editing.body}
                  onChange={(e) => patch('body', e.target.value)}
                  placeholder={'## Heading\n\nWrite in Markdown — **bold**, *italic*, [links](https://…), lists, > quotes.'}
                />
              )}
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 self-start">
            <Toggle label="Published" checked={editing.published} onChange={(v) => patch('published', v)} hint={editing.published ? 'Visible on the site' : 'Draft — only you can see it'} />
            <TextInput label="URL slug" value={editing.slug} onChange={(v) => { setSlugTouched(true); patch('slug', slugify(v)); }} hint={`/blog/${editing.slug || '…'}`} />
            <label className="block">
              <span className="block text-xs font-semibold text-muted mb-1.5">Publish date</span>
              <input type="datetime-local" className="adm-input" value={toLocalInput(editing.published_at)} onChange={(e) => patch('published_at', new Date(e.target.value).toISOString())} />
              <span className="block text-[.7rem] text-faint mt-1">Set a future date to schedule.</span>
            </label>
            <TextInput label="Tags" value={editing.tags.join(', ')} onChange={(v) => patch('tags', v.split(',').map((t) => t.trim()).filter(Boolean))} hint="Comma-separated; first tag is shown on cards." />
            <ImageField label="Cover image" value={editing.cover_url} onChange={(v) => patch('cover_url', v)} hint="Optional. 1600×800 works well." />
          </aside>
        </div>
        {toastNode}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl">Blog posts</h1>
          <p className="text-sm text-muted mt-1">Write helpful guides — they bring in search traffic and build trust.</p>
        </div>
        <button onClick={() => edit(null)} className="btn btn-primary btn-sm"><Icon name="plus" className="w-4 h-4" /> New post</button>
      </div>

      {posts === null && <p className="text-muted py-16 text-center">Loading…</p>}
      {posts?.length === 0 && <p className="rounded-2xl border border-dashed border-edge/15 py-16 text-center text-muted">No posts yet — write your first one.</p>}
      <ul className="space-y-3">
        {posts?.map((p) => {
          const scheduled = p.published && new Date(p.published_at) > new Date();
          return (
            <li key={p.id}>
              <button onClick={() => edit(p)} className="w-full text-left rounded-2xl border border-edge/10 bg-surface/70 hover:border-gold/40 transition-colors p-5 flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <div className="font-display font-semibold truncate">{p.title}</div>
                  <div className="text-xs text-faint mt-1">/blog/{p.slug} · {new Date(p.published_at).toLocaleDateString()}</div>
                </div>
                <span className={`chip ${!p.published ? '' : scheduled ? 'text-violet border-violet/30' : 'text-teal border-teal/30'}`}>{!p.published ? 'Draft' : scheduled ? 'Scheduled' : 'Published'}</span>
                <Icon name="arrow" className="w-4 h-4 text-faint" />
              </button>
            </li>
          );
        })}
      </ul>
      {posts && posts.length > 0 && !posts.some((p) => p.id > 0) && (
        <p className="mt-6 text-sm text-gold">Connect the database to create and edit posts — these are built-in starter articles.</p>
      )}
      {toastNode}
    </div>
  );
}
