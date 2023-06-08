import createEmotionCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { RemixBrowser } from '@remix-run/react'
import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

const hydrate = () => {
  const emotionCache = createEmotionCache({ key: 'css' })

  startTransition(() => {
    hydrateRoot(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      document.getElementById('root')!,
      <StrictMode>
        <CacheProvider value={emotionCache}>
          <RemixBrowser />
        </CacheProvider>
      </StrictMode>,
    )
  })
}

if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(hydrate)
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1)
}
