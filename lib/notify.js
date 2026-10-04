// Lead notifications. Every channel is optional and fails soft — a notification
// problem must never lose the lead (it is already saved in the database).

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export async function notifyNewLead(lead) {
  const text =
    `New website lead\n` +
    `Name: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone || '-'}\n` +
    `Interested in: ${lead.interest || '-'}\nBudget: ${lead.budget || '-'}\nSource: ${lead.source || 'contact form'}\n\n${lead.message}`;

  const jobs = [];

  if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
    jobs.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.NOTIFY_FROM || 'Website <onboarding@resend.dev>',
          to: process.env.NOTIFY_EMAIL.split(',').map((s) => s.trim()),
          reply_to: lead.email,
          subject: `New lead: ${lead.name} (${lead.interest || 'general'})`,
          html: `<div style="font-family:system-ui,sans-serif;max-width:560px">
            <h2 style="margin:0 0 12px">New website lead</h2>
            <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
              <tr><td><b>Name</b></td><td>${esc(lead.name)}</td></tr>
              <tr><td><b>Email</b></td><td>${esc(lead.email)}</td></tr>
              <tr><td><b>Phone</b></td><td>${esc(lead.phone || '-')}</td></tr>
              <tr><td><b>Interest</b></td><td>${esc(lead.interest || '-')}</td></tr>
              <tr><td><b>Budget</b></td><td>${esc(lead.budget || '-')}</td></tr>
              <tr><td><b>Source</b></td><td>${esc(lead.source || 'contact form')}</td></tr>
            </table>
            <p style="white-space:pre-wrap;border-left:3px solid #f7b942;padding-left:12px">${esc(lead.message)}</p>
          </div>`,
        }),
      }).then((r) => { if (!r.ok) throw new Error(`Resend ${r.status}`); })
    );
  }

  if (process.env.NOTIFY_WEBHOOK_URL) {
    jobs.push(
      fetch(process.env.NOTIFY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // "text" works for Slack; "content" for Discord.
        body: JSON.stringify({ text, content: text }),
      }).then((r) => { if (!r.ok) throw new Error(`Webhook ${r.status}`); })
    );
  }

  const results = await Promise.allSettled(jobs);
  for (const r of results) if (r.status === 'rejected') console.error('Lead notification failed:', r.reason);
}
