/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        accent: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        surface: {
          light: '#f8fafc',
          dark: '#0a0e1a',
          card:  '#111827',
        },
      },
      boxShadow: {
        'glow':   '0 0 40px -10px rgba(139, 92, 246, 0.35)',
        'glow-sm':'0 0 20px -5px rgba(139, 92, 246, 0.25)',
        'soft':   '0 4px 24px -8px rgba(0, 0, 0, 0.12)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #635BFF 0%, #0073E6 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, rgba(99,91,255,0.15) 0%, rgba(0,115,230,0.15) 100%)',
        'glass-light': 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)',
        'glass-dark':  'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%':   { opacity: 0, transform: 'translateX(-8px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        'fade-in':  'fade-in 0.4s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'shimmer':  'shimmer 2s infinite linear',
      },
      borderRadius: {
        'xl':  '0.875rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}