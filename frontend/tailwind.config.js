/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fun spooky colors with childish appeal
        spooky: {
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
            950: '#3b0764',
          },
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
          },
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
          },
          pink: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
            700: '#be185d',
          },
        },
        dark: {
          950: '#0a0118',
          900: '#1a0b2e',
          800: '#2d1b4e',
          700: '#3d2755',
          600: '#4d3265',
        },
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        spooky: ['Creepster', 'cursive'],
        fun: ['Quicksand', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'page-flip': 'pageFlip 1s ease-in-out',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'swing': 'swing 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'fly-in': 'flyIn 1s ease-out',
        'ghost-float': 'ghostFloat 4s ease-in-out infinite',
        'bat-fly': 'batFly 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 8px currentColor)' },
          '50%': { opacity: 0.7, filter: 'drop-shadow(0 0 16px currentColor)' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(168, 85, 247, 0.8)',
            transform: 'scale(1.02)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pageFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(-180deg)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        swing: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        flyIn: {
          '0%': { transform: 'translate(-100vw, -100vh) rotate(-45deg)', opacity: 0 },
          '100%': { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        },
        ghostFloat: {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px)',
            opacity: 0.7,
          },
          '25%': {
            transform: 'translateY(-15px) translateX(5px)',
            opacity: 0.9,
          },
          '50%': {
            transform: 'translateY(-25px) translateX(0px)',
            opacity: 0.8,
          },
          '75%': {
            transform: 'translateY(-15px) translateX(-5px)',
            opacity: 0.9,
          },
        },
        batFly: {
          '0%': {
            transform: 'translateX(-100vw) translateY(0) scaleX(1)',
          },
          '25%': {
            transform: 'translateX(25vw) translateY(-20px) scaleX(1)',
          },
          '50%': {
            transform: 'translateX(50vw) translateY(-40px) scaleX(-1)',
          },
          '75%': {
            transform: 'translateX(75vw) translateY(-20px) scaleX(-1)',
          },
          '100%': {
            transform: 'translateX(200vw) translateY(0) scaleX(-1)',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'spooky-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'halloween': 'linear-gradient(to bottom, #1a0b2e 0%, #3d2755 50%, #f97316 100%)',
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.6)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.6)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.6)',
        'inner-glow': 'inset 0 0 20px rgba(168, 85, 247, 0.3)',
      },
    },
  },
  plugins: [],
}
