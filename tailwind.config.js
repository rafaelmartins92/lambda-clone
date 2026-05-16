/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Suisse Intl"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"Suisse Intl Mono"', '"Courier New"', 'monospace'],
        pixel: ['"apkarchivr21"', 'monospace'],
      },
      colors: {
        terminal: '#0B0B0B',
        'terminal-deep': '#000000',
        shell: '#E7E6D9',
        ultraviolet: '#6236F4',
        'neutral-800': '#262625',
        'neutral-700': '#42413e',
        'neutral-600': '#5e5d58',
        'neutral-500': '#797872',
        'neutral-400': '#95948c',
        'neutral-300': '#b0afa6',
      },
      screens: {
        xs: '480px',
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        widest: '0.05em',
      },
      lineHeight: {
        none: '100%',
        tight: '110%',
        snug: '120%',
        relaxed: '150%',
      },
    },
  },
  plugins: [],
}

