export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        aqua: '#00d4ff',
        'aqua-dark': '#00a8cc',
        'text-dark': '#0f172a',
        'text-mid': '#475569',
        'text-muted': '#64748b',
        border: '#e2e8f0',
        'off-white': '#f8fafc',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};