/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colors from vizerp_UI theme (light theme with cyan accent)
        primary: {
          DEFAULT: '#00BCD4', // Cyan accent from vizerp
          light: '#4DD0E1',
          dark: '#0097A7',
        },
        background: {
          DEFAULT: '#F5F5F5', // Light gray background
          paper: '#FFFFFF', // White paper background
        },
        border: {
          DEFAULT: '#00BCD4', // Cyan border for wireframe
          light: '#E0E0E0', // Light gray border
        },
        text: {
          primary: '#212121', // Dark text
          secondary: '#757575', // Gray text
        },
      },
      borderRadius: {
        DEFAULT: '0.4rem',
      },
      fontFamily: {
        handwritten: ['"Caveat"', '"Comic Sans MS"', 'cursive'],
      },
    },
  },
  plugins: [],
}
