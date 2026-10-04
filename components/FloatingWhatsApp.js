import { waLink } from '@/lib/links';

export default function FloatingWhatsApp({ whatsapp, message }) {
  if (!whatsapp) return null;
  return (
    <a
      href={waLink(whatsapp, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="no-print fixed bottom-5 right-5 z-[90] group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" aria-hidden="true" />
      <span className="relative flex items-center gap-0 rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,.7)] transition-all duration-500 hover:scale-105 pl-0 hover:pl-1">
        <span className="max-w-0 overflow-hidden whitespace-nowrap font-display font-semibold text-sm transition-all duration-500 group-hover:max-w-[9rem] group-hover:pl-4 group-focus-visible:max-w-[9rem] group-focus-visible:pl-4">
          Chat with us
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/whatsapp-icon.png" alt="" className="w-14 h-14 rounded-full" />
      </span>
    </a>
  );
}
