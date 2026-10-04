'use client';
import { useEffect, useRef, useState } from 'react';
import Icon from './Icons';

// Round ink buttons that spring up and turn teal on hover (same family as the contact /
// footer social buttons). Copying the link flips the last button to a popping teal tick.
const BTN =
  'grid h-10 w-10 place-items-center rounded-full bg-ink text-white transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-1 hover:scale-105 hover:bg-teal hover:shadow-[0_10px_22px_-8px_rgba(29,148,136,.65)]';

export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);
  // Web Share support is only known in the browser, so detect it after mount (keeps SSR
  // markup identical on first render). It decides what the last button really does.
  const [canShare, setCanShare] = useState(false);
  const timer = useRef(0);
  const enc = encodeURIComponent;

  useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
    return () => clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked */ }
  };
  const nativeShare = () => (canShare ? navigator.share({ title, url }).catch(() => {}) : copy());

  return (
    <div>
      <div className="mb-3 font-mono text-[.66rem] uppercase tracking-[.18em] text-faint">Share</div>
      <div className="flex flex-wrap items-center gap-2">
        <a className={BTN} aria-label="Share on WhatsApp" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${enc(`${title} ${url}`)}`}><Icon name="whatsapp" className="h-[18px] w-[18px]" /></a>
        <a className={BTN} aria-label="Share on LinkedIn" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`}><Icon name="linkedin" className="h-[18px] w-[18px]" /></a>
        <a className={BTN} aria-label="Share on Facebook" target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`}><Icon name="fb" className="h-[18px] w-[18px]" /></a>
        <button type="button" className={`${BTN} ${copied ? '!bg-teal' : ''}`} onClick={nativeShare} aria-label={copied ? 'Link copied' : canShare ? 'Share…' : 'Copy link'}>
          {/* keyed so the tick pops each time it appears */}
          <span key={copied ? 'ok' : 'cp'} className={`grid place-items-center ${copied ? 'pop-in' : ''}`}>
            <Icon name={copied ? 'check' : 'external'} className="h-[18px] w-[18px]" />
          </span>
        </button>
        {copied && <span className="fade-up font-mono text-[.7rem] text-tealDeep" aria-hidden="true">Copied</span>}
      </div>
      <span className="sr-only" aria-live="polite">{copied ? 'Link copied' : ''}</span>
    </div>
  );
}
