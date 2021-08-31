import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import '../utils/firebase'
import { getApp } from 'firebase/app'
import { getAnalytics, setCurrentScreen, logEvent } from 'firebase/analytics'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import '../assets/styles.css'

const theme = extendTheme({
  colors: {
    accent: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1',
      600: '#4f46E5',
      700: '#4F46E5',
      800: '#4338CA',
      900: '#312E81'
    }
  },
  fonts: {
    heading: `ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`,
    body: `ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  const routers = useRouter()
  useEffect(() => {
    // firebase analytics
    if (process.env.NODE_ENV === 'production') {
      routers.events.on('routeChangeComplete', logEvent)
      const analytics = getAnalytics(getApp())
      setCurrentScreen(analytics, window.location.pathname)
      logEvent(analytics, 'screen_view')
      return () => {
        routers.events.off('routeChangeComplete', logEvent)
      }
    }
  })

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
export default MyApp
