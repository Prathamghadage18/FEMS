/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Prevent auto dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#dcfce7", // Light green - better contrast
        secondary: "#bbf7d0", // Slightly darker green
        tertiary: "#16a34a", // Dark green - good for text/icons
        quaternery: "#22c55e", // Bright green
        "white-100": "rgba(255, 255, 255, 0.9)",
        light: "#f0fdf4", // Very light green tint
        "secondary-hover": "#86efac",
        "green-1": "#dcfce7", // Light mint green
        "green-2": "#bbf7d0", // Soft green
      },
    },
  },
  plugins: [],
};
