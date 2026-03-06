

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D6A4F',
          50:  '#f0faf4',
          100: '#dcf4e6',
          200: '#bbe8cf',
          300: '#86d4a9',
          400: '#4db87f',
          500: '#2D6A4F',
          600: '#245a42',
          700: '#1B4332',
          800: '#163627',
          900: '#0d2218',
        },
        secondary: {
          DEFAULT: '#D4A017',
          light: '#E9C46A',
          dark:  '#b8870f',
        },
        accent: {
          DEFAULT: '#E76F51',
          light:  '#F4A261',
          dark:   '#c85a3e',
        },
        kigezi: {
          bg:   '#FAF7F2',
          card: '#FFFFFF',
          text: '#1A1A2E',
          muted:'#6B7280',
          border:'#E5E7EB',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        card:  '0 2px 15px rgba(0,0,0,0.08)',
        hover: '0 8px 30px rgba(0,0,0,0.14)',
        btn:   '0 4px 14px rgba(45,106,79,0.35)',
      },
      borderRadius: {
        xl:  '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};