/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Oswald', 'sans-serif'],
    },
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#0e7490',
          secondary: 'rgba(4, 12, 16, 1)',
          accent: '#d1d5db',
          neutral: '#1f2937',
          'base-100': '#e5e7eb',
          info: '#2563eb',
          success: '#22c55e',
          warning: '#eab308',
          error: '#e11d48',
          hover: '#222b36',
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: 'rgba(81, 186, 238, 1)',
          secondary: '#075985',
          neutral: '#fff',
          'base-100': '#415063',
          background: 'rgba(4, 12, 16, 1)',
          accent: 'rgba(16, 32, 40, 1)',
          error: 'rgba(219, 1, 106, 1)',
          hover: 'rgb(34, 43, 54)',
        },
      },
    ],
    darkTheme: 'light',
  },
};
