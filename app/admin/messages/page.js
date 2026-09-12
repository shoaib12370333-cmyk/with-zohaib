'use client';
import { useEffect, useState } from 'react';
import AdminNav from '@/components/admin/AdminNav';

export default function MessagesPage() {
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/messages')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
        else setError(data.error || 'Could not load messages');
      })
      .catch(() => setError('Could not load messages'));
  }, []);

  return (
    <main className="min-h-screen bg-paper pb-24">
      <AdminNav />
      <div className="bg-white border-b border-line px-5 sm:px-8 py-3">
        <span className="font-mono-eyebrow text-[.7rem] text-tealDeep tracking-[.1em] uppercase">Messages</span>
        <h1 className="font-display font-bold">Contact Form Submissions</h1>
      </div>

      <div className="max-w-[800px] mx-auto px-5 sm:px-8 pt-8">
        <p className="text-slateSoft text-sm mb-6">
          This is a backup record of every contact form submission. Most inquiries also open directly in WhatsApp for the visitor to send — this list catches anyone who filled the form but didn't complete that step.
        </p>

        {error && <p className="text-red-600">{error}</p>}
        {!messages && !error && <p className="text-slateSoft">Loading…</p>}
        {messages && messages.length === 0 && <p className="text-slateSoft">No messages yet.</p>}

        <div className="space-y-4">
          {(messages || []).map((m) => (
            <div key={m.id} className="bg-white border border-line rounded-2xl p-5">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <div className="font-display font-bold">{m.name}</div>
                  <div className="text-sm text-slateSoft">{m.email}{m.phone ? ` · ${m.phone}` : ''}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono-eyebrow text-xs text-tealDeep border border-teal/30 px-2.5 py-1 rounded-full">{m.interest || 'General'}</span>
                  <div className="text-xs text-slateSoft mt-1">{new Date(m.created_at).toLocaleString()}</div>
                </div>
              </div>
              <p className="text-sm text-slate mt-3">{m.message}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
