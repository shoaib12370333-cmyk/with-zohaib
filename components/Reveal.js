// Server-friendly scroll-reveal helpers. The animation itself is driven by the
// single global observer in <PointerEffects/>, so these add zero client JS.
//
//   <Reveal from="up|left|right|zoom|fade|clip|line" delay={120}>…</Reveal>
//   <Reveal stagger={90}>  children that carry data-reveal animate one after another
//   <Words as="h2" className="…">Headline text</Words>   word-by-word mask reveal

export default function Reveal({ children, className = '', as: Tag = 'div', delay = 0, from = 'up', stagger, style, ...rest }) {
  const st = delay ? { '--d': `${delay}ms`, ...style } : style;
  return (
    <Tag
      {...(from === 'none' ? {} : { 'data-reveal': from === 'up' ? '' : from })}
      {...(stagger ? { 'data-stagger': String(stagger) } : {})}
      style={st}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Splits a string into masked words that slide up when scrolled into view. */
export function Words({ children, as: Tag = 'span', className = '', delay = 0, style, ...rest }) {
  const text = typeof children === 'string' ? children : String(children ?? '');
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag data-reveal="words" aria-label={text} style={delay ? { '--d': `${delay}ms`, ...style } : style} className={className} {...rest}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="w"><span style={{ '--i': i }}>{w}</span></span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
