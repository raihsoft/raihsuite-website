import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'hsl(var(--color-brand) / <alpha-value>)',
          light: '#5ab0ff',
          dark: '#004a7f'
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