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
        basePath = basePath.slice(loc.length + 1)
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" aria-label="Language" variant="outline">
          {t(locale, locale)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {locales.map((lang) => (
          <DropdownMenuItem key={lang} asChild>
            <Link to={getPathForLocale(lang)} reloadDocument>
              {t(lang, lang)}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default LanguageSwitcher
