/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
  extend: {
    keyframes: {
      growUp: {
        '0%': { transform: 'scaleY(0)' },
        '100%': { transform: 'scaleY(1)' },
      },
      wiggle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(0.5rem)' },
        },
    },
    animation: {
      growUp: 'growUp 0.6s ease-out forwards',
       wiggle: 'wiggle 1s ease-in-out infinite',
    },
    transformOrigin: {
      'bottom': 'bottom',
    },
  },
},
 plugins: [],
}

