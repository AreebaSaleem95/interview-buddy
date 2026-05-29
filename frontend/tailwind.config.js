/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#04060F",
        surface: {
          DEFAULT: "#090E1C",
          elevated: "#101728",
        },
        border: "#1C2645",
        text: {
          primary: "#EEF2FF",
          secondary: "#8B9FCB",
          muted: "#3F4F6A",
        },
        primary: {
          DEFAULT: "#6366F1",
          hover: "#4F46E5",
          light: "#1E1B4B",
        },
        secondary: {
          DEFAULT: "#38BDF8",
          hover: "#0EA5E9",
        },
        success: "#34D399",
        warning: "#FBBF24",
        error: "#F87171",
        info: "#60A5FA",
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)",
        "gradient-brand-subtle":
          "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.15) 100%)",
        "gradient-surface":
          "linear-gradient(180deg, #090E1C 0%, #04060F 100%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(16,23,40,0) 100%)",
        "gradient-hero":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.25) 0%, transparent 70%)",
      },
      boxShadow: {
        brand: "0 0 40px rgba(99,102,241,0.2)",
        "brand-sm": "0 0 20px rgba(99,102,241,0.15)",
        card: "0 4px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(99,102,241,0.06)",
        "card-hover": "0 8px 48px rgba(0,0,0,0.6), 0 1px 0 rgba(99,102,241,0.12)",
        glow: "0 0 60px rgba(99,102,241,0.3)",
        "glow-sm": "0 0 24px rgba(99,102,241,0.2)",
        inner: "inset 0 1px 0 rgba(255,255,255,0.04)",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [],
};
