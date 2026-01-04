/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-1': 'var(--color-bg-1)',
        'bg-2': 'var(--color-bg-2)',
        'card': 'var(--color-card)',
        'muted': 'var(--color-muted)',
        'primary': 'var(--text-primary)',
        'secondary': 'var(--text-secondary)',
        'border-subtle': 'var(--border-subtle)',
        'hover-bg': 'var(--hover-bg)',
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
      }
    },
  },
  plugins: [],
}

