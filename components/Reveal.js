// Server-friendly scroll-reveal wrapper. The actual animation is driven by the
// single global observer in <PointerEffects/>, so this adds zero client JS.
export default function Reveal({ children, className = '', as: Tag = 'div', delay = 0, from = 'up', ...rest }) {
  return (
    <Tag
      data-reveal={from === 'up' ? '' : from}
      style={delay ? { '--d': `${delay}ms` } : undefined}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}
