/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        box: "1.5rem",
        "box-lg": "2rem",
      },
    },
  },
  plugins: [],
};
