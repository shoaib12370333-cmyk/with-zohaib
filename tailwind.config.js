/** @type {import('tailwindcss').Config} */
const c = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: c('bg'),
        bg2: c('bg2'),
        surface: c('surface'),
        surface2: c('surface2'),
        fg: c('fg'),
        muted: c('muted'),
        faint: c('faint'),
        edge: c('edge'),
        gold: c('gold'),
        gold2: c('gold2'),
        teal: c('teal'),
        violet: c('violet'),
        rose: c('rose'),
        // Fixed classic palette (same values the original site used) — handy for
        // one-off accents that must NOT change with the light/dark zone.
        ink: '#0A0F1E',
        ink2: '#131C30',
        ink3: '#1B2740',
        paper: '#F3F5F8',
        paper2: '#EAEDF2',
        goldDeep: '#C4872A',
        tealDeep: '#146F66',
        slate: '#48505E',
        slateSoft: '#727C8C',
        line: '#E1E4EA',
        lineDark: '#28324A',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: { xl2: '20px' },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--edge) / .1), 0 20px 60px -20px rgb(var(--gold) / .35)',
        card: '0 10px 30px -12px rgba(10,15,30,.25)',
        cardLg: '0 24px 60px -20px rgba(10,15,30,.35)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(4%, -6%, 0) scale(1.12)' },
        },
        shimmer: { to: { backgroundPosition: '200% center' } },
        rise: { from: { opacity: 0, transform: 'translateY(14px)' }, to: { opacity: 1, transform: 'none' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        drift: 'drift 18s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        rise: 'rise .7s cubic-bezier(.2,.7,.2,1) both',
      },
    },
  },
  plugins: [],
};
