import { CacheProvider } from '@emotion/react'
import { RemixBrowser } from '@remix-run/react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { ClientStyleContext, createEmotionCache } from './context'

interface ClientCacheProviderProps {
  children: ReactNode
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = useState(createEmotionCache())

  function reset() {
    setCache(createEmotionCache())
  }

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  )
}

hydrateRoot(
  document,
  <ClientCacheProvider>
    <RemixBrowser />
  </ClientCacheProvider>
)
