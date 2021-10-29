import '../styles/globals.css'
import '../public/fonts/stylesheet.css'
import 'tailwindcss/tailwind.css'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp
