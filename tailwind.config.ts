import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'hsl(var(--color-brand) / <alpha-value>)',
          light: '#a855f7',
          dark: '#581c87'
        }
      },
      spacing: {
        '2xs': '0.25rem',
        '3xs': '0.125rem'
      }
    }
  },
  plugins: []
};

export default config;