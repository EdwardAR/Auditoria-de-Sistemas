/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe1e4',
          500: '#EC111A',
          600: '#ce0e16',
          700: '#ad0c13',
        },
        ink: '#1F2937',
      },
      boxShadow: {
        card: '0 12px 35px -15px rgba(31, 41, 55, 0.18)',
        glow: '0 16px 40px -18px rgba(236, 17, 26, 0.55)',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
