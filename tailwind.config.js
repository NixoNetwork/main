/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'space-black': '#060818',
        'space-blue': '#0F1A40',
        'space-purple': '#2D0A5A',
        'nixo-green': {
          light: '#8dc73c',
          DEFAULT: '#8dc73c',
          dark: '#8dc73c'
        },
        'nixo-teal': '#2BFFE2',
        'panel': {
          DEFAULT: 'rgba(20, 20, 26, 0.8)',
          light: 'rgba(30, 30, 40, 0.6)'
        }
      },
      fontFamily: {
        'sans': ['Space Grotesk', 'sans-serif'],
        'display': ['Satoshi', 'sans-serif'],
        'satoshi': ['Satoshi', 'sans-serif'],
      },
      backgroundImage: {
        'space': "url('/src/assets/space-bg.jpg')",
        'popup-bg': "url('/src/assets/popup-bg.jpg')"
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'particles': 'particles 15s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { filter: 'brightness(1)' },
          '100%': { filter: 'brightness(1.3)' }
        },
        particles: {
          '0%': { transform: 'translateY(0) rotate(0deg)' },
          '100%': { transform: 'translateY(-2000px) rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
};