/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          DEFAULT: '#818cf8',
          light: '#a5b4fc',
          dark: '#6366f1',
        },
        accent: {
          purple: '#7c3aed',
          blue: '#3b82f6',
          indigo: '#6366f1',
          violet: '#8b5cf6',
        },
        verdict: {
          red: '#f43f5e',
          yellow: '#f59e0b',
          green: '#10b981',
        },
        surface: {
          DEFAULT: '#020617',
          card: 'rgba(15, 23, 42, 0.6)',
          elevated: 'rgba(30, 41, 59, 0.5)',
          border: 'rgba(148, 163, 184, 0.1)',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(99, 102, 241, 0.15)',
        'glow-md': '0 0 30px rgba(99, 102, 241, 0.2)',
        'glow-lg': '0 0 60px rgba(99, 102, 241, 0.25)',
        'glow-red': '0 0 20px rgba(244, 63, 94, 0.3)',
        'glow-yellow': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
