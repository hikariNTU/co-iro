/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    animation: {
      expand: "expand 0.3s",
    },
    keyframes: {
      expand: {
        from: {
          transform: "scaleY(0)",
          maxHeight: 0,
          padding: 0,
        },
        to: {
          transform: "scaleY(1)",
          maxHeight: 50,
        },
      },
    },
  },
  plugins: [],
}
