/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        error: 'var(--error)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        success: 'var(--success)',
        primary2: 'var(--primary2)',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      text: {
        primary: 'rgb(0, 167, 111)',
      },
      screens: {
        xxs:"360px",
        xs: "480px",
        ss: "620px",
        sm: "768px",
    },
    },
  },
}

