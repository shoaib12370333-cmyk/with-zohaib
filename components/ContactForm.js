'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from './Icons';
import { waLink } from '@/lib/links';

const INTERESTS = ['Not sure yet', 'eBay', 'Amazon', 'Shopify', 'TikTok Shop', '1-on-1 Coaching', 'Graphic Design', 'Website Development', 'App Development'];
const BUDGETS = ['Not sure yet', 'Under $500', '$500 – $1,500', '$1,500 – $5,000', '$5,000+'];

// Input ids, keyed by the field name the API uses in its error map.
const FIELD_ID = { name: 'fullName', email: 'email', message: 'message' };

// A short horizontal shake for invalid inputs / the error banner. Uses the Web
// Animations API so no extra keyframes are needed, and does nothing for visitors
// who prefer reduced motion.
function shake(el) {
  if (!el || typeof el.animate !== 'function') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-7px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(3px)' },
      { transform: 'translateX(0)' },
    ],
    { duration: 460, easing: 'cubic-bezier(.36,.07,.19,.97)' }
  );
}

// One form row. data-reveal + the data-stagger on the grid make the rows slide up one
// after another (handled globally by <PointerEffects/>, so no-JS visitors just see the
// form). Keep this wrapper's className constant between renders — the reveal state
// lives on the element as a class that React must not overwrite.
function Field({ id, label, hint, error, span = false, children }) {
  return (
    <div data-reveal="" className={`group/f ${span ? 'sm:col-span-2' : ''}`}>
      <label htmlFor={id} className="label transition-colors duration-300 group-focus-within/f:text-tealDeep">
        {label}
        {hint && <> <span className="font-normal text-faint">{hint}</span></>}
      </label>
      {children}
      {error && <p id={`${id}-error`} className="animate-rise mt-1.5 text-xs text-rose">{error}</p>}
    </div>
  );
}

// Success tick: the ring draws, then the check. Plain stroke-dashoffset transitions
// (flipped one frame after mount) so it needs no keyframes; reduced motion is
// handled by the global rule in globals.css. The stroke only becomes visible when its
// own draw starts, so round line caps never leave a stray dot behind.
function SuccessMark() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let b = 0;
    const a = requestAnimationFrame(() => { b = requestAnimationFrame(() => setOn(true)); });
    return () => { cancelAnimationFrame(a); cancelAnimationFrame(b); };
  }, []);
  const draw = (delay, ms) => ({
    strokeDasharray: 1,
    strokeDashoffset: on ? 0 : 1,
    opacity: on ? 1 : 0,
    transition: `stroke-dashoffset ${ms}ms cubic-bezier(.2,.7,.2,1) ${delay}ms, opacity 0s linear ${delay}ms`,
  });
  return (
    <div className="pop-in mx-auto grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-teal/10 text-teal">
      <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden="true" focusable="false">
        <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" pathLength="1" transform="rotate(-90 32 32)" style={draw(0, 700)} />
        <path d="M20 33.5 28.5 42 44.5 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength="1" style={draw(520, 520)} />
      </svg>
    </div>
  );
}

export default function ContactForm({ responseTime, whatsapp }) {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [defaults, setDefaults] = useState({ interest: INTERESTS[0], source: '' });
  const startedAt = useRef(0);
  const payloadRef = useRef(null);
  const bannerRef = useRef(null);
  const doneRef = useRef(null); // success heading — receives focus after an in-page submit
  const focusDone = useRef(false); // true only when 'sent' came from handleSubmit (not ?sent=1 on load)

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

  // Shake the error banner each time a (new) failure lands — after its slide-in has
  // mostly finished, so the two transforms don't fight.
  useEffect(() => {
    if (status !== 'error' || !serverError) return undefined;
    const t = setTimeout(() => shake(bannerRef.current), 450);
    return () => clearTimeout(t);
  }, [status, serverError]);

  // The form unmounts on success, which would drop keyboard focus to <body>. Move it to
  // the success heading instead (preventScroll: the card is already in view).
  useEffect(() => {
    if (status !== 'sent' || !focusDone.current) return;
    focusDone.current = false;
    doneRef.current?.focus({ preventScroll: true });
  }, [status]);

  // Focus the first invalid field and shake every invalid one.
  function flagInvalid(form, fields) {
    const keys = Object.keys(FIELD_ID).filter((k) => fields[k]);
    keys.forEach((k) => shake(form.elements.namedItem(FIELD_ID[k])));
    if (keys.length) form.elements.namedItem(FIELD_ID[keys[0]])?.focus();
  }

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
      flagInvalid(f, next);
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
        focusDone.current = true;
        setStatus('sent');
      } else if (res.status === 503 && whatsapp) {
        // Database not connected yet — WhatsApp is still a working channel.
        focusDone.current = true;
        setStatus('sent');
        setServerError('wa-only');
      } else {
        setErrors(data.fields || {});
        setServerError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        flagInvalid(f, data.fields || {});
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

  // One polite live region, rendered in BOTH branches at the same position so React keeps
  // it mounted across the swap — its text then changes from empty to the message, which
  // is what screen readers announce (a region that mounts already filled is skipped).
  const live = (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {status === 'sent' ? 'Your message was sent.' : ''}
    </div>
  );

  if (status === 'sent') {
    return (
      <>
        {live}
        <div className="px-2 py-10 text-center">
          <SuccessMark />
          <h3 ref={doneRef} tabIndex={-1} className="fade-up mt-6 text-[1.7rem] focus:outline-none" style={{ '--d': '500ms' }}>{serverError === 'wa-only' ? 'One more step' : 'Message received'}</h3>
          <p className="fade-up mx-auto mt-3 max-w-[40ch] leading-relaxed text-muted" style={{ '--d': '620ms' }}>
            {serverError === 'wa-only'
              ? 'Our inbox is being set up — please send your details on WhatsApp so we get them right away.'
              : `Thanks, ${payloadRef.current?.name?.split(' ')[0] || 'there'}! We'll reply ${responseTime?.toLowerCase() || 'soon'}.`}
          </p>
          {whatsapp && (
            // fade-up lives on a wrapper: its fill-forwards animation would otherwise pin the button's hover lift
            <div className="fade-up mt-8" style={{ '--d': '760ms' }}>
              {/* .btn is nowrap; let this longer label wrap on narrow phones */}
              <button type="button" onClick={sendWhatsApp} className="btn btn-primary max-w-full whitespace-normal">
                <Icon name="whatsapp" className="h-4 w-4" /> {serverError === 'wa-only' ? 'Send on WhatsApp' : 'Also message us on WhatsApp'}
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  const err = (k) => errors[k];
  // Error state: rose border + rose focus ring (the .field focus ring is teal otherwise).
  const base = (k) => `field ${err(k) ? '!border-rose focus:!shadow-[0_0_0_4px_rgb(var(--rose)/.15)]' : ''}`;
  const describe = (k, id) => (err(k) ? `${id}-error` : undefined);

  return (
    <>
      {live}
      <form method="post" action="/api/contact" onSubmit={handleSubmit} noValidate aria-busy={status === 'sending'} aria-describedby={serverError ? 'form-error' : undefined}>
        {/* honeypot — hidden from people and assistive tech */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2" data-stagger="55">
          <Field id="fullName" label="Full name" error={err('name')}>
            <input id="fullName" name="fullName" autoComplete="name" placeholder="Your name" className={base('name')} aria-invalid={!!err('name')} aria-describedby={describe('name', 'fullName')} />
          </Field>
          <Field id="email" label="Email" error={err('email')}>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={base('email')} aria-invalid={!!err('email')} aria-describedby={describe('email', 'email')} />
          </Field>
          <Field id="phone" label="Phone / WhatsApp" hint="(optional)">
            <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 555 000 0000" className="field" />
          </Field>
          <Field id="interest" label="Interested in">
            <select id="interest" name="interest" key={defaults.interest} defaultValue={defaults.interest} className="field">
              {INTERESTS.map((i) => <option key={i}>{i}</option>)}
            </select>
          </Field>
          <Field id="budget" label="Budget range" hint="(optional)" span>
            <select id="budget" name="budget" className="field">
              {BUDGETS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </Field>
          <Field id="message" label="Tell us about your store" error={err('message')} span>
            <textarea id="message" name="message" rows={5} placeholder="Are you just starting out, or already selling and looking to grow?" className={`${base('message')} min-h-[130px] resize-y`} aria-invalid={!!err('message')} aria-describedby={describe('message', 'message')} />
          </Field>

          {serverError && status === 'error' && (
            // Text is a darker rose than the --rose token (4.07:1 on the tint); this is ~6.4:1, so the small copy passes AA.
            <p ref={bannerRef} id="form-error" role="alert" className="animate-rise rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-[rgb(168_20_60)] sm:col-span-2">{serverError}</p>
          )}

          <div data-reveal="" className="sm:col-span-2">
            <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full disabled:pointer-events-none disabled:opacity-70">
              {status === 'sending' ? (
                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/25 border-t-ink" aria-hidden="true" /> Sending…</>
              ) : (
                <>Send message <Icon name="send" className="h-4 w-4" /></>
              )}
            </button>
            <p className="mt-4 text-center text-xs text-faint">
              We typically reply {responseTime?.toLowerCase() || 'within 1 business day'}. Your details are only used to respond to you — see our <Link href="/privacy" className="underline decoration-edge/25 decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-fg hover:decoration-gold">privacy policy</Link>.
            </p>
          </div>
        </div>
      </form>
    </>
  );
}
