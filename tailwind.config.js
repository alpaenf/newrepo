/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#045498',
          dark: '#073B73',
          light: '#EBF3FB',
          soft: '#D0E3F7'
        },
        ink: {
          900: '#1A1D29',
          700: '#3D4152',
          500: '#6B7280',
          300: '#9CA3AF'
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F7F7F9',
          border: '#ECEDF1'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
}
