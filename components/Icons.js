// Small, consistent line-icon set used across the site. Kept as one file so
// new icons are easy to add from the admin panel later if needed.

const paths = {
  shop: <path d="M4 10L5 4h14l1 6M4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9M4 10h16M9 20v-6h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  trend: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  users: <path d="M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17 20v-1a4 4 0 0 0-2.5-3.7M14.5 4.3A3.5 3.5 0 0 1 15 11.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
  brush: <path d="M18 3a2.5 2.5 0 0 1 2.5 2.5c0 2-2.5 3-4.5 5.5l-3-3C15.5 5.5 16 3 18 3ZM12.5 8.5 4 17c-.7.7-1 2-1 3 1 0 2.3-.3 3-1l8.5-8.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
  code: <path d="M8 6 2 12l6 6M16 6l6 6-6 6M14 4l-4 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  app: <><rect x="6" y="2" width="12" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M11 18h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></>,
  check: <path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="m2 6 10 7L22 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  clock: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
  close: <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
  target: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /></>,
  shield: <><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></>,
  layers: <path d="M12 2 2 7l10 5 10-5-10-5ZM2 12l10 5 10-5M2 17l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
  insta: <><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" /></>,
  fb: <path d="M15 21v-8h2.5l.5-3.5H15V7.2c0-1 .4-1.7 1.8-1.7H18V2.2C17.6 2.1 16.5 2 15.3 2 12.8 2 11 3.5 11 6.3V9.5H8.3V13H11v8h4Z" fill="currentColor" />,
  whatsapp: <><path d="M21 11.5a8.5 8.5 0 0 1-12.36 7.56L4 20l1.05-4.55A8.5 8.5 0 1 1 21 11.5Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><path d="M8.5 10.3c.5 2.6 2.5 4.6 5.1 5.1" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" /></>,
  star: <path d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7L2 9.2l7.1-.6L12 2Z" fill="currentColor" />,
  plus: <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
};

export default function Icon({ name, className = 'w-5 h-5' }) {
  const content = paths[name];
  if (!content) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {content}
    </svg>
  );
}
