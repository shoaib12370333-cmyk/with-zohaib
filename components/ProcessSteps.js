import Reveal from './Reveal';

export default function ProcessSteps({ steps = [] }) {
  return (
    <ol className="relative grid gap-5 md:grid-cols-3">
      <div className="hidden md:block absolute left-[16%] right-[16%] top-[2.1rem] h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" aria-hidden="true" />
      {steps.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 120} className="relative">
          <div className="card spot p-7 h-full">
            <div className="relative z-10 w-[4.2rem] h-[4.2rem] -mt-1 rounded-2xl grid place-items-center bg-bg border border-gold/40 shadow-glow font-display font-extrabold text-2xl grad-text">
              {s.num}
            </div>
            <div className="mt-6 font-mono text-[.68rem] tracking-[.18em] uppercase text-gold">{s.label}</div>
            <h3 className="mt-2 text-[1.3rem]">{s.title}</h3>
            <p className="mt-3 text-muted leading-relaxed">{s.description}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
