'use client';
import { useState } from 'react';
import Icon from './Icons';

export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked */ }
  };
  const nativeShare = () => (navigator.share ? navigator.share({ title, url }).catch(() => {}) : copy());

  const btn = 'w-10 h-10 rounded-full border border-edge/15 grid place-items-center text-muted hover:text-gold hover:border-gold/60 transition-all hover:-translate-y-0.5';
  return (
    <div>
      <div className="font-mono text-[.66rem] tracking-[.18em] uppercase text-faint mb-3">Share</div>
      <div className="flex gap-2">
        <a className={btn} aria-label="Share on WhatsApp" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${enc(`${title} ${url}`)}`}><Icon name="whatsapp" className="w-[18px] h-[18px]" /></a>
        <a className={btn} aria-label="Share on LinkedIn" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`}><Icon name="linkedin" className="w-[18px] h-[18px]" /></a>
        <a className={btn} aria-label="Share on Facebook" target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`}><Icon name="fb" className="w-[18px] h-[18px]" /></a>
        <button className={btn} onClick={nativeShare} aria-label={copied ? 'Link copied' : 'Copy link'}>
          <Icon name={copied ? 'check' : 'external'} className="w-[18px] h-[18px]" />
        </button>
      </div>
      <span className="sr-only" aria-live="polite">{copied ? 'Link copied' : ''}</span>
    </div>
  );
}
