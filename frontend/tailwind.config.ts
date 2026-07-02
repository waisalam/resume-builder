export default {
  theme: {
    extend: {
      colors: {
        "accent-red": "#E63946",
        "dark-bg": "#0A0A0A",
        "dark-surface": "#121212",
        "white-primary": "#FFFFFF",
        "white-secondary": "#E0E0E0",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-red": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(230, 57, 70, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 8px 2px rgba(230, 57, 70, 0.6)",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease",
        "slide-up": "slide-up 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease",
        "pulse-red": "pulse-red 2s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
