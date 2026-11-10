/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#002548',
          dark: '#001830',
          light: '#0a3560',
          container: '#173b63',
        },
        secondary: {
          DEFAULT: '#2060a3',
          dark: '#16487e',
          light: '#357bc9',
        },
        tertiary: {
          DEFAULT: '#002a26',
          light: '#0a423d',
        },
        accent: {
          warning: '#f59e0b',
          success: '#10b981',
          danger: '#ba1a1a',
        },
        surface: {
          DEFAULT: '#ffffff',
          soft: '#f8f9ff',
          muted: '#eef2f8',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 37, 72, 0.05), 0 1px 3px rgba(0, 37, 72, 0.04)',
        'card-hover': '0 8px 25px rgba(0, 37, 72, 0.09), 0 3px 6px rgba(0, 37, 72, 0.05)',
        'modal': '0 20px 45px rgba(0, 24, 48, 0.25)',
      }
    },
  },
  plugins: [],
}

