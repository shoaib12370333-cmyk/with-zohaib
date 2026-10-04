import Reveal from './Reveal';

export function SectionHeading({ eyebrow, heading, lead, center = false, className = '' }) {
  return (
    <Reveal className={`max-w-[680px] mb-12 md:mb-16 ${center ? 'mx-auto text-center' : ''} ${className}`}>
      <span className={`eyebrow ${center ? 'justify-center' : ''}`}>{eyebrow}</span>
      <h2 className="h-section mt-4">{heading}</h2>
      {lead && <p className="lead mt-5">{lead}</p>}
    </Reveal>
  );
}

export function PageHeader({ eyebrow, title, lead, children, crumbs }) {
  return (
    <header className="relative pt-36 md:pt-44 pb-14 md:pb-20 overflow-hidden noise">
      <div className="aurora">
        <i className="w-[38rem] h-[38rem] bg-gold/20 -top-80 right-0" />
        <i className="w-[30rem] h-[30rem] bg-violet/15 -top-60 -left-40" style={{ animationDelay: '-9s' }} />
      </div>
      <div className="grid-bg" />
      <div className="wrap relative max-w-[1000px]">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-6 font-mono text-xs text-faint flex flex-wrap gap-2">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex gap-2">
                {c.href ? <a href={c.href} className="hover:text-fg">{c.label}</a> : <span className="text-muted">{c.label}</span>}
                {i < crumbs.length - 1 && <span aria-hidden="true">/</span>}
              </span>
            ))}
          </nav>
        )}
        <span className="eyebrow animate-rise">{eyebrow}</span>
        <h1 className="h-display page-title mt-5 animate-rise" style={{ animationDelay: '.1s' }}>{title}</h1>
        {lead && <p className="lead mt-6 max-w-[56ch] animate-rise" style={{ animationDelay: '.2s' }}>{lead}</p>}
        {children}
      </div>
    </header>
  );
}
