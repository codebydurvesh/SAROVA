/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SAVORA Brand Colors - Minimal, premium, calm theme
        savora: {
          brown: {
            50: '#faf8f5',
            100: '#f3efe8',
            200: '#e6ddd0',
            300: '#d4c5af',
            400: '#bfa88a',
            500: '#a98e6d',
            600: '#8f7456',
            700: '#735c46',
            800: '#5f4c3b',
            900: '#4f4033',
          },
          beige: {
            50: '#fdfcfa',
            100: '#f9f6f1',
            200: '#f3ece1',
            300: '#e8dcc8',
            400: '#d9c7a8',
            500: '#c9b18a',
            600: '#b39869',
            700: '#937a51',
            800: '#786444',
            900: '#62533a',
          },
          green: {
            50: '#f4f7f4',
            100: '#e6ece6',
            200: '#cdd9cd',
            300: '#a8bfa8',
            400: '#7d9c7d',
            500: '#5c7f5c',
            600: '#476647',
            700: '#3a523a',
            800: '#314431',
            900: '#293929',
          },
          cream: '#faf8f5',
          sand: '#e8dcc8',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a8bfa8' fill-opacity='0.08'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
