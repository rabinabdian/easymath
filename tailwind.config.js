/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'slide-in-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'slide-in-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'bounce-gentle': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)',
          },
        },
        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'wiggle': {
          '0%, 100%': {
            transform: 'rotate(-3deg)',
          },
          '50%': {
            transform: 'rotate(3deg)',
          },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.6s ease-out',
        'slide-in-left': 'slide-in-left 0.6s ease-out',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scale-in': 'scale-in 0.5s ease-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
