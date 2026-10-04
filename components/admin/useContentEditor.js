'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// Shared load / dirty-tracking / save logic for every admin page that edits site content.
export default function useContentEditor() {
  const [content, setContentState] = useState(null);
  const [saved, setSaved] = useState('');
  const [status, setStatus] = useState('loading'); // loading | idle | saving | error
  const [error, setError] = useState('');
  const latest = useRef(null);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Could not load content'))))
      .then((d) => { setContentState(d); latest.current = d; setSaved(JSON.stringify(d)); setStatus('idle'); })
      .catch((e) => { setError(e.message); setStatus('error'); });
  }, []);

  const setContent = useCallback((next) => { latest.current = next; setContentState(next); }, []);
  const dirty = content != null && JSON.stringify(content) !== saved;

  const save = useCallback(async (note = '') => {
    setStatus('saving');
    setError('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: latest.current, note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSaved(JSON.stringify(latest.current));
      setStatus('idle');
      return true;
    } catch (e) {
      setError(e.message);
      setStatus('error');
      return false;
    }
  }, []);

  const replace = useCallback((d) => { setContentState(d); latest.current = d; setSaved(JSON.stringify(d)); }, []);

  // warn before leaving with unsaved edits
  useEffect(() => {
    if (!dirty) return;
    const h = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  // Ctrl/⌘+S
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); if (latest.current) save(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [save]);

  return { content, setContent, dirty, save, status, error, replace };
}
