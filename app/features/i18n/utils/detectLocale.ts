export const locales = ['ja', 'en']

export const detectLocale = (path: string) =>
  locales.find((locale) => path.endsWith(`/${locale}`)) || 'ja'
