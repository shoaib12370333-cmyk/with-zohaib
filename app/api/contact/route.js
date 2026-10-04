import { NextResponse, after } from 'next/server';
import { saveMessage, rateLimit, hasDatabase } from '@/lib/db';
import { clientKey, sameOrigin } from '@/lib/auth';
import { notifyNewLead } from '@/lib/notify';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

// The form normally submits as JSON via fetch(). If the visitor's JavaScript has
// not loaded yet it falls back to a plain form POST — handled here and answered
// with a redirect back to /contact so nothing is ever put in the URL.
export async function POST(request) {
  const ct = request.headers.get('content-type') || '';
  const isForm = ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data');
  const reply = (json, status, flag) =>
    isForm ? NextResponse.redirect(new URL(`/contact?${flag}=1`, request.url), 303) : NextResponse.json(json, { status });

  if (!sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let body;
  try {
    if (isForm) {
      const fd = await request.formData();
      body = {
        name: fd.get('fullName') ?? fd.get('name'),
        email: fd.get('email'),
        phone: fd.get('phone'),
        interest: fd.get('interest'),
        budget: fd.get('budget'),
        message: fd.get('message'),
        website: fd.get('website'),
      };
    } else {
      body = await request.json();
    }
  } catch {
    return reply({ error: 'Invalid request' }, 400, 'error');
  }

  // Honeypot: real people never see or fill this field. Pretend success to bots.
  if (body?.website) return reply({ ok: true }, 200, 'sent');

  const limit = await rateLimit(`contact:${clientKey(request)}`, 5, 10 * 60);
  if (!limit.ok) {
    return isForm
      ? reply(null, 429, 'error')
      : NextResponse.json(
          { error: 'Too many messages — please try again in a few minutes, or message us on WhatsApp.' },
          { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
        );
  }

  const lead = {
    name: clean(body?.name, 100),
    email: clean(body?.email, 160).toLowerCase(),
    phone: clean(body?.phone, 40),
    interest: clean(body?.interest, 80),
    budget: clean(body?.budget, 60),
    source: clean(body?.source, 60),
    message: clean(body?.message, 4000),
  };

  const errors = {};
  if (lead.name.length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(lead.email)) errors.email = 'Please enter a valid email address.';
  if (lead.message.length < 5) errors.message = 'Tell us a little about your store.';
  if (Object.keys(errors).length) return reply({ error: 'Please check the highlighted fields.', fields: errors }, 422, 'error');

  if (!hasDatabase()) return reply({ error: 'not_configured' }, 503, 'error');

  try {
    await saveMessage(lead);
  } catch (err) {
    console.error('Contact form error:', err);
    return reply({ error: 'Could not save your message — please try WhatsApp instead.' }, 500, 'error');
  }

  // Send email / webhook after the response so the visitor never waits on it.
  after(() => notifyNewLead(lead));
  return reply({ ok: true }, 200, 'sent');
}
