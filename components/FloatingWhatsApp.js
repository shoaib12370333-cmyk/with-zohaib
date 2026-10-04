import { waLink } from '@/lib/links';

// A calm, slow ring (the stock `ping` is frantic) + a gentle pop-in once the page has settled.
const WA_CSS = '@keyframes waRing{0%{transform:scale(1);opacity:.5}70%,100%{transform:scale(1.65);opacity:0}}.wa-ring{animation:waRing 2.8s ease-out infinite}.wa-in{animation:popIn .7s var(--ease-spring) 1.4s both}';

// The original round green WhatsApp button, bottom-right. The "Chat with us" label
// grows out of it on hover / keyboard focus.
export default function FloatingWhatsApp({ whatsapp, message }) {
  if (!whatsapp) return null;
  return (
    <a
      href={waLink(whatsapp, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      data-floating-wa=""
      className="wa-in no-print fixed bottom-5 right-5 z-[90] group"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <style>{WA_CSS}</style>
      <span className="wa-ring absolute right-0 top-0 w-14 h-14 rounded-full bg-[#25D366]" aria-hidden="true" />
      <span className="relative flex items-center rounded-full bg-[#25D366] shadow-[0_12px_30px_-8px_rgba(37,211,102,.7)] transition-[transform,box-shadow] duration-500 hover:scale-105 group-focus-visible:scale-105">
        <span className="max-w-0 overflow-hidden whitespace-nowrap font-display font-bold text-sm text-ink transition-all duration-500 group-hover:max-w-[9rem] group-hover:pl-5 group-focus-visible:max-w-[9rem] group-focus-visible:pl-5">
          Chat with us
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/whatsapp-icon.png" alt="" className="w-14 h-14 rounded-full flex-none" />
      </span>
    </a>
  );
}
