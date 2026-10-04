import CountUp from './CountUp';
import Reveal from './Reveal';

export default function StatsBand({ stats = [] }) {
  return (
    <section className="relative py-16 md:py-20 border-y border-edge/10 overflow-hidden noise">
      <div className="aurora"><i className="w-[40rem] h-[20rem] bg-gold/15 top-0 left-1/4" /></div>
      <div className="wrap relative grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 90} className="text-center lg:text-left lg:pl-6 lg:border-l border-edge/15 first:border-0">
            <div className="font-display font-extrabold text-[clamp(2.4rem,1.6rem+3vw,4rem)] leading-none grad-text">
              <CountUp to={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-3 text-sm text-muted max-w-[18ch] mx-auto lg:mx-0">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
