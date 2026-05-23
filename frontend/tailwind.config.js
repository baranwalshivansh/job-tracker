/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        brand: "#2364aa",
        mint: "#2fbf71",
        coral: "#ef6f6c",
      },
      boxShadow: {
        soft: "0 10px 35px rgba(23, 32, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
