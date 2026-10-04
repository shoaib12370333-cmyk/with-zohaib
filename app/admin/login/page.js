'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Icons';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [needsCode, setNeedsCode] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.needsCode) { setNeedsCode(true); return; }
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-screen grid place-items-center px-5 overflow-hidden noise">
      <div className="aurora"><i className="w-[36rem] h-[36rem] bg-gold/20 -top-60 -right-40" /><i className="w-[30rem] h-[30rem] bg-teal/15 -bottom-60 -left-40" /></div>
      <div className="grid-bg" />
      <form onSubmit={submit} className="relative card w-full max-w-[420px] p-8 sm:p-10">
        <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold border border-gold/30 grid place-items-center"><Icon name="lock" className="w-6 h-6" /></div>
        <h1 className="text-[1.8rem] mt-6">Admin sign in</h1>
        <p className="text-muted mt-2 text-sm">{needsCode ? 'Enter the 6-digit code from your authenticator app.' : 'Enter your admin password to manage the site.'}</p>

        <div className="mt-7 space-y-4">
          {!needsCode ? (
            <div>
              <label htmlFor="pw" className="label">Password</label>
              <input id="pw" type="password" autoFocus autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field" />
            </div>
          ) : (
            <div>
              <label htmlFor="code" className="label">2FA code</label>
              <input id="code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoFocus autoComplete="one-time-code" required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} className="field text-center tracking-[.5em] font-mono text-xl" />
            </div>
          )}
        </div>

        {error && <p role="alert" className="mt-4 rounded-xl border border-rose/30 bg-rose/10 text-rose px-4 py-3 text-sm">{error}</p>}

        <button type="submit" disabled={busy} className="btn btn-primary w-full mt-6 disabled:opacity-60">{busy ? 'Checking…' : needsCode ? 'Verify & sign in' : 'Continue'}</button>
        <a href="/" className="block text-center text-sm text-faint hover:text-fg mt-5">← Back to site</a>
      </form>
    </main>
  );
}
