/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF8',
          100: '#FAF8F5',
          200: '#F3EFE6',
          300: '#EAE3D2',
          400: '#DDD5BF',
        },
        tribo: {
          orange: '#F95721',
          'orange-hover': '#E24510',
          'orange-light': '#FFF2EC',
          'orange-border': '#FED7AA',
          navy: '#1E293B',
          muted: '#64748B',
          card: '#FFFFFF',
          border: '#E8E4DA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
