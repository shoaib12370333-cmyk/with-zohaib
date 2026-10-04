import Reveal from './Reveal';
import { POP_IN } from './SectionHeading';

// Steps saved by older versions of the admin keep the number and the label in ONE field
// ("01 / STRATEGY CALL"); the current content has a separate short `num` and `label`.
// Accept both: a short number goes in the round node, any words become the small label.
function splitStep(s, i) {
  const raw = String(s.num ?? '').trim();
  let num = raw;
  let label = String(s.label ?? '').trim();
  const m = /^(\d{1,2})\s*[/\-–—:.]\s*(.+)$/.exec(raw);
  if (m) {
    num = m[1];
    if (!label) label = m[2].trim();
  } else if (!/^\d{1,2}$/.test(raw)) {
    if (!label) label = raw; // free text → label
    num = '';
  }
  return { num: num || String(i + 1).padStart(2, '0'), label };
}

// Original layout: three plain columns with a line on top, a number, title and
// description. Motion: the line becomes a gold progress bar that DRAWS across as
// each step lands (a little later per column, so it reads as one wave left →
// right), the numbered node pops onto it with a spring, and hovering a step
// tilts its node. Plain columns work on both white and paper sections.
export default function ProcessSteps({ steps = [] }) {
  return (
    <ol className="grid gap-x-6 gap-y-10 md:grid-cols-3">
      {steps.map((raw, i) => {
        const s = { ...raw, ...splitStep(raw, i) };
        return (
          <Reveal as="li" key={s.title} delay={i * 120} className="group relative">
            {/* track = grey line; the gold fill draws via .rule (shows fully when JS is off) */}
            <div
              className="rule [html:not(.js)_&]:after:scale-x-100"
              style={{ '--d': `${200 + i * 220}ms` }}
              aria-hidden="true"
            />

            {/* numbered node sitting on the line */}
            <span className={`relative -mt-[1.2rem] mb-5 block w-fit ${POP_IN}`} style={{ transitionDelay: `${380 + i * 220}ms` }}>
              <span className="grid h-10 w-10 place-items-center whitespace-nowrap rounded-full bg-gold font-mono text-[.8rem] font-semibold text-ink shadow-[0_8px_20px_-8px_rgba(226,166,61,.9)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                {s.num}
              </span>
            </span>

            {s.label && <div className="font-mono text-[.68rem] uppercase tracking-[.18em] text-tealDeep">{s.label}</div>}
            <h3 className="mt-2 text-[1.3rem]">{s.title}</h3>
            <p className="mt-2.5 text-[.96rem] text-muted">{s.description}</p>
          </Reveal>
        );
      })}
    </ol>
  );
}
