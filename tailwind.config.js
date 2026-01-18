/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CampusFix Primary Greens
        primary: {
          50: '#E8F4EC',   // Very light green (for backgrounds)
          100: '#C8E6D0',  // Light green
          200: '#A8D8B4',  // Lighter green
          300: '#88CA98',  // Medium light green
          400: '#6BAD7C',  // Medium green
          500: '#578F68',  // Accent green
          600: '#304E39',  // Primary (default)
          700: '#2D5A3D',  // Primary medium
          800: '#1A3D2A',  // Primary dark
          900: '#152E20',  // Very dark green
        },
        secondary: {
          DEFAULT: '#5A7D6A',
          light: '#6B8E7A',
          dark: '#496A58',
        },
        // Success, Warning, Error
        success: {
          DEFAULT: '#6BB377',
          light: '#8BC695',
          dark: '#5A9F65',
        },
        warning: {
          DEFAULT: '#FFC000',
          light: '#FFD333',
          dark: '#CCA000',
        },
        danger: {
          DEFAULT: '#922B21',
          light: '#C0392B',
          dark: '#6E1F19',
        },
        // Neutrals
        muted: '#8EA08F',
        background: {
          DEFAULT: '#F8FAF8',
          light: '#E8F4EC',
        },
      },
    },
  },
  plugins: [],
}
