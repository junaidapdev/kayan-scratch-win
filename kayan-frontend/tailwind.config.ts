import type { Config } from 'tailwindcss';
import tailwindcssRtl from 'tailwindcss-rtl';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Kayan brand red — placeholder values, tune to the final brand palette.
        brand: {
          DEFAULT: '#B11116',
          50: '#FDECEC',
          100: '#FAD2D4',
          200: '#F29CA0',
          300: '#E9666C',
          400: '#D83038',
          500: '#B11116',
          600: '#8E0D12',
          700: '#6A0A0D',
          800: '#470609',
          900: '#230304',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          '"Noto Sans Arabic"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [tailwindcssRtl],
};

export default config;
