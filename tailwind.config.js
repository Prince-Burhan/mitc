/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9fa',
          100: '#d9f0f3',
          200: '#b7e3e9',
          300: '#84cdd8',
          400: '#4aafbf',
          500: '#21808d',
          600: '#1d7481',
          700: '#1a686a',
          800: '#1a5458',
          900: '#19464b',
          950: '#0a2c31',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
