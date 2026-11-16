/** Paleta y tipografía tomadas de la guía de estilo de los mockups (Parte II) */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        plum: "#2A1D31",
        bruja: { DEFAULT: "#5D417C", 700: "#4B3366", 300: "#B9A3CF", 200: "#DCCFE8", 100: "#F1EAF6", 50: "#F8F4FB" },
        rosa: { DEFAULT: "#FFC3B9", 200: "#FFD9D2", 100: "#FFE9E4", 50: "#FFF6F3" },
        carmin: { DEFAULT: "#C82255", 700: "#A51A45", 50: "#FDECF1" },
      },
      fontFamily: {
        display: ["Cinzel", "serif"],
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
