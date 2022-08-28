import { match } from 'ts-pattern'

export const locales = ['ja', 'en', 'zhls', 'zhlt']

export const detectLocale = (pathname: string) =>
  match(pathname)
    .when(
      (path) => locales.find((locale) => path.endsWith(`/${locale}`)),
      (path) => locales.find((locale) => path.endsWith(`/${locale}`))
    )
    .otherwise(() => locales[0])!
