import Link from 'next/link';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="relative min-h-screen grid place-items-center px-6 overflow-hidden noise">
      <div className="aurora"><i className="w-[40rem] h-[40rem] bg-gold/20 -top-60 left-1/4" /></div>
      <div className="relative text-center max-w-[520px]">
        <div className="font-display font-extrabold text-[8rem] leading-none grad-text">404</div>
        <h1 className="text-3xl mt-4">This page took a wrong turn.</h1>
        <p className="lead mt-4">The page you are looking for may have moved or no longer exists.</p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/services" className="btn btn-ghost">Browse services</Link>
        </div>
      </div>
    </main>
  );
}
