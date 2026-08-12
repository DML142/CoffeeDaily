/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "16px",
        sm: "24px",
        lg: "40px",
        xl: "64px",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": [
          "clamp(2.75rem, 8vw, 7rem)",
          { lineHeight: "0.95", letterSpacing: "-0.02em", fontWeight: "500" },
        ],
        "display-l": [
          "clamp(2rem, 5vw, 4rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "500" },
        ],
        "display-m": [
          "clamp(1.5rem, 3vw, 2.25rem)",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "500" },
        ],
        "body-l": ["1.125rem", { lineHeight: "1.5" }],
        body: ["1rem", { lineHeight: "1.5" }],
        "body-s": ["0.875rem", { lineHeight: "1.5" }],
        label: ["0.75rem", { fontWeight: "500", letterSpacing: "0.08em" }],
      },
      colors: {
        "cd-ink": "#101114",
        "cd-ink-2": "#1A1B1E",
        "cd-ink-mute": "#6E6A65",
        "cd-cream": "#F2EBE0",
        "cd-paper": "#E6E2DC",
        "cd-paper-warm": "#F5F1EC",
        "cd-orange": "#C1552E",
        "cd-orange-hot": "#E85A2A",
        "cd-orange-deep": "#8F3C1E",
        "cd-line": "#D2CCC4",
        "cd-success": "#2E7D4F",
        "cd-danger": "#C1341B",
      },
    },
  },
};
