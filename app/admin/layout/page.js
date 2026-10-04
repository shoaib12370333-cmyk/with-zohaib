'use client';
import SchemaEditor from '@/components/admin/SchemaEditor';
import SaveBar from '@/components/admin/SaveBar';
import useContentEditor from '@/components/admin/useContentEditor';
import { Toggle, useToast, Card, humanize } from '@/components/admin/Fields';

export default function SectionsPage() {
  const { content, setContent, dirty, save, status, error, replace } = useContentEditor();
  const [toast, toastNode] = useToast();
  if (!content) return <p className="text-muted py-20 text-center">{status === 'error' ? error : 'Loading…'}</p>;

  const vis = content.visibility || {};
  const setVis = (k, v) => setContent({ ...content, visibility: { ...vis, [k]: v } });

  return (
    <SaveBar
      title="Sections & visibility"
      subtitle="Turn homepage sections and site features on or off, and manage the announcement bar."
      dirty={dirty}
      status={status}
      error={error}
      onSave={async () => { if (await save('Sections & visibility')) toast('Saved'); }}
      onRestore={(d) => { replace(d); toast('Version restored'); }}
    >
      <div className="space-y-5">
        <Card title="Show / hide" subtitle="Hidden sections are removed from the page entirely — your content is kept.">
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.keys(vis).map((k) => (
              <Toggle key={k} label={humanize(k)} checked={vis[k] !== false} onChange={(v) => setVis(k, v)} />
            ))}
          </div>
        </Card>
        <SchemaEditor content={content} keys={['announcement']} titles={{ announcement: 'Announcement bar (top of every page)' }} onChange={setContent} />
      </div>
      {toastNode}
    </SaveBar>
  );
}
