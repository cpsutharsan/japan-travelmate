import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        paper: '#faf7f2',
        ink: '#1a1a1a',
        vermilion: '#d23a2c',
        indigo: '#1e3a5f',
        gold: '#c8a951',
        sage: '#7a8471',
      },
      fontFamily: {
        display: ['var(--font-shippori)', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jet)', 'ui-monospace', 'monospace'],
        jp: ['var(--font-noto-jp)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        paper: '0 1px 2px rgba(26,26,26,0.04), 0 4px 12px rgba(26,26,26,0.04)',
      },
    },
  },
  plugins: [],
}

export default config
