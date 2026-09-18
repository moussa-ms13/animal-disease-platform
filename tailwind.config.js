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
        dhis: {
          50: '#f0f6fa',
          100: '#e1ecf5',
          200: '#bed8eb',
          300: '#8bbbdd',
          400: '#529bcb',
          500: '#2b7db5',
          600: '#1e6496',
          700: '#1d5288', // DHIS2 Classic Core Blue
          800: '#1a4571',
          900: '#173a5e',
          950: '#0f253e',
          DEFAULT: '#1d5288'
        },
        clinical: {
          navy: '#1b2d42',
          header: '#143d59',
          teal: '#0e7490',
          slate: '#334155',
          border: '#cbd5e1',
          bg: '#f4f6f8',
          surface: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Inter', 'Cairo', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Noto Sans Arabic', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        'none': '0px',
        'xs': '1px',
        'sm': '2px',
        DEFAULT: '3px',
        'md': '4px',
        'lg': '6px',
        'xl': '8px',
      },
      boxShadow: {
        'none': 'none',
        'clinical': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'dropdown': '0 2px 6px 0 rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}