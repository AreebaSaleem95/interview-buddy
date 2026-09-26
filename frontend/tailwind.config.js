/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'Fira Code'", "monospace"],
      },
      colors: {
        background: {
          DEFAULT: "#090D16",
          dark: "#06090F",
          light: "#0F172A",
        },
        surface: {
          DEFAULT: "#0F172A",
          elevated: "#1E293B",
          dark: "#0B0F19",
          hover: "#1E293B",
        },
        border: {
          DEFAULT: "#1E293B",
          light: "#334155",
          dark: "#1E293B",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#CBD5E1",
          muted: "#94A3B8",
          dark: "#F8FAFC",
          mutedDark: "#64748B",
        },
        primary: {
          DEFAULT: "#6366F1",
          hover: "#4F46E5",
          light: "#818CF8",
          dark: "#4338CA",
        },
        secondary: {
          DEFAULT: "#8B5CF6",
          hover: "#7C3AED",
          light: "#A78BFA",
        },
        success: {
          DEFAULT: "#10B981",
          light: "#34D399",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
        },
        error: {
          DEFAULT: "#EF4444",
          light: "#F87171",
        },
        info: {
          DEFAULT: "#38BDF8",
          light: "#7DD3FC",
        },
        brand: {
          DEFAULT: "#6366F1",
          600: "#4F46E5",
          500: "#6366F1",
          400: "#818CF8",
          300: "#A5B4FC",
          100: "#E0E7FF",
          50: "#EEF2FF",
        },
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)",
        "gradient-brand-subtle":
          "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.12) 100%)",
        "gradient-surface":
          "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.6) 100%)",
        "gradient-hero":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.25) 0%, transparent 70%)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        brand: "0 0 35px rgba(99,102,241,0.35)",
        "brand-sm": "0 0 18px rgba(99,102,241,0.22)",
        card: "0 10px 30px -10px rgba(0,0,0,0.5), 0 0 1px 1px rgba(255,255,255,0.06)",
        "card-hover": "0 20px 40px -15px rgba(0,0,0,0.6), 0 0 25px rgba(99,102,241,0.18)",
        glow: "0 0 50px rgba(139,92,246,0.3)",
        "glow-sm": "0 0 20px rgba(99,102,241,0.25)",
        premium: "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(99,102,241,0.15)",
        inner: "inset 0 1px 0 rgba(255,255,255,0.1)",
        "inner-soft": "inset 0 2px 8px rgba(0,0,0,0.3)",
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
