/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'navy': {
          900: '#1e293b', // Slate 800 - Much lighter than before
          800: '#334155', // Slate 700 - Softer dark
          700: '#475569', // Slate 600 - Medium gray-blue
          600: '#64748b', // Slate 500 - Light gray-blue
        },
        'primary-purple': '#8b5cf6', // Brighter purple (violet-500)
        'primary-blue': '#3b82f6',   // Keep the vibrant blue
        'accent-pink': '#ec4899',     // Pink accent
        'accent-cyan': '#06b6d4',     // Cyan accent
      },
    },
  },
  plugins: [],
}
