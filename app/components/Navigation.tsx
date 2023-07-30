import { Spacer, Stack } from '~/components/ui'
import LanguageSwitcher from '~/features/i18n/components/LanguageSwitcher'
import { useLocale } from '~/features/i18n/hooks/useLocale'

export const Navigation = () => {
  const { t } = useLocale()
  const scrollTo = (
    id: string,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
    event.preventDefault()
  }

  return (
    <div className="flex p-4 items-center justify-center fixed w-full z-10 text-white font-bold leading-tight">
      <a href="#hero" onClick={(event) => scrollTo('hero', event)}>
        <p className="hover:text-primary cursor-pointer">
          {t('nav.techtalk', 'TechTalk')}
        </p>
      </a>
      <Spacer />
      <Stack direction="horizontal" className="items-center">
        <a href="#about" onClick={(event) => scrollTo('about', event)}>
          <p className="hover:text-primary cursor-pointer">
            {t('nav.about', '会社概要')}
          </p>
        </a>
        <a href="#contact" onClick={(event) => scrollTo('contact', event)}>
          <p className="hover:text-primary cursor-pointer">
            {t('nav.contact', 'お問い合わせ')}
          </p>
        </a>

        <LanguageSwitcher />
      </Stack>
    </div>
  )
}

export default Navigation
