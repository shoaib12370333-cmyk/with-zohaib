import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import ServicesOverview from '@/components/ServicesOverview';
import FeatureBlock from '@/components/FeatureBlock';
import ProcessSteps from '@/components/ProcessSteps';
import StatsBand from '@/components/StatsBand';
import Testimonials from '@/components/Testimonials';
import CtaBanner from '@/components/CtaBanner';
import Reveal from '@/components/Reveal';

export default function HomeContent({ content }) {
  const layout = content.layout || {};
  const vis = content.visibility || {};
  const sl = content.sectionLabels;

  return (
    <main>
      <Hero
        hero={content.hero}
        platforms={content.platforms}
        founder={content.founder}
        brandAvatar={content.brand.avatarUrl}
        showFounderStrip={!!vis.founderStrip}
        spacing={layout.hero}
      />

      {vis.marquee !== false && <Marquee label={content.trustStripLabel} items={content.marqueeItems} speed={layout.marqueeSpeed} />}

      <section style={{ paddingBlock: `${layout.services ?? 4}rem` }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10">
          <Reveal className="max-w-[640px] mb-8 md:mb-12" as="div">
            <span className="eyebrow">{sl.whatWeDo.eyebrow}</span>
            <h2 className="mt-3" style={{ fontSize: 'var(--ts-heading, 2.2rem)' }}>{sl.whatWeDo.heading}</h2>
            <p className="text-slateSoft text-[1.125rem] mt-4">{sl.whatWeDo.lead}</p>
          </Reveal>
          <ServicesOverview items={content.servicesOverview} />
        </div>
      </section>

      {vis.featureBlock !== false && (
        <section style={{ paddingBlock: `${layout.featureBlock ?? 4}rem` }}>
          <div className="max-w-[1200px] mx-auto px-5 sm:px-10">
            <FeatureBlock data={content.featureBlock} />
          </div>
        </section>
      )}

      {vis.process !== false && (
        <section className="bg-paper" style={{ paddingBlock: `${layout.process ?? 4}rem` }}>
          <div className="max-w-[1200px] mx-auto px-5 sm:px-10">
            <Reveal className="max-w-[640px] mb-8 md:mb-12">
              <span className="eyebrow">{sl.howItWorks.eyebrow}</span>
              <h2 className="mt-3" style={{ fontSize: 'var(--ts-heading, 2.2rem)' }}>{sl.howItWorks.heading}</h2>
            </Reveal>
            <ProcessSteps steps={content.process} />
          </div>
        </section>
      )}

      {vis.stats !== false && <StatsBand stats={content.stats} spacing={layout.stats} />}

      {vis.testimonials !== false && (
        <section style={{ paddingBlock: `${layout.testimonials ?? 4}rem` }}>
          <div className="max-w-[1200px] mx-auto px-5 sm:px-10">
            <Reveal className="max-w-[640px] mb-8 md:mb-12">
              <span className="eyebrow">{sl.successStories.eyebrow}</span>
              <h2 className="mt-3" style={{ fontSize: 'var(--ts-heading, 2.2rem)' }}>{sl.successStories.heading}</h2>
            </Reveal>
            <Testimonials items={content.testimonials} />
          </div>
        </section>
      )}

      {vis.ctaHome !== false && (
        <section style={{ paddingBottom: `${layout.cta ?? 4}rem` }}>
          <div className="max-w-[1200px] mx-auto px-5 sm:px-10">
            <CtaBanner
              eyebrow={content.ctaBanners.home.eyebrow}
              title={content.ctaBanners.home.title}
              description={content.ctaBanners.home.description}
            />
          </div>
        </section>
      )}
    </main>
  );
}
