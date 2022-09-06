/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#BDBDBD',
        primary: '#009688',
        light: '#B2DFDB',
        dark: '#00796B',
        accent: '#607D8B',
        softBlack: '#212121',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
};
