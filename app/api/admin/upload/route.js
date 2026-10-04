import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { randomBytes } from 'node:crypto';
import { sameOrigin } from '@/lib/auth';

// Identify the real file type from its first bytes — never trust the browser-supplied MIME type.
function sniff(buf) {
  const b = buf;
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { ext: 'png', type: 'image/png' };
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: 'jpg', type: 'image/jpeg' };
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return { ext: 'gif', type: 'image/gif' };
  if (b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP') return { ext: 'webp', type: 'image/webp' };
  if (b.slice(4, 12).toString().startsWith('ftypavif')) return { ext: 'avif', type: 'image/avif' };
  return null;
}

export async function POST(request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Image storage is not connected yet. Add Vercel Blob to this project, then redeploy.' }, { status: 500 });
    }
    const form = await request.formData();
    const file = form.get('file');
    if (!file || typeof file === 'string') return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'Image is larger than 8MB' }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());
    const kind = sniff(buf);
    if (!kind) return NextResponse.json({ error: 'Only PNG, JPG, WebP, GIF or AVIF images are allowed' }, { status: 400 });

    const name = `uploads/${Date.now()}-${randomBytes(4).toString('hex')}.${kind.ext}`;
    const blob = await put(name, buf, { access: 'public', contentType: kind.type, addRandomSuffix: false });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('Upload failed:', err);
    return NextResponse.json({ error: `Upload failed: ${err.message || 'unknown error'}` }, { status: 500 });
  }
}
