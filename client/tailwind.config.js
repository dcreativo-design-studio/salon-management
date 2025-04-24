// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#d48a98',
            dark: '#b06978',
            light: '#f3d0d7',
          },
          secondary: {
            DEFAULT: '#6b8e9e',
            dark: '#4c6c7a',
            light: '#b6d0da',
          },
          accent: {
            DEFAULT: '#d4b89e',
            dark: '#b09378',
            light: '#e8d9c9',
          },
          neutral: {
            100: '#ffffff',
            200: '#f9f7f8',
            300: '#e9e2e4',
            400: '#d4ccd0',
            500: '#9e959a',
            600: '#6a6167',
            700: '#453e42',
            800: '#2a2527',
            900: '#1a1617',
          },
        },
        fontFamily: {
          sans: ['Poppins', 'sans-serif'],
          serif: ['Playfair Display', 'serif'],
        },
        spacing: {
          '128': '32rem',
          '144': '36rem',
        },
        borderRadius: {
          'xl': '1rem',
          '2xl': '2rem',
        },
        boxShadow: {
          'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
          'inner-soft': 'inset 0 2px 5px 0 rgba(0, 0, 0, 0.05)',
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in forwards',
          'slide-up': 'slideUp 0.5s ease-out forwards',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUp: {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'salon-pattern': "url('/src/assets/images/salon-pattern.svg')",
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('@tailwindcss/aspect-ratio'),
    ],
  }
