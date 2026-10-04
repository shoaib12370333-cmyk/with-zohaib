import Link from 'next/link';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import ServicesOverview from '@/components/ServicesOverview';
import FeatureBlock from '@/components/FeatureBlock';
import ProcessSteps from '@/components/ProcessSteps';
import StatsBand from '@/components/StatsBand';
import Testimonials from '@/components/Testimonials';
import PlatformDashboard from '@/components/PlatformDashboard';
import PlatformQuiz from '@/components/PlatformQuiz';
import Faq from '@/components/Faq';
import BlogCard from '@/components/BlogCard';
import CtaBanner from '@/components/CtaBanner';
import Icon from '@/components/Icons';
import { SectionHeading } from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

export default function HomeContent({ content, posts = [] }) {
  const vis = content.visibility || {};
  const sl = content.sectionLabels;
  const d = content.dashboard;

  return (
    <main id="main">
      <Hero
        hero={content.hero}
        platforms={content.platforms}
        brand={content.brand}
        founder={content.founder}
        hasAnnouncement={!!(vis.announcement !== false && content.announcement?.enabled)}
      />

      {vis.marquee !== false && <Marquee label={content.trustStripLabel} items={content.marqueeItems} />}

      <section className="section">
        <div className="wrap">
          <SectionHeading {...sl.whatWeDo} />
          <ServicesOverview items={content.servicesOverview} />
        </div>
      </section>

      {vis.diagnosis !== false && (
        <section className="section bg-bg2/60 border-y border-edge/10">
          <div className="wrap"><FeatureBlock data={content.featureBlock} /></div>
        </section>
      )}

      {vis.quiz !== false && (
        <section className="section">
          <div className="wrap">
            <SectionHeading {...sl.quiz} center />
            <Reveal><PlatformQuiz /></Reveal>
          </div>
        </section>
      )}

      {vis.process !== false && (
        <section className="section bg-bg2/60 border-y border-edge/10">
          <div className="wrap">
            <SectionHeading {...sl.howItWorks} />
            <ProcessSteps steps={content.process} />
          </div>
        </section>
      )}

      {vis.dashboard !== false && (
        <section className="section">
          <div className="wrap grid lg:grid-cols-[.8fr_1.2fr] gap-12 lg:gap-16 items-center">
            <Reveal from="left">
              <span className="eyebrow">{d.eyebrow}</span>
              <h2 className="h-section mt-4">{d.heading}</h2>
              <p className="lead mt-5">{d.lead}</p>
              <ul className="mt-8 space-y-3 text-[.97rem]">
                {['Revenue by platform, day by day', 'Listing & coaching activity in one view', 'Clear before / after on every change we make'].map((t) => (
                  <li key={t} className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-teal/15 text-teal grid place-items-center"><Icon name="check" className="w-3 h-3" /></span>{t}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal from="right"><PlatformDashboard platforms={content.platforms} disclaimer={d.disclaimer} /></Reveal>
          </div>
        </section>
      )}

      {vis.stats !== false && <StatsBand stats={content.stats} />}

      {vis.testimonials !== false && (
        <section className="section">
          <div className="wrap">
            <SectionHeading {...sl.successStories} />
            <Testimonials items={content.testimonials} />
          </div>
        </section>
      )}

      {vis.blogPreview !== false && posts.length > 0 && (
        <section className="section bg-bg2/60 border-y border-edge/10">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <SectionHeading {...sl.blog} className="!mb-0" />
              <Link href="/blog" className="btn btn-ghost btn-sm">All articles <Icon name="arrow" className="w-4 h-4" /></Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {posts.slice(0, 3).map((p, i) => <BlogCard key={p.slug} post={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {vis.faq !== false && (
        <section className="section">
          <div className="wrap">
            <SectionHeading {...sl.faq} center />
            <Faq items={content.faqs} />
          </div>
        </section>
      )}

      {vis.cta !== false && (
        <section className="pb-20 md:pb-28">
          <div className="wrap"><CtaBanner {...content.ctaBanners.home} brand={content.brand} /></div>
        </section>
      )}
    </main>
  );
}
