// Helpers for the Fiverr-style client reviews (content.reviews + content.fiverr).
//
// The admin keeps ONE blank review in the list so the editor knows the fields to offer;
// blank entries (no review text) are never shown on the site.

const CODES = {
  'united states': 'US', usa: 'US', us: 'US', america: 'US',
  'united kingdom': 'GB', uk: 'GB', england: 'GB', scotland: 'GB', wales: 'GB',
  australia: 'AU', canada: 'CA', pakistan: 'PK', india: 'IN', germany: 'DE', france: 'FR', italy: 'IT',
  spain: 'ES', netherlands: 'NL', ireland: 'IE', 'new zealand': 'NZ', 'united arab emirates': 'AE', uae: 'AE',
  'saudi arabia': 'SA', qatar: 'QA', kuwait: 'KW', turkey: 'TR', sweden: 'SE', norway: 'NO', denmark: 'DK',
  finland: 'FI', poland: 'PL', portugal: 'PT', belgium: 'BE', switzerland: 'CH', austria: 'AT', singapore: 'SG',
  malaysia: 'MY', philippines: 'PH', indonesia: 'ID', brazil: 'BR', mexico: 'MX', 'south africa': 'ZA',
  israel: 'IL', japan: 'JP', china: 'CN', 'hong kong': 'HK', 'south korea': 'KR', greece: 'GR', romania: 'RO',
  'czech republic': 'CZ', hungary: 'HU', ukraine: 'UA', bangladesh: 'BD', egypt: 'EG', nigeria: 'NG', kenya: 'KE',
  argentina: 'AR', chile: 'CL', colombia: 'CO', bahrain: 'BH', oman: 'OM', jordan: 'JO', lebanon: 'LB',
};

/** "United States" / "usa" / "US" → "US" (or '' when unknown). */
export function countryCode(country) {
  const raw = String(country || '').trim();
  if (!raw) return '';
  if (/^[A-Za-z]{2}$/.test(raw)) return raw.toUpperCase();
  return CODES[raw.toLowerCase()] || '';
}

const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const str = (v, max = 2000) => String(v ?? '').trim().slice(0, max);

/** Keeps only reviews that actually contain text and normalises their fields. */
export function cleanReviews(list) {
  return (Array.isArray(list) ? list : [])
    .filter((r) => r && str(r.text))
    .map((r) => ({
      name: str(r.name, 80) || 'Fiverr buyer',
      country: str(r.country, 60),
      rating: clamp(Math.round(Number(r.rating) || 5), 1, 5),
      date: str(r.date, 60),
      text: str(r.text),
      gig: str(r.gig, 120),
      price: str(r.price, 60),
      duration: str(r.duration, 60),
      response: str(r.response),
    }));
}

/** Headline numbers: what the owner typed from their profile, else computed from the reviews shown. */
export function summarize(reviews, fiverr = {}) {
  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  const typed = Number(String(fiverr.overallRating ?? '').replace(',', '.'));
  const rating = Number.isFinite(typed) && typed > 0 ? clamp(typed, 1, 5) : avg;
  const total = str(fiverr.totalReviews, 20) || String(reviews.length);
  const link = /^https?:\/\//i.test(str(fiverr.profileLink, 300)) ? str(fiverr.profileLink, 300) : '';
  return { rating, ratingText: rating ? rating.toFixed(1) : '', total, link };
}

/** A stable soft colour for a reviewer's initial, picked from their name. */
const PALETTE = ['#1D9488', '#E2A63D', '#6346E6', '#DB2754', '#2B6BFF', '#0F9D58', '#F2711C', '#8B5CF6'];
export function avatarColor(name) {
  let h = 0;
  for (const ch of String(name)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}
