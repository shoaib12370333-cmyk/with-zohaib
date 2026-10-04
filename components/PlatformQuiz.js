'use client';
import { useState } from 'react';
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

export default function PlatformQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const done = step >= QUESTIONS.length;

  const pick = (opt) => {
    setAnswers((a) => [...a, opt]);
    setStep((s) => s + 1);
  };
  const reset = () => { setAnswers([]); setStep(0); };

  let result = null;
  if (done) {
    const score = {};
    for (const a of answers) for (const [k, v] of Object.entries(a.p || {})) score[k] = (score[k] || 0) + v;
    const ranked = Object.entries(score).sort((a, b) => b[1] - a[1]);
    result = { platform: ranked[0]?.[0] || 'eBay', alt: ranked[1]?.[0], service: answers[0]?.service };
  }

  return (
    <div id="quiz" className="card relative overflow-hidden p-6 sm:p-10 max-w-[860px] mx-auto">
      <div className="aurora"><i className="w-72 h-72 bg-gold/20 -top-24 -right-16" /></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-1.5" aria-hidden="true">
            {QUESTIONS.map((_, i) => (
              <span key={i} className={`h-1.5 w-10 rounded-full transition-all duration-500 ${i < step ? 'bg-gold' : i === step && !done ? 'bg-gold/50' : 'bg-edge/15'}`} />
            ))}
          </div>
          <span className="font-mono text-xs text-faint">{done ? 'Your match' : `Question ${step + 1} of ${QUESTIONS.length}`}</span>
        </div>

        {!done ? (
          <div key={step} className="animate-rise">
            <h3 className="text-[1.6rem] sm:text-[2rem]">{QUESTIONS[step].q}</h3>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {QUESTIONS[step].options.map((o) => (
                <button
                  key={o.label}
                  onClick={() => pick(o)}
                  className="group text-left rounded-2xl border border-edge/12 bg-bg2/50 hover:border-gold/60 hover:bg-gold/[.07] p-5 transition-all hover:-translate-y-0.5 flex items-center justify-between gap-4"
                >
                  <span className="font-display font-medium">{o.label}</span>
                  <Icon name="arrow" className="w-4 h-4 flex-none text-faint group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
            {step > 0 && (
              <button onClick={() => { setAnswers((a) => a.slice(0, -1)); setStep((s) => s - 1); }} className="mt-6 text-sm text-muted hover:text-fg">← Back</button>
            )}
          </div>
        ) : (
          <div className="animate-rise">
            <span className="chip border-gold/30 text-gold"><Icon name="spark" className="w-3.5 h-3.5" /> Suggested starting point</span>
            <h3 className="mt-5 text-[2rem] sm:text-[2.6rem]">
              Start with <span className="grad-text">{result.platform}</span>
            </h3>
            <p className="lead mt-4 max-w-[52ch]">{WHY[result.platform]}</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-edge/10 bg-bg2/50 p-4">
                <div className="font-mono text-[.64rem] tracking-[.14em] uppercase text-faint">Best-fit service</div>
                <div className="mt-1 font-display font-bold">{result.service}</div>
              </div>
              {result.alt && (
                <div className="rounded-2xl border border-edge/10 bg-bg2/50 p-4">
                  <div className="font-mono text-[.64rem] tracking-[.14em] uppercase text-faint">Worth comparing</div>
                  <div className="mt-1 font-display font-bold">{result.alt}</div>
                </div>
              )}
            </div>
            <p className="mt-5 text-xs text-faint">A quick guide, not a guarantee — we'll confirm the right choice with you on a free call.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/contact?interest=${encodeURIComponent(result.platform)}&from=quiz`} className="btn btn-primary">
                Talk it through — free call <Icon name="arrow" className="w-4 h-4" />
              </Link>
              <button onClick={reset} className="btn btn-ghost">Retake quiz</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
