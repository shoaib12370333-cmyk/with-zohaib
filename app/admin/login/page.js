'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        setError(`Server error (status ${res.status}). Please try again in a moment.`);
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-ink2 border border-lineDark rounded-2xl p-8">
        <span className="font-mono-eyebrow text-[.72rem] tracking-[.14em] text-gold uppercase">Admin Access</span>
        <h1 className="text-white text-[1.6rem] font-display font-bold mt-2 mb-6">E-Commerce With Zohaib</h1>
        <label className="block text-[#D7DBE4] text-sm font-display font-semibold mb-2">Password</label>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-ink border border-lineDark text-white outline-none focus:border-teal mb-4"
        />
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold hover:bg-goldDeep text-ink font-display font-bold py-3 rounded-full transition-colors disabled:opacity-60"
        >
          {loading ? 'Checking…' : 'Log In'}
        </button>
      </form>
    </main>
  );
}
