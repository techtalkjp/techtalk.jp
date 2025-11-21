import { useLocation } from 'react-router'
import en from '../assets/locales/en.json'
import { detectLocale } from '../utils/detectLocale'
export { locales } from '../utils/detectLocale'

interface LocaleString {
  [key: string]: string
}

const resources: { [key: string]: LocaleString } = {
  en,
}

export const useLocale = () => {
  const location = useLocation()
  const locale = detectLocale(location.pathname)

  const t = (_key: string, jaText: string) => {
    // 日本語の場合はそのまま日本語を返す
    if (locale === 'ja') {
      return jaText
    }
    // 英語の場合は日本語をキーとして英語訳を取得、なければ日本語をそのまま返す
    return resources[locale]?.[jaText] ?? jaText
  }

  return { locale, t }
}
