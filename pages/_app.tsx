import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import type { AppProps } from 'next/app'
import { Toaster } from 'sonner'

import { SiteMenuDrawer } from '@features/admin/SiteMenuDrawer'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster richColors position="top-center" />
      <SiteMenuDrawer />
      <Component {...pageProps} />
    </>
  )
}
export default MyApp
