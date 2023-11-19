import enLocales from '~/assets/locales/en.json'
import jaLocales from '~/assets/locales/ja.json'

const locales = {
  ja: jaLocales,
  en: enLocales,
}

export const languages = [
  { id: 'ja', label: 'Japanese' },
  { id: 'en', label: 'English' },
]

export const getCurrentLanguage = (path: string) => {
  return languages.find((lang) => path.startsWith(`/${lang.id}`)) || languages[0]
}

export const useI18n = (path: string) => {
  const currentLanguage = getCurrentLanguage(path)

  const t = (key: string, fallback: string) => {
    return locales[key] ?? fallback
  }

  return { t, currentLanguage }
}
