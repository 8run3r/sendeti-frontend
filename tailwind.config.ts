import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        coral:     '#F7A072',
        violet:    '#C874D9',
        cream:     '#FEF9F4',
        blush:     '#FDEEE5',
        lavender:  '#F3ECFC',
        dark:      '#1C1917',
        muted:     '#78716C',
        border:    '#EBE3F0',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
}
export default config
