module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './entities/**/*.{js,ts,jsx,tsx}',
    './shared/**/*.{js,ts,jsx,tsx}',
    './features/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      body: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      title: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        brand: 'var(--brand-color)',
        bgGray: '#C3C3C3',
      },
      height: {
        'quasi-screen': '70vh',
        row: '300px',
        media: '600px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
}
