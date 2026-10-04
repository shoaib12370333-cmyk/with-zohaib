// Dependency-free RFC 6238 TOTP (Google Authenticator / Authy / 1Password compatible).
import { createHmac, randomBytes } from 'node:crypto';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateSecret(bytes = 20) {
  const buf = randomBytes(bytes);
  let bits = '';
  for (const b of buf) bits += b.toString(2).padStart(8, '0');
  let out = '';
  for (let i = 0; i + 5 <= bits.length; i += 5) out += ALPHABET[parseInt(bits.slice(i, i + 5), 2)];
  return out;
}

function base32Decode(str) {
  const clean = str.replace(/[\s=-]/g, '').toUpperCase();
  let bits = '';
  for (const ch of clean) {
    const v = ALPHABET.indexOf(ch);
    if (v === -1) throw new Error('Invalid base32 secret');
    bits += v.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}

function hotp(secret, counter) {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = createHmac('sha1', base32Decode(secret)).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code = ((hmac[offset] & 0x7f) << 24) | (hmac[offset + 1] << 16) | (hmac[offset + 2] << 8) | hmac[offset + 3];
  return String(code % 1_000_000).padStart(6, '0');
}

/** Accepts the current 30s window plus one either side to tolerate clock drift. */
export function verifyTotp(secret, token) {
  if (!secret || !/^\d{6}$/.test(String(token || '').trim())) return false;
  const counter = Math.floor(Date.now() / 30000);
  try {
    for (const drift of [-1, 0, 1]) {
      if (hotp(secret, counter + drift) === String(token).trim()) return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function otpAuthUri(secret, account = 'admin', issuer = 'E-Commerce With Zohaib') {
  const label = encodeURIComponent(`${issuer}:${account}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&period=30&digits=6`;
}
