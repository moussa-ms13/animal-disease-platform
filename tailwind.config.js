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
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#16a34a',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          DEFAULT: '#059669'
        },
        surveillance: {
          teal: '#0d9488',
          cyan: '#0284c7',
          amber: '#d97706',
          danger: '#dc2626',
          violet: '#7c3aed'
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Cairo', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Noto Sans Arabic', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'soft-sm': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'soft': '0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'soft-lg': '0 10px 25px -3px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.04)',
        'glass': '0 8px 32px 0 rgba(15, 118, 110, 0.12)'
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
