const baseConfig = require('@civet/config/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      ...baseConfig.theme.extend,
    },
  },
  darkMode: ['class'],
};
