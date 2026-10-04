'use client';

export default function GlobalError({ error, reset }) {
  return (
    <main className="min-h-screen grid place-items-center px-6">
      <div className="text-center max-w-[480px]">
        <h1 className="text-3xl">Something went wrong.</h1>
        <p className="lead mt-4">An unexpected error occurred. Please try again — if it keeps happening, message us on WhatsApp.</p>
        {error?.digest && <p className="mt-3 font-mono text-xs text-faint">Ref: {error.digest}</p>}
        <button onClick={reset} className="btn btn-primary mt-8">Try again</button>
      </div>
    </main>
  );
}
