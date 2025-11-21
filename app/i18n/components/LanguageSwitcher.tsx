import { Link, useLocation } from 'react-router'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui'
import { locales, useLocale } from '~/i18n/hooks/useLocale'

const LanguageSwitcher = () => {
  const { t, locale } = useLocale()
  const location = useLocation()

  // Remove current locale from pathname to get the base path
  const getPathForLocale = (targetLocale: string) => {
    let basePath = location.pathname

    // Remove current locale prefix if it exists
    for (const loc of locales) {
      if (loc !== 'ja' && basePath.startsWith(`/${loc}/`)) {
        basePath = basePath.substring(`/${loc}`.length)
        break
      }
      if (loc !== 'ja' && basePath === `/${loc}`) {
        basePath = '/'
        break
      }
    }

    // Add new locale prefix
    if (targetLocale === 'ja') {
      return basePath
    }
    return `/${targetLocale}${basePath === '/' ? '' : basePath}`
  }

  const getLanguageLabel = (lang: string) => {
    if (lang === 'ja') return t('lang.ja', '日本語')
    if (lang === 'en') return t('lang.en', 'English')
    return lang
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" aria-label="Language" variant="outline">
          {getLanguageLabel(locale)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {locales.map((lang) => (
          <DropdownMenuItem key={lang} asChild>
            <Link to={getPathForLocale(lang)} reloadDocument>
              {getLanguageLabel(lang)}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default LanguageSwitcher
