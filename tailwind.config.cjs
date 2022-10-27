const defaultTheme = require('tailwindcss/defaultTheme')


const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Cormorant Infant', ...defaultTheme.fontFamily.sans],
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms')
  ],
};

module.exports = config;
