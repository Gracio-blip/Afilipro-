import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a0e1a',
        accent: '#e6b422',
        dark: '#0f1419',
        surface: '#1a1f2e',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-sora)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'fade-top': 'linear-gradient(to bottom, rgba(10, 14, 26, 0.8), transparent)',
        'fade-bottom': 'linear-gradient(to top, rgba(10, 14, 26, 0.8), transparent)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'pop-in': 'pop-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
