/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#00DC6C',
        'brand-neon': '#00E575',
        'brand-hover': '#00C25E',
        'brand-foreground': '#000000',
        border: 'var(--card-border)',
        card: 'var(--card)',
        background: 'var(--bg)',
        foreground: 'var(--fg)',
        muted: 'var(--muted-bg)',
        'muted-foreground': 'var(--muted-fg)',
        // Light mode surfaces
        'surface-light': '#ffffff',
        'border-light': '#e2e8f0',
        'muted-light': '#f1f5f9',
        'muted-fg-light': '#64748b',
        'card-light': '#ffffff',
        // Dark mode surfaces (Obsidian / Slate)
        'surface-dark': '#090d16',
        'border-dark': 'rgba(255, 255, 255, 0.07)',
        'muted-dark': '#131826',
        'muted-fg-dark': '#94a3b8',
        'card-dark': '#0d111a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
