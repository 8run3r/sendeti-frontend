import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coral:  '#F7A072',
        purple: '#C874D9',
        pink:   '#E1BBC9',
        mint:   '#E2FCEF',
        cream:  '#FDF8F3',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans:    ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
