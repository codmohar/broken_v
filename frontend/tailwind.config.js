/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sidebar': '#1B3C2D',
        'sidebar-hover': '#24503B',
        'sidebar-active': '#2B5F45',
        'main-bg': '#F0F2F1',
        'card': '#FFFFFF',
        'card-border': '#E5E7EB',
        'heading': '#111827',
        'body': '#4B5563',
        'muted': '#9CA3AF',
        'label': '#6B7280',
        'green-accent': '#16A34A',
        'green-light': '#F0FDF4',
        'green-border': '#BBF7D0',
        'green-dark': '#166534',
        'blue-bar': '#1E40AF',
        'red-accent': '#DC2626',
        'red-bar': '#7F1D1D',
        'amber-accent': '#D97706',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
