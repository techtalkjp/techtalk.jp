import { useLocation } from '@remix-run/react'
import { match } from 'ts-pattern'
import en from '~/assets/locales/en.json'
import ja from '~/assets/locales/ja.json'

export const useLocale = () => {
  const location = useLocation()
  const locales = ['ja', 'en', 'zhls', 'zhlt']

  const locale = match(location.pathname)
    .when(
      (path) => locales.find((locale) => path.endsWith(`/${locale}`)),
      (path) => locales.find((locale) => path.endsWith(`/${locale}`))
    )
    .otherwise(() => 'ja') // デフォルトは日本語

  const t = (id: string, fallback: string) => {
    const lang: { [key: string]: string } = locale === 'en' ? en : ja
    return lang[id] || fallback
  }

  return { locales: locales, locale, t }
}
