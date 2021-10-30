module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './entities/**/*.{js,ts,jsx,tsx}', './shared/**/*.{js,ts,jsx,tsx}', './features/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    fontFamily: {
      body: ['spratregular', "Times New Roman", "Times", "serif"],
      serif: ['spratregular', "Times New Roman", "Times", "serif"],
    },
    extend: {
      colors: {
        brand: '#FC4949',
        bgGray: '#C3C3C3',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
