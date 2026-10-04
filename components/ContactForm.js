'use client';
import { useEffect, useRef, useState } from 'react';
import Icon from './Icons';
import { waLink } from '@/lib/links';

const INTERESTS = ['Not sure yet', 'eBay', 'Amazon', 'Shopify', 'TikTok Shop', '1-on-1 Coaching', 'Graphic Design', 'Website Development', 'App Development'];
const BUDGETS = ['Not sure yet', 'Under $500', '$500 – $1,500', '$1,500 – $5,000', '$5,000+'];

export default function ContactForm({ responseTime, whatsapp }) {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [defaults, setDefaults] = useState({ interest: INTERESTS[0], source: '' });
  const startedAt = useRef(0);
  const payloadRef = useRef(null);

  useEffect(() => {
    startedAt.current = Date.now();
    const params = new URLSearchParams(window.location.search);
    if (params.get('sent')) setStatus('sent'); // returning from the no-JS form fallback
    if (params.get('error')) { setServerError('We could not send your message. Please check your details or use WhatsApp.'); setStatus('error'); }
    const interest = params.get('interest');
    setDefaults({
      interest: INTERESTS.find((i) => i.toLowerCase() === (interest || '').toLowerCase()) || INTERESTS[0],
      source: params.get('from') || '',
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const f = e.currentTarget;
    const payload = {
      name: f.fullName.value.trim(),
      email: f.email.value.trim(),
      phone: f.phone.value.trim(),
      interest: f.interest.value,
      budget: f.budget.value,
      message: f.message.value.trim(),
      website: f.website.value, // honeypot
      source: defaults.source || 'contact-form',
    };
    payloadRef.current = payload;

    const next = {};
    if (payload.name.length < 2) next.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) next.email = 'Please enter a valid email.';
    if (payload.message.length < 5) next.message = 'Tell us a little about your store.';
    setErrors(next);
    if (Object.keys(next).length) {
      f.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setStatus('sending');
    setServerError('');
    try {
      // Too fast to be human? The server still validates — this only delays obvious bots.
      if (Date.now() - startedAt.current < 1200) await new Promise((r) => setTimeout(r, 1200));
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus('sent');
      } else if (res.status === 503 && whatsapp) {
        // Database not connected yet — WhatsApp is still a working channel.
        setStatus('sent');
        setServerError('wa-only');
      } else {
        setErrors(data.fields || {});
        setServerError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setServerError('Network error — please check your connection and try again.');
      setStatus('error');
    }
  }

  function sendWhatsApp() {
    const p = payloadRef.current;
    if (!p) { window.open(waLink(whatsapp, "Hi, I just sent a message through your website."), '_blank', 'noopener'); return; }
    const text = `Hi! New inquiry from the website:\nName: ${p.name}\nEmail: ${p.email}\nPhone: ${p.phone || '-'}\nInterested in: ${p.interest}\nBudget: ${p.budget}\n\n${p.message}`;
    window.open(waLink(whatsapp, text), '_blank', 'noopener');
  }

  if (status === 'sent') {
    return (
      <div className="text-center py-12 px-2 animate-rise">
        <div className="mx-auto w-16 h-16 rounded-full bg-teal/15 text-teal grid place-items-center ring-8 ring-teal/10">
          <Icon name="check" className="w-8 h-8" />
        </div>
        <h3 className="mt-6 text-[1.7rem]">{serverError === 'wa-only' ? 'One more step' : 'Message received'}</h3>
        <p className="mt-3 text-muted max-w-[40ch] mx-auto leading-relaxed">
          {serverError === 'wa-only'
            ? 'Our inbox is being set up — please send your details on WhatsApp so we get them right away.'
            : `Thanks, ${payloadRef.current?.name?.split(' ')[0] || 'there'}! We'll reply ${responseTime?.toLowerCase() || 'soon'}.`}
        </p>
        {whatsapp && (
          <button onClick={sendWhatsApp} className="btn btn-primary mt-8">
            <Icon name="whatsapp" className="w-4 h-4" /> {serverError === 'wa-only' ? 'Send on WhatsApp' : 'Also message us on WhatsApp'}
          </button>
        )}
        <div className="sr-only" aria-live="polite">Your message was sent.</div>
      </div>
    );
  }

  const err = (k) => errors[k];
  const base = (k) => `field ${err(k) ? '!border-rose' : ''}`;

  return (
    <form method="post" action="/api/contact" onSubmit={handleSubmit} noValidate aria-describedby={serverError ? 'form-error' : undefined}>
      {/* honeypot — hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="fullName" className="label">Full name</label>
          <input id="fullName" name="fullName" autoComplete="name" placeholder="Your name" className={base('name')} aria-invalid={!!err('name')} />
          {err('name') && <p className="mt-1.5 text-xs text-rose">{err('name')}</p>}
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={base('email')} aria-invalid={!!err('email')} />
          {err('email') && <p className="mt-1.5 text-xs text-rose">{err('email')}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="label">Phone / WhatsApp <span className="text-faint font-normal">(optional)</span></label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 555 000 0000" className="field" />
        </div>
        <div>
          <label htmlFor="interest" className="label">Interested in</label>
          <select id="interest" name="interest" key={defaults.interest} defaultValue={defaults.interest} className="field">
            {INTERESTS.map((i) => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="budget" className="label">Budget range <span className="text-faint font-normal">(optional)</span></label>
          <select id="budget" name="budget" className="field">
            {BUDGETS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="label">Tell us about your store</label>
          <textarea id="message" name="message" rows={5} placeholder="Are you just starting out, or already selling and looking to grow?" className={`${base('message')} min-h-[130px] resize-y`} aria-invalid={!!err('message')} />
          {err('message') && <p className="mt-1.5 text-xs text-rose">{err('message')}</p>}
        </div>
      </div>

      {serverError && status === 'error' && (
        <p id="form-error" role="alert" className="mt-5 rounded-xl border border-rose/30 bg-rose/10 text-rose px-4 py-3 text-sm">{serverError}</p>
      )}

      <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full mt-7 disabled:opacity-60 disabled:cursor-wait">
        {status === 'sending' ? (
          <><span className="w-4 h-4 rounded-full border-2 border-[#1a1204]/30 border-t-[#1a1204] animate-spin" /> Sending…</>
        ) : (
          <>Send message <Icon name="send" className="w-4 h-4" /></>
        )}
      </button>
      <p className="text-xs text-faint mt-4 text-center">
        We typically reply {responseTime?.toLowerCase() || 'within 1 business day'}. Your details are only used to respond to you — see our <a href="/privacy" className="underline hover:text-fg">privacy policy</a>.
      </p>
    </form>
  );
}
