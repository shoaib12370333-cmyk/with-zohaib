import CountUp from './CountUp';
import Reveal from './Reveal';

// The original dark ink band — big gold mono numbers on navy — now with motion:
// columns stagger up, each number counts up (easeOutExpo) and a short gold rule
// draws beneath it. A very soft glow drifts behind everything.
export default function StatsBand({ stats = [] }) {
  return (
    <section className="dz bg-bg relative overflow-hidden">
      {/* drifting gold / teal glow, dialled right down so it only ever whispers */}
      <div className="glow-hero opacity-50" aria-hidden="true" />

      {/* from="none": the grid itself stays put, only its columns reveal (stagger) */}
      <Reveal from="none" stagger={100} className="wrap relative grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-4 md:py-16">
        {(stats || []).map((s, i) => (
          <Reveal key={`${s.label}-${i}`} className="px-1 text-center md:px-3">
            {/* sizes are stepped so a 6-char value like "3-step" fits its column (2-up on phones, 4-up from md) without wrapping */}
            <div className="font-mono text-[2rem] font-semibold leading-none text-gold min-[400px]:text-[2.3rem] sm:text-[2.8rem] md:text-[2.2rem] lg:text-[3rem] xl:text-[3.5rem]">
              <CountUp to={s.value} suffix={s.suffix} delay={i * 100 + 250} />
            </div>
            {/* gold rule: draws left → right once the column is revealed, after the number lands */}
            <div className="rule mx-auto mt-4 w-10" style={{ '--d': `${i * 100 + 500}ms` }} aria-hidden="true" />
            <span className="mt-3 block text-[.85rem] text-muted">{s.label}</span>
          </Reveal>
        ))}
      </Reveal>
    </section>
  );
}
