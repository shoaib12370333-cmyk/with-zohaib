import Icon from './Icons';
import Reveal from './Reveal';

export default function Testimonials({ items }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {(items || []).map((t, i) => (
        <Reveal key={i} delay={i * 70}>
          <div className="bg-paper rounded-2xl p-6 h-full">
            <div className="flex gap-[3px] text-gold mb-4">
              {[...Array(5)].map((_, s) => (
                <Icon key={s} name="star" className="w-[15px] h-[15px]" />
              ))}
            </div>
            <p className="text-[1.02rem] text-ink">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-[.7rem] mt-5">
              <div className="w-[38px] h-[38px] rounded-full bg-ink text-gold flex items-center justify-center font-display font-bold text-[.85rem] flex-none">
                {t.name?.[0]}
              </div>
              <div>
                <div className="font-display font-bold text-[.92rem]">{t.name}</div>
                <div className="font-mono-eyebrow text-[.72rem] text-slateSoft">{t.role}</div>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
