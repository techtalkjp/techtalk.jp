import { createContext } from 'react'

import createCache from '@emotion/cache'

export interface ServerStyleContextData {
  key: string
  ids: Array<string>
  css: string
}

export const ServerStyleContext = createContext<
  ServerStyleContextData[] | null
>(null)

export interface ClientStyleContextData {
  reset: () => void
}

export const ClientStyleContext = createContext<ClientStyleContextData | null>(
  null
)

export function createEmotionCache() {
  return createCache({ key: 'css' })
}
