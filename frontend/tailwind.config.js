/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", "[data-mantine-color-scheme='dark']"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Dosis", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#4B0082",
          light: "#6A5ACD",
          dark: "#2E0854",
        },
        secondary: {
          DEFAULT: "#20B2AA",
          light: "#48D1CC",
          dark: "#008B8B",
        },
        background: {
          light: "#F0F2F5",
          dark: "#2F3136",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#40444B",
        },
        text: {
          light: {
            primary: "#1E1E1E",
            secondary: "#5E5E5E",
          },
          dark: {
            primary: "#FFFFFF",
            secondary: "#B9BBBE",
          },
        },
        accent: {
          DEFAULT: "#DAA520",
          light: "#FFD700",
          dark: "#B8860B",
        },
      },
    },
  },
  plugins: [],
};
