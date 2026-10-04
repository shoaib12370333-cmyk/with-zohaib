'use client';
import { useEffect, useRef, useState } from 'react';

// Logo files usually carry a lot of empty margin (a square 2048px canvas with a small mark in the
// middle, a wide banner with transparent edges …), so "fit the image in the card" still leaves the
// actual logo tiny. This component finds where the logo's visible pixels really are, crops the
// empty margin away and scales the logo up to fill the card's inner box — sharp, because the scale
// comes from the original high-resolution file. The CARD size never changes.
//
// If the browser cannot read the pixels (no CORS headers, tiny/odd file) it falls back to plain
// "contain" sizing, exactly like before.

const cache = new Map(); // src → { nw, nh, x0, y0, x1, y1 } | null
const SAMPLE = 256; // analyse a downscaled copy — fast, plenty accurate for a bounding box

function measure(img) {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh) return null;
  const k = Math.min(1, SAMPLE / Math.max(nw, nh));
  const w = Math.max(1, Math.round(nw * k));
  const h = Math.max(1, Math.round(nh * k));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h); // throws if the canvas is tainted

  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const a = data[i + 3];
      // "empty" = transparent, or white/near-white (JPEG logos on a white square) — the card is white anyway
      if (a < 24 || (data[i] > 246 && data[i + 1] > 246 && data[i + 2] > 246)) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  if (x1 < x0 || y1 < y0) return null; // nothing visible
  const pad = 1; // keep a hair of margin so anti-aliased edges are not clipped
  return {
    nw,
    nh,
    x0: Math.max(0, x0 - pad) / k,
    y0: Math.max(0, y0 - pad) / k,
    x1: Math.min(w, x1 + 1 + pad) / k,
    y1: Math.min(h, y1 + 1 + pad) / k,
  };
}

export default function MarqueeLogo({ src, alt = '', boxW = 128, boxH = 54 }) {
  const [box, setBox] = useState(() => cache.get(src) ?? undefined);
  const [noCors, setNoCors] = useState(false);
  const ref = useRef(null);

  const analyse = (img) => {
    if (cache.has(src)) { setBox(cache.get(src)); return; }
    let b = null;
    try { b = measure(img); } catch { b = null; }
    cache.set(src, b);
    setBox(b);
  };

  // The image may already be complete before React attaches onLoad (cached / eager load).
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth && box === undefined && !noCors) analyse(img);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sizes: while unmeasured (or unmeasurable) the image simply fills the box with object-fit: contain.
  let wrap = { width: boxW, height: boxH };
  let imgStyle = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' };
  if (box) {
    const bw = box.x1 - box.x0;
    const bh = box.y1 - box.y0;
    // never magnify a file more than 2.5× its own pixels — beyond that it would look soft
    const s = Math.min(boxW / bw, boxH / bh, 2.5);
    wrap = { width: Math.round(bw * s), height: Math.round(bh * s) };
    imgStyle = {
      position: 'absolute',
      maxWidth: 'none',
      left: -box.x0 * s,
      top: -box.y0 * s,
      width: box.nw * s,
      height: box.nh * s,
    };
  }

  return (
    <span className="relative block flex-none overflow-hidden transition-transform duration-300 group-hover:scale-110" style={wrap}>
      {/* Eager on purpose: the marquee track is max-content wide, so a late logo must not move it.
          crossOrigin lets us read the pixels; if the host refuses, onError retries without it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={noCors ? 'plain' : 'cors'}
        ref={ref}
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        {...(noCors ? {} : { crossOrigin: 'anonymous' })}
        onLoad={(e) => { if (!noCors) analyse(e.currentTarget); }}
        onError={() => { if (!noCors) { setNoCors(true); cache.set(src, null); setBox(null); } }}
        style={imgStyle}
      />
    </span>
  );
}
