/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#045498',
          dark: '#033B6B',
          light: '#E6F0FA',
          soft: '#EFF6FF'
        },
        ink: {
          950: '#0F172A',
          900: '#1A1D29',
          800: '#2E3344',
          700: '#3D4152',
          600: '#4B5563',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#9CA3AF',
          200: '#E5E7EB',
          100: '#F3F4F6'
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F7F8FB',
          border: '#ECEDF1',
          card: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif']
      },
      boxShadow: {
        card: '0 1px 4px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
}
