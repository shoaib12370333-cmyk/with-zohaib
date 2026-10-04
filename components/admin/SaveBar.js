'use client';
import { useEffect, useState } from 'react';
import Icon from '@/components/Icons';

function History({ onClose, onRestored }) {
  const [versions, setVersions] = useState(null);
  const [busy, setBusy] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch('/api/admin/versions').then((r) => r.json()).then((v) => setVersions(Array.isArray(v) ? v : [])).catch(() => setVersions([]));
  }, []);

  async function restore(id) {
    if (!confirm('Restore this version? Your current content will be saved as a new version first, so you can undo this.')) return;
    setBusy(id);
    setErr('');
    try {
      const res = await fetch('/api/admin/versions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Restore failed');
      onRestored(data.data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="fixed inset-0 z-[400] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Version history">
      <button className="absolute inset-0 bg-black/60" aria-label="Close" onClick={onClose} />
      <div className="relative w-full max-w-[520px] max-h-[80vh] overflow-hidden flex flex-col rounded-2xl border border-edge/15 bg-surface shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-edge/10">
          <h3 className="font-display">Version history</h3>
          <button onClick={onClose} aria-label="Close" className="text-faint hover:text-fg"><Icon name="close" className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto p-3">
          {versions === null && <p className="p-6 text-center text-sm text-muted">Loading…</p>}
          {versions?.length === 0 && <p className="p-6 text-center text-sm text-muted">No saved versions yet. Every time you save, a version is kept here (last 30).</p>}
          {err && <p className="px-3 py-2 text-sm text-rose">{err}</p>}
          {versions?.map((v, i) => (
            <div key={v.id} className="flex items-center justify-between gap-3 px-3 py-3 rounded-xl hover:bg-edge/[.05]">
              <div className="min-w-0">
                <div className="text-sm font-medium">{new Date(v.created_at).toLocaleString()}{i === 0 && <span className="ml-2 chip !py-0.5 text-teal border-teal/30">latest</span>}</div>
                <div className="text-xs text-faint truncate">{v.note || `Version #${v.id}`}</div>
              </div>
              {i > 0 && (
                <button disabled={busy === v.id} onClick={() => restore(v.id)} className="btn btn-ghost btn-sm !px-4 disabled:opacity-50">{busy === v.id ? '…' : 'Restore'}</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SaveBar({ title, subtitle, dirty, status, error, onSave, onRestore, children }) {
  const [showHistory, setShowHistory] = useState(false);
  return (
    <>
      <div className="sticky top-0 lg:top-0 z-30 -mx-4 sm:-mx-8 px-4 sm:px-8 py-4 mb-6 bg-bg/90 backdrop-blur border-b border-edge/10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl">{title}</h1>
          {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {error && <span role="alert" className="text-xs text-rose max-w-[240px]">{error}</span>}
          {dirty && status !== 'saving' && <span className="chip border-gold/30 text-gold"><i className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> Unsaved</span>}
          {!dirty && status === 'idle' && <span className="chip text-teal border-teal/25"><Icon name="check" className="w-3 h-3" /> Saved</span>}
          {onRestore && <button type="button" onClick={() => setShowHistory(true)} className="btn btn-ghost btn-sm">History</button>}
          <button type="button" onClick={() => onSave()} disabled={!dirty || status === 'saving'} className="btn btn-primary btn-sm disabled:opacity-40 disabled:cursor-not-allowed">
            {status === 'saving' ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
      {children}
      {showHistory && <History onClose={() => setShowHistory(false)} onRestored={(d) => { setShowHistory(false); onRestore(d); }} />}
    </>
  );
}
