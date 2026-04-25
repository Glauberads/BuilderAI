/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        whatsapp: "rgb(var(--brand-primary) / <alpha-value>)",
        text: "#F8F8F8",
        card: "#1A1A2E",
        "brand-primary": "rgb(var(--brand-primary) / <alpha-value>)",
        "brand-secondary": "rgb(var(--brand-secondary) / <alpha-value>)",
        "brand-accent": "rgb(var(--brand-accent) / <alpha-value>)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(249, 115, 22, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
