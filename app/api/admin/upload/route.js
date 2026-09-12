import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'Image storage is not connected yet. Add Vercel Blob to this project, then redeploy.' },
        { status: 500 }
      );
    }

    const form = await request.formData();
    const file = form.get('file');
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!file.type?.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image is larger than 8MB' }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    const blob = await put(filename, file, { access: 'public' });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('Upload failed:', err);
    return NextResponse.json(
      { error: `Upload failed: ${err.message || 'unknown error'}. Double check Vercel Blob is connected and you redeployed after connecting it.` },
      { status: 500 }
    );
  }
}
