'use client';
import { useEffect, useState } from 'react';
import Icon from '@/components/Icons';
import { Card } from '@/components/admin/Fields';

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div className="text-xs font-semibold text-muted mb-1.5">{label}</div>
      <div className="flex gap-2">
        <input readOnly value={value} className="adm-input font-mono !text-[.8rem]" onFocus={(e) => e.target.select()} />
        <button className="btn btn-ghost btn-sm" onClick={async () => { try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* blocked */ } }}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

export default function SecurityPage() {
  const [info, setInfo] = useState(null);
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => { fetch('/api/admin/security').then((r) => r.json()).then(setInfo).catch(() => {}); }, []);

  async function verify(e) {
    e.preventDefault();
    const res = await fetch('/api/admin/security', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secret: info.secret, code }) });
    setResult((await res.json()).valid);
  }

  return (
    <div className="space-y-6 max-w-[760px]">
      <div>
        <h1 className="text-2xl">Security</h1>
        <p className="text-sm text-muted mt-1">Protect the admin panel with a second factor and follow best practice.</p>
      </div>

      <Card title="Two-factor authentication (2FA)" subtitle={info?.enabled ? 'Enabled — logins require a 6-digit code.' : 'Not enabled yet — optional but strongly recommended.'}>
        {info?.enabled && <p className="mb-5 chip text-teal border-teal/30 w-fit"><Icon name="shield" className="w-3.5 h-3.5" /> 2FA is active</p>}
        <ol className="space-y-5 text-sm">
          <li>
            <b>1. Add this key to an authenticator app</b> (Google Authenticator, Authy, 1Password…) → “Enter a setup key” → time-based.
            {info ? (
              <div className="mt-3 space-y-3">
                <CopyField label="Setup key" value={info.secret} />
                <CopyField label="Or paste this URI (apps that support it)" value={info.uri} />
              </div>
            ) : <p className="mt-2 text-faint">Generating…</p>}
          </li>
          <li>
            <b>2. Confirm it works</b> — enter the current 6-digit code your app shows.
            <form onSubmit={verify} className="mt-3 flex gap-2 items-center">
              <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="123456" className="adm-input !w-36 font-mono text-center tracking-[.3em]" aria-label="6-digit code" />
              <button className="btn btn-ghost btn-sm" disabled={code.length !== 6}>Verify</button>
              {result === true && <span className="text-teal text-sm">✓ Valid</span>}
              {result === false && <span className="text-rose text-sm">Invalid — check the key or your clock</span>}
            </form>
          </li>
          <li>
            <b>3. Save it on the server</b> — add an environment variable named <code className="font-mono">ADMIN_TOTP_SECRET</code> with the setup key above (Vercel → Settings → Environment Variables), then redeploy.
            <p className="text-faint mt-1">The key is never stored by the site. Lost your device? Remove the variable and redeploy to turn 2FA off.</p>
          </li>
        </ol>
      </Card>

      <Card title="Already protecting you">
        <ul className="space-y-2.5 text-sm text-muted">
          {[
            'Login rate-limit: 8 attempts / 15 min per visitor',
            'Constant-time password comparison, strict same-site session cookie (14-day expiry)',
            'Cross-site request checks on every admin action',
            'Uploads verified by real file signature (no SVG/script uploads), 8 MB cap',
            'Contact form: honeypot, rate-limit (5 / 10 min) and server-side validation',
            'Security headers (HSTS, frame, referrer, permissions) and admin pages never cached or indexed',
          ].map((t) => <li key={t} className="flex gap-3"><Icon name="check" className="w-4 h-4 mt-0.5 text-teal flex-none" />{t}</li>)}
        </ul>
      </Card>
    </div>
  );
}
