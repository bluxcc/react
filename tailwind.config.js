/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx,css}'],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInScaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeInScaleDown: {
          '0%': { opacity: '0', transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        fadeOutScaleUp: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.1)' },
        },
        fadeOutScaleDown: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.85)' },
        },
        boxIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        boxOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.97)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        fadeInScaleUp: 'fadeInScaleUp 0.5s ease-in-out',
        fadeInScaleDown: 'fadeInScaleDown 0.5s ease-in-out',
        fadeOut: 'fadeOut 0.5s ease-in-out',
        fadeOutScaleUp: 'fadeOutScaleUp 0.5s ease-in-out',
        fadeOutScaleDown: 'fadeOutScaleDown 0.5s ease-in-out',
        boxIn: 'boxIn 0.5s ease-in-out',
        boxOut: 'boxOut 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};
