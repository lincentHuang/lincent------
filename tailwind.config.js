/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        framer: {
          bg: '#08090C',
          card: '#0E1015',
          cardHover: '#141721',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.16)',
          subtext: '#8B949E',
          cyan: '#00F0FF',
          violet: '#8B5CF6',
          indigo: '#6366F1',
          amber: '#F59E0B',
          coral: '#FF4D4D',
          emerald: '#10B981',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'framer-card': '0 0 0 1px rgba(255, 255, 255, 0.08), 0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        'framer-glow-cyan': '0 0 40px -10px rgba(0, 240, 255, 0.35)',
        'framer-glow-violet': '0 0 40px -10px rgba(139, 92, 246, 0.35)',
        'framer-glow-amber': '0 0 40px -10px rgba(245, 158, 11, 0.35)',
        'framer-glow-coral': '0 0 40px -10px rgba(255, 77, 77, 0.35)',
        'framer-glow-emerald': '0 0 40px -10px rgba(16, 185, 129, 0.35)',
      },
      backgroundImage: {
        'framer-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.25), transparent)',
        'rainbow-gradient': 'linear-gradient(90deg, #00F0FF, #8B5CF6, #F59E0B, #FF4D4D)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '0.4' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      }
    },
  },
  plugins: [],
};
