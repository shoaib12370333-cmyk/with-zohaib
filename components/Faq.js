import Icon from './Icons';
import Reveal from './Reveal';

export default function Faq({ items = [] }) {
  return (
    <div className="max-w-[820px] mx-auto space-y-3">
      {items.map((f, i) => (
        <Reveal key={f.q} delay={i * 60}>
          <details className="card group" name="faq">
            <summary className="flex items-center justify-between gap-6 p-5 sm:p-6">
              <h3 className="font-display font-semibold text-[1.05rem] tracking-normal leading-snug">{f.q}</h3>
              <span className="plus w-9 h-9 flex-none rounded-full border border-edge/20 grid place-items-center">
                <Icon name="plus" className="w-4 h-4" />
              </span>
            </summary>
            <div className="faq-body">
              <div>
                <p className="px-5 sm:px-6 pb-6 text-muted leading-relaxed">{f.a}</p>
              </div>
            </div>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
