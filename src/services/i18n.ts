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
  return path.startsWith('/en') ? languages[1] : languages[0]
}

export const useI18n = (path: string) => {
  const currentLanguage = getCurrentLanguage(path)

  const t = (key: string, fallback: string) => {
    return locales[currentLanguage.id][key] ?? fallback
  }

  return { t, currentLanguage }
}
