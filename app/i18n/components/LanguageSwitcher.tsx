import { href, Link } from 'react-router'
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" aria-label="Language" variant="outline">
          {t(locale, locale)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {locales.map((e) => (
          <DropdownMenuItem key={e} asChild>
            <Link
              to={e === 'ja' ? href('/') : href('/:lang?', { lang: e })}
              reloadDocument
            >
              {t(e, e)}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default LanguageSwitcher
