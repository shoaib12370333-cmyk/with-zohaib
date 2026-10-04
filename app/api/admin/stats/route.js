import { NextResponse } from 'next/server';
import { getStats } from '@/lib/db';

export async function GET() {
  try {
    return NextResponse.json({
      ...(await getStats()),
      env: {
        database: !!process.env.DATABASE_URL,
        blob: !!process.env.BLOB_READ_WRITE_TOKEN,
        session: !!process.env.SESSION_SECRET,
        totp: !!process.env.ADMIN_TOTP_SECRET,
        email: !!(process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL),
        webhook: !!process.env.NOTIFY_WEBHOOK_URL,
        siteUrl: !!process.env.SITE_URL,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
