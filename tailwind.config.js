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
<<<<<<< HEAD
          900: '#0a0e27',
          800: '#0f1535',
          700: '#141b47',
          600: '#1a2355',
        },
        'primary-purple': '#6366f1',
        'primary-blue': '#3b82f6',
=======
          900: '#1e293b', // Slate 800 - Much lighter than before
          800: '#334155', // Slate 700 - Softer dark
          700: '#475569', // Slate 600 - Medium gray-blue
          600: '#64748b', // Slate 500 - Light gray-blue
        },
        'primary-purple': '#8b5cf6', // Brighter purple (violet-500)
        'primary-blue': '#3b82f6',   // Keep the vibrant blue
        'accent-pink': '#ec4899',     // Pink accent
        'accent-cyan': '#06b6d4',     // Cyan accent
>>>>>>> ef4bf6774ac4b7ca23a59a08549d3557d5cbda3b
      },
    },
  },
  plugins: [],
}
