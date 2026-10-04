'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from '@/components/Icons';
import { waLink } from '@/lib/links';
import { useToast } from '@/components/admin/Fields';

const FILTERS = ['all', 'new', 'read', 'replied', 'archived'];
const TONE = { new: 'text-gold border-gold/40', read: 'text-muted', replied: 'text-teal border-teal/30', archived: 'text-faint' };

export default function MessagesPage() {
  const [rows, setRows] = useState(null);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const [error, setError] = useState('');
  const [toast, toastNode] = useToast();

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setRows(data);
    } catch (e) { setError(e.message); setRows([]); }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function setStatus(id, status) {
    setRows((r) => r.map((m) => (m.id === id ? { ...m, status } : m)));
    const res = await fetch('/api/admin/messages', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    if (!res.ok) { toast('Could not update', 'error'); load(); }
  }
  async function remove(id) {
    if (!confirm('Delete this lead permanently?')) return;
    const res = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
    if (res.ok) { setRows((r) => r.filter((m) => m.id !== id)); setOpen(null); toast('Deleted'); } else toast('Delete failed', 'error');
  }

  const counts = useMemo(() => {
    const c = { all: rows?.length || 0 };
    for (const f of FILTERS.slice(1)) c[f] = rows?.filter((m) => (m.status || 'new') === f).length || 0;
    return c;
  }, [rows]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (rows || []).filter((m) => (filter === 'all' || (m.status || 'new') === filter) && (!s || [m.name, m.email, m.message, m.interest].some((v) => (v || '').toLowerCase().includes(s))));
  }, [rows, filter, q]);

  const exportCsv = () => {
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const head = ['Date', 'Name', 'Email', 'Phone', 'Interest', 'Budget', 'Status', 'Message'];
    const lines = (rows || []).map((m) => [new Date(m.created_at).toISOString(), m.name, m.email, m.phone, m.interest, m.budget, m.status, m.message].map(esc).join(','));
    const blob = new Blob([[head.join(','), ...lines].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl">Leads inbox</h1>
          <p className="text-sm text-muted mt-1">Everyone who filled in the contact form.</p>
        </div>
        <button onClick={exportCsv} disabled={!rows?.length} className="btn btn-ghost btn-sm disabled:opacity-40">Export CSV</button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3.5 py-1.5 rounded-full text-sm capitalize border transition-colors ${filter === f ? 'bg-gold2 text-[#1a1204] border-gold2' : 'border-edge/15 text-muted hover:text-fg'}`}>
            {f} <span className="opacity-70">{counts[f]}</span>
          </button>
        ))}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search leads…" aria-label="Search leads" className="adm-input !w-auto flex-1 min-w-[160px] max-w-[280px] ml-auto" />
      </div>

      {error && <p className="text-rose text-sm mb-4">{error}</p>}
      {rows === null && <p className="text-muted py-16 text-center">Loading…</p>}
      {rows && shown.length === 0 && !error && (
        <div className="rounded-2xl border border-dashed border-edge/15 py-16 text-center text-muted">
          <Icon name="inbox" className="w-10 h-10 mx-auto text-faint mb-3" />
          No leads {filter !== 'all' || q ? 'match your filters' : 'yet — they will appear here as soon as someone fills in the form'}.
        </div>
      )}

      <ul className="space-y-3">
        {shown.map((m) => {
          const st = m.status || 'new';
          const isOpen = open === m.id;
          return (
            <li key={m.id} className={`rounded-2xl border bg-surface/70 transition-colors ${st === 'new' ? 'border-gold/30' : 'border-edge/10'}`}>
              <button
                className="w-full text-left p-5 flex flex-wrap items-start justify-between gap-3"
                aria-expanded={isOpen}
                onClick={() => { setOpen(isOpen ? null : m.id); if (!isOpen && st === 'new') setStatus(m.id, 'read'); }}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-semibold">{m.name}</span>
                    <span className={`chip !py-0.5 capitalize ${TONE[st]}`}>{st}</span>
                    {m.interest && <span className="chip !py-0.5">{m.interest}</span>}
                  </div>
                  <div className="text-sm text-muted mt-1 truncate">{m.email}</div>
                  {!isOpen && <p className="text-sm text-faint mt-2 line-clamp-1">{m.message}</p>}
                </div>
                <time className="font-mono text-xs text-faint">{new Date(m.created_at).toLocaleString()}</time>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-edge/10 pt-4">
                  <p className="whitespace-pre-wrap leading-relaxed">{m.message}</p>
                  <dl className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
                    <div><dt className="text-faint text-xs">Phone</dt><dd>{m.phone || '—'}</dd></div>
                    <div><dt className="text-faint text-xs">Budget</dt><dd>{m.budget || '—'}</dd></div>
                    <div><dt className="text-faint text-xs">Source</dt><dd>{m.source || 'contact form'}</dd></div>
                  </dl>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a className="btn btn-primary btn-sm" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your enquiry')}`} onClick={() => setStatus(m.id, 'replied')}><Icon name="mail" className="w-4 h-4" /> Reply by email</a>
                    {m.phone && <a className="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer" href={waLink(m.phone.replace(/\D/g, ''), `Hi ${m.name.split(' ')[0]}, thanks for reaching out!`)} onClick={() => setStatus(m.id, 'replied')}><Icon name="whatsapp" className="w-4 h-4" /> WhatsApp</a>}
                    {st !== 'archived' ? <button className="btn btn-ghost btn-sm" onClick={() => setStatus(m.id, 'archived')}>Archive</button> : <button className="btn btn-ghost btn-sm" onClick={() => setStatus(m.id, 'new')}>Mark as new</button>}
                    <button className="btn btn-ghost btn-sm !text-rose ml-auto" onClick={() => remove(m.id)}><Icon name="trash" className="w-4 h-4" /> Delete</button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {toastNode}
    </div>
  );
}
