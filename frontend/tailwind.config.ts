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
        'brand-base': '#F9FAFB',     // gray-50
        'brand-surface': '#FFFFFF',  // white
        'brand-border': '#E5E7EB',   // gray-200
        'accent-primary': '#4F46E5', // indigo-600
        'accent-amber': '#F59E0B',   // amber-500
        'text-base': '#111827',      // gray-900
        'text-muted': '#6B7280',     // gray-500
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
      }
    },
  },
  plugins: [],
}
