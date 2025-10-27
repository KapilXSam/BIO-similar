/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0033A0',
        'brand-lightblue': '#0078D4',
        'brand-accent': '#FDB913',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
