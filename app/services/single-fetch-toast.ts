import type { LoaderFunctionArgs } from '@remix-run/node'
import {
  jsonWithError as origJsonWithError,
  jsonWithSuccess as origJsonWithSuccess,
} from 'remix-toast'

export const jsonWithSuccess = async <T>(
  response: LoaderFunctionArgs['response'],
  data: T,
  messageOrToast: Parameters<typeof origJsonWithSuccess>[1],
  init?: Parameters<typeof origJsonWithSuccess>[2],
  customSession?: Parameters<typeof origJsonWithSuccess>[3],
) => {
  const originalResponse = await origJsonWithSuccess(
    data,
    messageOrToast,
    init,
    customSession,
  )
  const cookie = originalResponse.headers.get('Set-Cookie')
  if (cookie) {
    response?.headers.set('Set-Cookie', cookie)
  }
  return data
}

export const jsonWithError = async <T>(
  response: LoaderFunctionArgs['response'],
  data: T,
  messageOrToast: Parameters<typeof origJsonWithError>[1],
  init?: Parameters<typeof origJsonWithError>[2],
  customSession?: Parameters<typeof origJsonWithError>[3],
) => {
  const originalResponse = await origJsonWithError(
    data,
    messageOrToast,
    init,
    customSession,
  )
  const cookie = originalResponse.headers.get('Set-Cookie')
  if (cookie) {
    response?.headers.set('Set-Cookie', cookie)
  }
  return data
}
