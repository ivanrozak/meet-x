module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        actionBackground: "rgba(255, 255, 255, 0.5)",
        actionBackgroundHover: "rgba(255, 255, 255, 0.8)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
