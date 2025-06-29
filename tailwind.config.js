/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B46C1',
        secondary: '#1E293B',
        accent: '#F59E0B',
        surface: '#334155',
        background: '#0F172A',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'piece-hover': 'piece-hover 0.2s ease-out',
        'capture': 'capture 0.4s ease-in',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(107, 70, 193, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(107, 70, 193, 0.8)' },
        },
        'piece-hover': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        'capture': {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}