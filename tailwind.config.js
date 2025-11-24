/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Space Grotesk'", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          dark: "#050714",
          surface: "#0f1324",
          accent: "#6a7bff",
          secondary: "#a1ffed",
          muted: "#8f95b2",
        },
      },
      boxShadow: {
        glow: "0 0 45px rgba(106, 123, 255, 0.35)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
        "hero-radial":
          "radial-gradient(circle at top, rgba(161,255,237,0.25), transparent 55%)",
      },
    },
  },
  plugins: [],
};
