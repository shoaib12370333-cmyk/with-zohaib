import { ImageResponse } from 'next/og';
import { getContent } from '@/lib/db';

// Auto-generated 1200×630 share card (used by WhatsApp, LinkedIn, X, Facebook…)
// unless an explicit "Social share image" is uploaded in the admin.
export const alt = 'E-Commerce With Zohaib';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  const c = await getContent();
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: 72, color: '#f0f3fa', fontFamily: 'sans-serif',
          background: 'radial-gradient(900px 500px at 90% -10%, rgba(247,185,66,.35), transparent 60%), radial-gradient(800px 500px at -10% 110%, rgba(45,212,191,.28), transparent 60%), #060912',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: 'linear-gradient(135deg,#ffdd85,#f7b942)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1204', fontSize: 26, fontWeight: 800 }}>EZ</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 30, fontWeight: 700 }}>{c.brand.name}</span>
            <span style={{ fontSize: 16, letterSpacing: 6, color: '#f7b942' }}>{c.brand.sub}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
            Your growth partner for eBay, Amazon, Shopify &amp; TikTok Shop sellers.
          </div>
          <div style={{ fontSize: 28, color: '#9ca6bc' }}>Coaching · Store setup · Design · Development</div>
        </div>
      </div>
    ),
    size
  );
}
