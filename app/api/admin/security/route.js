import { NextResponse } from 'next/server';
import { generateSecret, otpAuthUri, verifyTotp } from '@/lib/totp';

// Helper for enabling 2FA: hands out a fresh secret and lets the admin confirm
// their authenticator app produces valid codes *before* putting it in the env.
export async function GET() {
  const secret = generateSecret();
  return NextResponse.json({ secret, uri: otpAuthUri(secret), enabled: !!process.env.ADMIN_TOTP_SECRET });
}

export async function POST(request) {
  const { secret, code } = await request.json();
  return NextResponse.json({ valid: verifyTotp(String(secret || ''), String(code || '')) });
}
