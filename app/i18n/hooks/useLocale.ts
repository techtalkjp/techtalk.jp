import { useLocation } from 'react-router'
import en from '../assets/locales/en.json'
import ja from '../assets/locales/ja.json'
import zhls from '../assets/locales/zhls.json'
import zhlt from '../assets/locales/zhlt.json'
import { detectLocale } from '../utils/detectLocale'
export { locales } from '../utils/detectLocale'

interface LocaleString {
  [key: string]: string
}

const resources: { [key: string]: LocaleString } = {
  ja,
  en,
  zhls,
  zhlt,
}

export const useLocale = () => {
  const location = useLocation()
  const locale = detectLocale(location.pathname)

  const t = (id: string, fallback: string) => {
    return resources[locale]?.[id] ?? fallback
  }

  return { locale, t }
}
