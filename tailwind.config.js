/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--c-ink)',
        ink2: 'var(--c-ink2)',
        ink3: '#1B2740',
        paper: 'var(--c-paper)',
        paper2: 'var(--c-paper2)',
        gold: 'var(--c-gold)',
        goldDeep: 'var(--c-goldDeep)',
        teal: 'var(--c-teal)',
        tealDeep: 'var(--c-tealDeep)',
        slate: 'var(--c-slate)',
        slateSoft: 'var(--c-slateSoft)',
        line: 'var(--c-line)',
        lineDark: '#28324A',
      },
      fontFamily: {
        display: ['Archivo', 'sans-serif'],
        body: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        xl2: '20px',
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(10,15,30,.25)',
        cardLg: '0 24px 60px -20px rgba(10,15,30,.35)',
      },
    },
  },
  plugins: [],
};
