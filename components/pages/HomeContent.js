import Link from 'next/link';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import ServicesOverview from '@/components/ServicesOverview';
import FeatureBlock from '@/components/FeatureBlock';
import ProcessSteps from '@/components/ProcessSteps';
import StatsBand from '@/components/StatsBand';
import Testimonials from '@/components/Testimonials';
import PlatformQuiz from '@/components/PlatformQuiz';
import Faq from '@/components/Faq';
import BlogCard from '@/components/BlogCard';
import CtaBanner from '@/components/CtaBanner';
import Icon from '@/components/Icons';
import { SectionHeading } from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

// One light band of the page: white by default, paper (bg-bg2) when tone === 'paper'.
function Band({ tone, children }) {
  return (
    <section className={`section ${tone === 'paper' ? 'bg-bg2' : ''}`}>
      <div className="wrap">{children}</div>
    </section>
  );
}

export default function HomeContent({ content, posts = [] }) {
  const vis = content.visibility || {};
  const sl = content.sectionLabels;
  const brand = content.brand || {};
  const blogPosts = vis.blogPreview !== false ? posts.slice(0, 3) : [];

  // Page rhythm (as in the original): dark hero → paper marquee strip → then the
  // light sections alternate white / paper, with the stats band as the one dark
  // break and the CTA to close. Tones are computed from whatever is switched on,
  // so the rhythm survives sections being hidden in the admin. Section order is
  // the original one (the quiz stays third, right after the feature block).
  const order = [
    'services',
    vis.diagnosis !== false && 'feature',
    vis.quiz !== false && 'quiz',
    vis.process !== false && 'process',
    vis.stats !== false && 'stats',
    vis.testimonials !== false && 'stories',
    blogPosts.length > 0 && 'blog',
    vis.faq !== false && 'faq',
  ].filter(Boolean);

  const tone = {};
  let paper = false;
  for (const key of order) {
    if (key === 'stats') { tone[key] = 'dark'; paper = false; continue; }
    tone[key] = paper ? 'paper' : 'white';
    paper = !paper;
  }
  // The CTA card sits on white. After a white section its own top spacing is
  // already there (like the original); after paper / dark it needs its own.
  const ctaFlush = tone[order[order.length - 1]] === 'white';

  return (
    <main id="main">
      <Hero
        hero={content.hero}
        platforms={content.platforms}
        brand={brand}
        founder={content.founder}
        hasAnnouncement={!!(vis.announcement !== false && content.announcement?.enabled)}
        showDashboard={vis.dashboard !== false}
        dashboard={content.dashboard}
      />

      {vis.marquee !== false && <Marquee label={content.trustStripLabel} items={content.marqueeItems} />}

      <Band tone={tone.services}>
        <SectionHeading {...sl.whatWeDo} />
        <ServicesOverview items={content.servicesOverview} />
      </Band>

      {tone.feature && (
        <Band tone={tone.feature}>
          <FeatureBlock data={content.featureBlock} />
        </Band>
      )}

      {tone.quiz && (
        <Band tone={tone.quiz}>
          <SectionHeading {...sl.quiz} center />
          <Reveal from="zoom"><PlatformQuiz /></Reveal>
        </Band>
      )}

      {tone.process && (
        <Band tone={tone.process}>
          <SectionHeading {...sl.howItWorks} />
          <ProcessSteps steps={content.process} />
        </Band>
      )}

      {tone.stats && <StatsBand stats={content.stats} />}

      {tone.stories && (
        <Band tone={tone.stories}>
          <SectionHeading {...sl.successStories} />
          <Testimonials items={content.testimonials} />
        </Band>
      )}

      {tone.blog && (
        <Band tone={tone.blog}>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
            <SectionHeading {...sl.blog} className="!mb-0" />
            <Reveal from="right">
              <Link href="/blog" className="btn btn-ghost btn-sm">All articles <Icon name="arrow" className="h-4 w-4" /></Link>
            </Reveal>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {blogPosts.map((p, i) => <BlogCard key={p.slug} post={p} index={i} />)}
          </div>
        </Band>
      )}

      {tone.faq && (
        <Band tone={tone.faq}>
          <SectionHeading {...sl.faq} center />
          <Faq items={content.faqs} whatsapp={brand.whatsapp} messengerUsername={brand.messengerUsername} />
        </Band>
      )}

      {vis.cta !== false && (
        <section className={ctaFlush ? 'pb-20 md:pb-28' : 'section'}>
          <div className="wrap"><CtaBanner {...content.ctaBanners.home} brand={brand} /></div>
        </section>
      )}
    </main>
  );
}
