import Reveal from './Reveal';

export default function ProcessSteps({ steps }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {(steps || []).map((step, i) => (
        <Reveal key={i} delay={i * 80}>
          <div className="relative pt-6">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-line" />
            <span className="font-mono-eyebrow text-[.75rem] text-gold tracking-[.1em]">{step.num}</span>
            <h3 className="text-[1.3rem] mt-[.6rem] mb-[.5rem]">{step.title}</h3>
            <p className="text-slateSoft text-[.96rem]">{step.description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
