import { Link } from '@remix-run/react'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui'
import { locales, useLocale } from '~/features/i18n/hooks/useLocale'

const LanguageSwitcher = () => {
  const { t, locale } = useLocale()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="xs"
          aria-label="Language"
          variant="outline"
          className="bg-transparent"
        >
          {t(locale, locale)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {locales.map((e) => (
          <DropdownMenuItem key={e} asChild>
            <Link to={e === 'ja' ? '/' : `/${e}`}>{t(e, e)}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default LanguageSwitcher
