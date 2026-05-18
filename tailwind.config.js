/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B1220',
          800: '#102A56',
          700: '#1E3A8A',
          600: '#2563EB',
        },
        primary: {
          blue: '#2563EB',
          green: '#059669',
          cyan: '#0284C7',
          amber: '#EA580C',
        },
      },
    },
  },
  plugins: [],
};
