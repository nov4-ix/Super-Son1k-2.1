/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "glitch": "glitch 2s infinite",
        "glitch-1": "glitch-1 0.5s infinite",
        "glitch-2": "glitch-2 0.5s infinite",
        "matrix-fall": "matrix-fall 3s linear infinite",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        "glitch-1": {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(2px, -2px)" },
          "40%": { transform: "translate(-2px, 2px)" },
          "60%": { transform: "translate(-2px, -2px)" },
          "80%": { transform: "translate(2px, 2px)" },
        },
        "glitch-2": {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, -2px)" },
          "40%": { transform: "translate(2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(-2px, 2px)" },
        },
        "matrix-fall": {
          "0%": { top: "-100%" },
          "100%": { top: "100%" },
        },
      },
    },
  },
  plugins: [],
}
