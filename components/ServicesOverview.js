import Link from 'next/link';
import Icon from './Icons';
import Reveal from './Reveal';

export default function ServicesOverview({ items }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {(items || []).map((item, i) => (
        <Reveal key={i} delay={i * 60}>
          <div className="bg-white border border-line rounded-2xl p-6 h-full transition-all hover:-translate-y-1 hover:shadow-card">
            <div className="w-[46px] h-[46px] rounded-[10px] bg-paper2 text-tealDeep flex items-center justify-center mb-4">
              <Icon name={item.icon} className="w-[22px] h-[22px]" />
            </div>
            <h3 className="text-[1.3rem] mb-2">{item.title}</h3>
            <p className="text-slateSoft text-[.96rem]">{item.description}</p>
            <Link href="/services" className="inline-flex items-center gap-[.4em] font-mono-eyebrow text-[.9rem] font-medium text-tealDeep mt-4 group">
              Discover More <Icon name="arrow" className="w-[15px] h-[15px] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
