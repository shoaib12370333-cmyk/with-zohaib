// One consistent line-icon set. Add a new icon here and it automatically
// becomes available in the admin "icon" picker (see ICON_NAMES).

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

const paths = {
  shop: <path d="M4 10 5 4h14l1 6M4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9M4 10h16M9 20v-6h6v6" {...S} />,
  trend: <path d="m3 17 6-6 4 4 8-8M15 7h6v6" {...S} />,
  users: <path d="M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17 20v-1a4 4 0 0 0-2.5-3.7M14.5 4.3A3.5 3.5 0 0 1 15 11.2" {...S} strokeWidth={1.5} />,
  brush: <path d="M18 3a2.5 2.5 0 0 1 2.5 2.5c0 2-2.5 3-4.5 5.5l-3-3C15.5 5.5 16 3 18 3ZM12.5 8.5 4 17c-.7.7-1 2-1 3 1 0 2.3-.3 3-1l8.5-8.5" {...S} strokeWidth={1.5} />,
  code: <path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 4l-4 16" {...S} />,
  app: <><rect x="6" y="2" width="12" height="20" rx="2.5" {...S} /><path d="M11 18h2" {...S} strokeWidth={2} /></>,
  check: <path d="m4 12 5 5L20 6" {...S} strokeWidth={2} />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2.5" {...S} /><path d="m2 6 10 7L22 6" {...S} /></>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" {...S} strokeWidth={1.5} />,
  clock: <><circle cx="12" cy="12" r="9" {...S} /><path d="M12 7v5l3 3" {...S} /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" {...S} strokeWidth={1.8} />,
  upright: <path d="M7 17 17 7M8 7h9v9" {...S} strokeWidth={1.8} />,
  menu: <path d="M3 7h18M3 12h18M3 17h18" {...S} strokeWidth={1.8} />,
  close: <path d="M6 6l12 12M18 6 6 18" {...S} strokeWidth={1.8} />,
  target: <><circle cx="12" cy="12" r="9" {...S} /><circle cx="12" cy="12" r="5" {...S} /><circle cx="12" cy="12" r="1.6" fill="currentColor" /></>,
  shield: <><path d="m12 3 7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" {...S} /><path d="m9 12 2 2 4-4" {...S} /></>,
  layers: <path d="m12 2 10 5-10 5L2 7l10-5ZM2 12l10 5 10-5M2 17l10 5 10-5" {...S} strokeWidth={1.4} />,
  insta: <><rect x="3" y="3" width="18" height="18" rx="5" {...S} strokeWidth={1.5} /><circle cx="12" cy="12" r="4" {...S} strokeWidth={1.5} /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" /></>,
  fb: <path d="M15 21v-8h2.5l.5-3.5h-3V7.2c0-1 .4-1.7 1.8-1.7H18V2.2C17.6 2.1 16.5 2 15.3 2 12.8 2 11 3.5 11 6.3v3.2H8.3V13H11v8h4Z" fill="currentColor" />,
  youtube: <><rect x="2" y="5" width="20" height="14" rx="4" {...S} /><path d="m10 9 5 3-5 3V9Z" fill="currentColor" /></>,
  tiktok: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.3 2.4 1.9 4 4.5 4.2" {...S} strokeWidth={1.8} />,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="3" {...S} strokeWidth={1.5} /><path d="M8 11v5M8 8v.01M12 16v-5m0 2.5c0-1.5 1-2.5 2.2-2.5 1.2 0 1.8.8 1.8 2.3V16" {...S} strokeWidth={1.6} /></>,
  whatsapp: <><path d="M21 11.5a8.5 8.5 0 0 1-12.36 7.56L4 20l1.05-4.55A8.5 8.5 0 1 1 21 11.5Z" {...S} strokeWidth={1.4} /><path d="M8.5 10.3c.5 2.6 2.5 4.6 5.1 5.1" {...S} strokeWidth={1.4} /></>,
  star: <path d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7L2 9.2l7.1-.6L12 2Z" fill="currentColor" />,
  plus: <path d="M12 5v14M5 12h14" {...S} strokeWidth={1.8} />,
  sun: <><circle cx="12" cy="12" r="4" {...S} /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" {...S} /></>,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" {...S} />,
  search: <><circle cx="11" cy="11" r="7" {...S} /><path d="m20 20-3.5-3.5" {...S} /></>,
  send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" {...S} strokeWidth={1.5} />,
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" {...S} strokeWidth={1.5} />,
  calendar: <><rect x="3" y="4" width="18" height="17" rx="3" {...S} /><path d="M3 10h18M8 2v4M16 2v4" {...S} /></>,
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" {...S} />,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" {...S} />,
  chart: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" {...S} strokeWidth={1.8} />,
  globe: <><circle cx="12" cy="12" r="9" {...S} /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" {...S} /></>,
  cube: <path d="m12 2 9 5v10l-9 5-9-5V7l9-5ZM3 7l9 5 9-5M12 12v10" {...S} />,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2.5" {...S} /><path d="M8 10V7a4 4 0 0 1 8 0v3" {...S} /></>,
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" {...S} /><circle cx="12" cy="12" r="3" {...S} /></>,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" {...S} />,
  edit: <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" {...S} />,
  home: <path d="m3 11 9-8 9 8M5 10v10h5v-6h4v6h5V10" {...S} />,
  inbox: <path d="M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6l3.5-7Z" {...S} />,
  doc: <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5ZM14 3v5h5M9 13h6M9 17h6" {...S} />,
  sliders: <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4" {...S} />,
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" {...S} />,
  external: <path d="M14 4h6v6M20 4 10 14M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" {...S} />,
};

export const ICON_NAMES = Object.keys(paths);

export default function Icon({ name, className = 'w-5 h-5' }) {
  const content = paths[name];
  if (!content) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      {content}
    </svg>
  );
}
