import Icon from './Icons';
import Reveal from './Reveal';

export default function Testimonials({ items = [] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((t, i) => (
        <Reveal key={`${t.name}-${i}`} delay={i * 100}>
          <figure className="card spot h-full p-7 flex flex-col">
            <div className="flex gap-0.5 text-gold" aria-label="5 out of 5 stars">
              {[...Array(5)].map((_, k) => <Icon key={k} name="star" className="w-4 h-4" />)}
            </div>
            <blockquote className="mt-5 text-[1.02rem] leading-relaxed flex-1">“{t.quote}”</blockquote>
            <figcaption className="mt-6 flex items-center gap-3 pt-5 border-t border-edge/10">
              <span className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-rose grid place-items-center font-display font-bold text-[#1a1204]">
                {(t.name || '?').trim().charAt(0)}
              </span>
              <span>
                <span className="block font-display font-bold text-sm">{t.name}</span>
                <span className="block font-mono text-[.68rem] text-muted">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
