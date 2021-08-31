import en from '../assets/locales/en.json'
import ja from '../assets/locales/ja.json'
import { useRouter } from 'next/router'

export const useLocale = () => {
  const { locale, locales } = useRouter()
  const t = (id: string, fallback: string) => {
    const lang: { [key: string]: string } = locale === 'en' ? en : ja
    return lang[id] || fallback
  }
  return { locales: locales || ['ja'], locale: locale || 'ja', t }
}
