/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx,css}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8E8FD',
          100: '#CDCEEE',
          200: '#A2A4F6',
          500: '#0C1083',
          600: '#090B5D',
          700: '#04062F',
        },
        lightRed: {
          50: '#FFE5E5',
          100: '#FFCCCC',
          200: '#FF9999',
          300: '#FF6666',
          500: '#FFCDCD',
        },
        lightBlue: {
          50: '#E5FBFF',
          100: '#CCF7FF',
          200: '#99F0FF',
          300: '#66E8FF',
          500: '#52E5FF',
          600: '#00ADCC',
        },
        grey: {
          50: '#F2F2F2',
          100: '#E6E6E6',
          200: '#CCCCCC',
          300: '#999999',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333',
          900: '#1A1A1A',
          950: '#0D0D0D',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        fadeOut: 'fadeOut 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};
