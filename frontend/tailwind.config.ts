/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-base": "#0A0A0A", // Deep dark background
        "brand-surface": "#141414", // Slightly lighter dark
        "brand-border": "#262626", // Dark gray borders
        "accent-primary": "#FFFFFF", // White buttons
        "accent-dark": "#1F1F1F", // Dark buttons
        "text-base": "#FFFFFF", // White text
        "text-muted": "#A3A3A3", // Gray text
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "-apple-system", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle, #333333 1px, transparent 1px)',
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.1)" },
        },
        "glow-reverse": {
          "0%, 100%": { opacity: "0.8", transform: "scale(1.1)" },
          "50%": { opacity: "0.4", transform: "scale(1)" },
        }
      },
      animation: {
        "slide-in": "slide-in 0.3s ease-out",
        "glow": "glow 6s ease-in-out infinite",
        "glow-reverse": "glow-reverse 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
