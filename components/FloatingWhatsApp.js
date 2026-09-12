import { waLink } from '@/lib/links';

export default function FloatingWhatsApp({ whatsapp, message }) {
  if (!whatsapp) return null;
  return (
    <a
      href={waLink(whatsapp, message)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[90] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
    >
      <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: '#25D366', opacity: 0.5 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/whatsapp-icon.png" alt="Chat on WhatsApp" className="relative w-14 h-14 rounded-full" />
    </a>
  );
}
