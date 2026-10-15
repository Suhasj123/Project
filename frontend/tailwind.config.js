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
        brand: {
          blue: '#2563EB',     // Royal Blue
          lightBlue: '#3B82F6',
          darkBlue: '#1D4ED8',
          purple: '#7C3AED',   // Rich Purple
          lightPurple: '#8B5CF6',
          darkPurple: '#6D28D9',
          accent: '#06B6D4'    // Cyan accent
        },
        dark: {
          bg: '#0F172A',       // Slate 900
          card: '#1E293B',     // Slate 800
          border: '#334155',   // Slate 700
          text: '#F8FAFC'      // Slate 50
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
