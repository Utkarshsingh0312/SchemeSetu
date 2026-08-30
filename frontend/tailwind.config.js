/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#EDE6D6',
        'paper-2': '#E4DBC6',
        card: '#F7F3E9',
        ink: '#211D16',
        'ink-soft': '#5B5647',
        navy: '#16233F',
        'navy-2': '#233657',
        gold: '#D9A441',
        'gold-deep': '#B9822A',
        teal: '#2F6F63',
        'teal-deep': '#204E45',
        rust: '#B65C38',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
