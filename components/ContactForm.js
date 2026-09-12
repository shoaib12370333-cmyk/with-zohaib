'use client';
import { useState } from 'react';
import Icon from './Icons';
import { waLink } from '@/lib/links';

const INTERESTS = ['Not sure yet', 'eBay', 'Amazon', 'Shopify', 'TikTok Shop', '1-on-1 Coaching', 'Graphic Design', 'Website Development', 'App Development'];

export default function ContactForm({ responseTime, whatsapp }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    const form = e.target;
    const payload = {
      name: form.fullName.value,
      email: form.email.value,
      phone: form.phone.value,
      interest: form.interest.value,
      message: form.message.value,
    };

    if (whatsapp) {
      const text = `New inquiry from the website:\nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone || '-'}\nInterested in: ${payload.interest}\n\n${payload.message}`;
      window.open(waLink(whatsapp, text), '_blank');
    }

    setSent(true);
    setSending(false);

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  if (sent) {
    return (
      <div className="text-center py-14 px-4">
        <Icon name="check" className="w-[52px] h-[52px] text-teal mx-auto mb-4" />
        <h3 className="text-[1.4rem] mb-2">
          {whatsapp ? 'Almost done — send it on WhatsApp' : 'Message sent'}
        </h3>
        <p className="text-slateSoft">
          {whatsapp
            ? "We opened WhatsApp with your message ready to go — just hit send there and we'll reply " + (responseTime?.toLowerCase() || 'soon') + "."
            : "Thanks for reaching out — we'll be in touch " + (responseTime?.toLowerCase() || 'soon') + "."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="mb-5">
          <label className="block font-display text-[.8rem] font-bold mb-2">Full name</label>
          <input name="fullName" type="text" placeholder="Your name" required className="w-full px-4 py-[.85em] border-[1.5px] border-line rounded-lg bg-paper focus:bg-white focus:border-teal outline-none transition-colors" />
        </div>
        <div className="mb-5">
          <label className="block font-display text-[.8rem] font-bold mb-2">Email</label>
          <input name="email" type="email" placeholder="you@example.com" required className="w-full px-4 py-[.85em] border-[1.5px] border-line rounded-lg bg-paper focus:bg-white focus:border-teal outline-none transition-colors" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="mb-5">
          <label className="block font-display text-[.8rem] font-bold mb-2">Phone (optional)</label>
          <input name="phone" type="tel" placeholder="+1 (___) ___-____" className="w-full px-4 py-[.85em] border-[1.5px] border-line rounded-lg bg-paper focus:bg-white focus:border-teal outline-none transition-colors" />
        </div>
        <div className="mb-5">
          <label className="block font-display text-[.8rem] font-bold mb-2">Interested in</label>
          <select name="interest" className="w-full px-4 py-[.85em] border-[1.5px] border-line rounded-lg bg-paper focus:bg-white focus:border-teal outline-none transition-colors">
            {INTERESTS.map((i) => <option key={i}>{i}</option>)}
          </select>
        </div>
      </div>
      <div className="mb-5">
        <label className="block font-display text-[.8rem] font-bold mb-2">Tell us about your store</label>
        <textarea name="message" required placeholder="Are you just starting out, or already selling and looking to grow?" className="w-full px-4 py-[.85em] border-[1.5px] border-line rounded-lg bg-paper focus:bg-white focus:border-teal outline-none transition-colors min-h-[120px]" />
      </div>
      <button type="submit" disabled={sending} className="w-full inline-flex items-center justify-center gap-2 bg-gold hover:bg-goldDeep text-ink font-display font-bold text-base px-8 py-[1.05em] rounded-full transition-all disabled:opacity-60">
        {whatsapp ? 'Send on WhatsApp' : 'Send Message'} {!sending && <Icon name="arrow" className="w-4 h-4" />}
      </button>
      <p className="text-[.82rem] text-slateSoft mt-4 text-center">We typically respond {responseTime?.toLowerCase() || 'within 1 business day'}.</p>
    </form>
  );
}
