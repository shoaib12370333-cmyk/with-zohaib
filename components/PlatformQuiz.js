'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from './Icons';

// Lightweight lead-qualifier: 3 questions → platform + service suggestion.
// No claims about results — it only routes people to the right conversation.

const QUESTIONS = [
  {
    q: 'Where are you right now?',
    options: [
      { label: "I haven't started selling yet", tag: 'new', service: 'Marketplace Store Setup' },
      { label: 'I sell already but sales are stuck', tag: 'stuck', service: 'Growth & Scaling' },
      { label: 'I sell steadily and want to scale', tag: 'scale', service: '1-on-1 Coaching' },
    ],
  },
  {
    q: 'What kind of product do you have?',
    options: [
      { label: 'My own brand or a unique product', p: { Shopify: 3, Amazon: 1 } },
      { label: 'Everyday products people search for', p: { Amazon: 3, eBay: 2 } },
      { label: 'Visual, trend or impulse-buy items', p: { 'TikTok Shop': 3, Shopify: 1 } },
      { label: "I'm still deciding", p: { eBay: 2, Amazon: 1, Shopify: 1 } },
    ],
  },
  {
    q: 'What matters most to you?',
    options: [
      { label: 'Test fast with a small budget', p: { eBay: 3, 'TikTok Shop': 1 } },
      { label: 'Build a brand I fully own', p: { Shopify: 3 } },
      { label: 'Reach the biggest ready-to-buy audience', p: { Amazon: 3, eBay: 1 } },
      { label: "I'm comfortable making video content", p: { 'TikTok Shop': 3, Shopify: 1 } },
    ],
  },
];

const WHY = {
  eBay: 'Lower setup effort and quick market feedback make it a practical place to test products.',
  Amazon: 'Large, search-driven demand — rewards polished listings and solid operations.',
  Shopify: 'You own the brand and the customer relationship, and drive your own traffic.',
  'TikTok Shop': 'Discovery happens through content, which suits visual, impulse-friendly products.',
};

// Steps slide in from the side you are travelling towards (--dx), options follow
// one after another. `backwards` fill keeps hover transforms working afterwards.
// Reduced motion is flattened globally in globals.css.
const KEYFRAMES =
  '@keyframes qzIn{from{opacity:0;transform:translate3d(var(--dx,28px),0,0)}}' +
  '.qz-in{animation:qzIn .55s var(--ease) backwards}';

const CONFIRM_MS = 280; // how long the chosen option stays highlighted before the next step

export default function PlatformQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [dir, setDir] = useState(1); // 1 = moving forward, -1 = going back
  const [picked, setPicked] = useState(null); // label of the option being confirmed
  const timer = useRef(0);
  const heading = useRef(null);
  const shownStep = useRef(0);

  const done = step >= QUESTIONS.length;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // After a step change, move keyboard / screen-reader focus to the new heading
  // (the button that was just pressed has been unmounted). Never on first render.
  useEffect(() => {
    if (shownStep.current === step) return;
    shownStep.current = step;
    heading.current?.focus({ preventScroll: true });
  }, [step]);

  const pick = (opt) => {
    if (picked) return;
    const advance = () => {
      setDir(1);
      setAnswers((a) => [...a, opt]);
      setStep((s) => s + 1);
      setPicked(null);
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { advance(); return; }
    setPicked(opt.label);
    timer.current = window.setTimeout(advance, CONFIRM_MS);
  };
  const back = () => {
    if (picked) return;
    setDir(-1);
    setAnswers((a) => a.slice(0, -1));
    setStep((s) => s - 1);
  };
  const reset = () => { setDir(-1); setAnswers([]); setStep(0); };

  let result = null;
  if (done) {
    const score = {};
    for (const a of answers) for (const [k, v] of Object.entries(a.p || {})) score[k] = (score[k] || 0) + v;
    const ranked = Object.entries(score).sort((a, b) => b[1] - a[1]);
    result = { platform: ranked[0]?.[0] || 'eBay', alt: ranked[1]?.[0], service: answers[0]?.service };
  }

  return (
    <div id="quiz" className="relative mx-auto max-w-[860px] overflow-hidden rounded-[20px] border border-edge/10 bg-surface p-6 shadow-card sm:p-10">
      <style>{KEYFRAMES}</style>
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-gold via-gold2 to-teal" />

      <div className="mb-8 flex items-center justify-between gap-4">
        {/* each segment fills like a progress bar as you answer */}
        <div className="flex gap-1.5" aria-hidden="true">
          {QUESTIONS.map((_, i) => {
            const fill = i < step ? 1 : i === step && !done ? (picked ? 0.75 : 0.3) : 0;
            return (
              <span key={i} className="h-1.5 w-10 overflow-hidden rounded-full bg-edge/10">
                <span
                  className="block h-full origin-left rounded-full bg-gold transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)]"
                  style={{ transform: `scaleX(${fill})` }}
                />
              </span>
            );
          })}
        </div>
        <span className="font-mono text-xs text-muted">{done ? 'Your match' : `Question ${step + 1} of ${QUESTIONS.length}`}</span>
      </div>

      <div key={step} className="min-h-[18rem]" style={{ '--dx': `${dir * 28}px` }}>
        {!done ? (
          <>
            <h3 ref={heading} tabIndex={-1} className="qz-in text-[1.6rem] outline-none sm:text-[2rem]">{QUESTIONS[step].q}</h3>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {QUESTIONS[step].options.map((o, i) => {
                const chosen = picked === o.label;
                return (
                  <button
                    key={o.label}
                    type="button"
                    onClick={() => pick(o)}
                    style={{ animationDelay: `${120 + i * 70}ms` }}
                    className={`qz-in group flex items-center justify-between gap-4 rounded-xl border-[1.5px] p-5 text-left transition duration-300 active:scale-[.985] ${
                      chosen
                        ? 'border-gold bg-gold text-ink shadow-card'
                        : `border-edge/15 bg-surface hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10 hover:shadow-card ${picked ? 'opacity-50' : ''}`
                    }`}
                  >
                    <span className="font-display font-medium">{o.label}</span>
                    <Icon
                      name={chosen ? 'check' : 'arrow'}
                      className={`h-4 w-4 flex-none transition duration-300 ${chosen ? 'scale-110' : 'text-faint group-hover:translate-x-1 group-hover:text-gold'}`}
                    />
                  </button>
                );
              })}
            </div>
            {step > 0 && (
              <button type="button" onClick={back} className="link-u mt-6 text-sm text-muted hover:text-fg">← Back</button>
            )}
          </>
        ) : (
          <div className="dz relative overflow-hidden rounded-2xl p-5 sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-[20%] -top-[40%] h-[110%] w-[70%] rounded-full"
              style={{ background: 'radial-gradient(closest-side, rgba(226,166,61,.22), transparent 70%)', animation: 'glowDriftA 14s ease-in-out infinite' }}
            />
            <div className="relative">
              <span className="chip border-gold/40 text-gold"><Icon name="spark" className="h-3.5 w-3.5" /> Suggested starting point</span>
              <h3 ref={heading} tabIndex={-1} className="mt-5 text-[2rem] outline-none sm:text-[2.8rem]">
                Start with{' '}
                <span className="pop-in inline-block" style={{ animationDelay: '180ms' }}>
                  <span className="grad-text">{result.platform}</span>
                </span>
              </h3>
              <p className="lead qz-in mt-4 max-w-[52ch]" style={{ animationDelay: '260ms' }}>{WHY[result.platform]}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="qz-in rounded-xl border border-edge/10 bg-bg2 p-4" style={{ animationDelay: '340ms' }}>
                  <div className="font-mono text-[.64rem] uppercase tracking-[.14em] text-faint">Best-fit service</div>
                  <div className="mt-1 font-display font-bold">{result.service}</div>
                </div>
                {result.alt && (
                  <div className="qz-in rounded-xl border border-edge/10 bg-bg2 p-4" style={{ animationDelay: '420ms' }}>
                    <div className="font-mono text-[.64rem] uppercase tracking-[.14em] text-faint">Worth comparing</div>
                    <div className="mt-1 font-display font-bold">{result.alt}</div>
                  </div>
                )}
              </div>
              <p className="qz-in mt-5 text-xs text-faint" style={{ animationDelay: '500ms' }}>A quick guide, not a guarantee — we'll confirm the right choice with you on a free call.</p>
              <div className="qz-in mt-7 flex flex-wrap gap-3" style={{ animationDelay: '560ms' }}>
                {/* label may wrap on narrow phones; the arrow must never be squeezed out */}
                <Link href={`/contact?interest=${encodeURIComponent(result.platform)}&from=quiz`} className="btn btn-primary whitespace-normal px-6 text-center sm:whitespace-nowrap sm:px-8">
                  Talk it through — free call <Icon name="arrow" className="h-4 w-4 flex-none" />
                </Link>
                <button type="button" onClick={reset} className="btn btn-ghost">Retake quiz</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
