// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Montserrat", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
        sans: ["Raleway", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
        alt: ["Lato", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"], // opzionale
      },
      colors: {
        blue: {
          900: "#1E3A5F",   // usato per header, testi scuri
          500: "#5C88C4",   // accenti medi
          cta: "#004EEB",   // bottone principale / call to action
        },
        gray: {
          900: "#3A3A3A",   // testi secondari
        },
        white: "#FFFFFF",
        background: {
          DEFAULT: "#EDF3FB", // sfondo usato in molte sezioni
          light: "#E6EFF9",   // variante più chiara
        },
        brand: {
          red: "#C0392B",   // highlight rosso (sottolineature, alert)
          accent: "#FF3C38", // bottoni secondari
        },
      },
      borderRadius: {
        xl: "18px",        // per card/bottoni stondati
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,.08)", // ombra morbida
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          lg: "1100px",    // tuo container max
        },
      },
    },
  },
  plugins: [],
}
