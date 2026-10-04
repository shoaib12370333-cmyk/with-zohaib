import Link from 'next/link';
import Icon from './Icons';
import Reveal from './Reveal';

const LEVERS = [
  { n: '01', label: 'Traffic', note: 'Are the right people finding you?', icon: 'globe', color: 'text-teal' },
  { n: '02', label: 'Conversion', note: 'Does the listing convince them?', icon: 'target', color: 'text-gold' },
  { n: '03', label: 'Offer', note: 'Is price & product a real fit?', icon: 'layers', color: 'text-violet' },
];

export default function FeatureBlock({ data }) {
  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <Reveal from="left">
        <span className="eyebrow">{data.eyebrow}</span>
        <h2 className="h-section mt-4">{data.title}</h2>
        <p className="lead mt-6">{data.description}</p>
        <ul className="mt-8 grid sm:grid-cols-2 gap-3">
          {(data.bullets || []).map((b) => (
            <li key={b} className="flex items-start gap-3 text-[.97rem]">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-teal/15 text-teal grid place-items-center flex-none"><Icon name="check" className="w-3 h-3" /></span>
              {b}
            </li>
          ))}
        </ul>
        <Link href="/contact" className="btn btn-primary mt-9">{data.ctaLabel} <Icon name="arrow" className="w-4 h-4" /></Link>
      </Reveal>

      <Reveal from="right" className="relative">
        <div className="absolute -inset-6 bg-gradient-to-br from-gold/15 via-transparent to-teal/15 blur-3xl rounded-[3rem]" aria-hidden="true" />
        <div className="relative card p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <span className="font-mono text-[.7rem] tracking-[.18em] uppercase text-faint">The 3-lever diagnosis</span>
            <span className="chip"><i className="w-1.5 h-1.5 rounded-full bg-gold" /> start here</span>
          </div>
          <div className="space-y-3">
            {LEVERS.map((l) => (
              <div key={l.n} className="flex items-center gap-4 rounded-2xl border border-edge/10 bg-bg2/60 p-4 hover:border-gold/30 transition-colors">
                <span className={`w-11 h-11 rounded-xl bg-edge/[.05] grid place-items-center ${l.color}`}><Icon name={l.icon} className="w-5 h-5" /></span>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold">{l.label}</div>
                  <div className="text-sm text-muted truncate">{l.note}</div>
                </div>
                <span className="font-mono text-xs text-faint">{l.n}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted leading-relaxed">We find the weakest lever first — then fix only that, so every change is measurable.</p>
        </div>
      </Reveal>
    </div>
  );
}
