/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f1117',
        surface: '#161b26',
        border: '#1e2330',
        teal: { DEFAULT: '#0d9e7a', dim: '#0d3d2e' },
        text: { DEFAULT: '#e2e8f0', secondary: '#94a3b8', muted: '#475569' },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        blue: '#60a5fa',
      },
    },
  },
  plugins: [],
}
