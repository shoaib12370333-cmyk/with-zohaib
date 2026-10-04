import { getContent } from '@/lib/db';
import { PageHeader } from '@/components/SectionHeading';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How we collect, use and protect the information you share with us.',
  alternates: { canonical: '/privacy' },
};

export default async function PrivacyPage() {
  const c = await getContent();
  const name = `${c.brand.name} ${c.brand.sub}`.trim();
  return (
    <main id="main">
      <PageHeader eyebrow="Legal" title="Privacy Policy" lead="A plain-language summary of what we collect and why." crumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy' }]} />
      <section className="section pt-4">
        <div className="wrap max-w-[820px] prose-x">
          <p><strong>Last updated:</strong> {new Date().getFullYear()}</p>

          <h2>What we collect</h2>
          <p>
            When you use the contact form we store the details you enter — your name, email address, optional phone number,
            the service you are interested in, an optional budget range and your message. We do not collect any other personal
            information through this website.
          </p>

          <h2>How we use it</h2>
          <p>
            We use this information only to reply to your enquiry and to follow up about the services you asked about.
            We do not sell your information or share it with advertisers.
          </p>

          <h2>Analytics &amp; cookies</h2>
          <p>
            We use privacy-friendly, cookie-less analytics to understand which pages are visited. Your light/dark theme choice
            is stored in your browser so the site remembers it. The admin area uses a strictly necessary sign-in cookie that is
            only set for site administrators.
          </p>

          <h2>Third parties</h2>
          <p>
            Messages are stored with our database provider and hosting is provided by Vercel. If you choose to contact us on
            WhatsApp, that conversation is governed by WhatsApp&apos;s own privacy policy.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask us at any time to see, correct or delete the information we hold about you by emailing{' '}
            {c.brand.email ? <a href={`mailto:${c.brand.email}`}>{c.brand.email}</a> : 'us'}. We will respond within a reasonable time.
          </p>

          <h2>Contact</h2>
          <p>Questions about this policy? Reach out to {name} using the details on our <a href="/contact">contact page</a>.</p>
        </div>
      </section>
    </main>
  );
}
