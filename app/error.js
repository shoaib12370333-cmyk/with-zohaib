'use client';

// Runs under the root layout (outside the public .classic wrapper), so it carries its own
// ink-navy "dark zone" with the original hero glows. Entrance motion is CSS-only (fade-up /
// pop-in) and is switched off for reduced motion.
export default function GlobalError({ error, reset }) {
  return (
    <main id="main" className="dz relative grid min-h-screen place-items-center overflow-hidden px-6 py-16">
      <div className="glow-hero" aria-hidden="true" />

      <div className="relative max-w-[500px] text-center">
        <span className="pop-in mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/40 bg-gold/10 font-display text-2xl font-extrabold text-gold" aria-hidden="true">!</span>
        <span className="eyebrow fade-up mt-6" style={{ '--d': '100ms' }}>Unexpected error</span>
        <h1 className="fade-up mt-3 text-3xl sm:text-4xl" style={{ '--d': '180ms' }}>Something went wrong.</h1>
        <p className="lead fade-up mt-4" style={{ '--d': '300ms' }}>An unexpected error occurred. Please try again — if it keeps happening, message us on WhatsApp.</p>
        {error?.digest && <p className="fade-up mt-3 font-mono text-xs text-faint" style={{ '--d': '380ms' }}>Ref: {error.digest}</p>}

        <div className="fade-up mt-8 flex flex-wrap justify-center gap-3" style={{ '--d': '460ms' }}>
          <button type="button" onClick={reset} className="btn btn-primary">Try again</button>
          {/* plain link: a full navigation also clears the error state when the failure happened on "/" itself */}
          <a href="/" className="btn btn-ghost">Back to home</a>
        </div>
      </div>
    </main>
  );
}
