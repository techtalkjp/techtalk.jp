import { HStack, Spacer } from '~/components/ui'
import LanguageSwitcher from '../../../../../src/features/i18n/components/LanguageSwitcher'
import { useLocale } from '~/features/i18n/hooks/useLocale'

export const Navigation = () => {
  const { t } = useLocale()
  const scrollTo = (id: string, event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <HStack className="fixed z-10 w-full py-2 pl-4 pr-4 font-bold text-white sm:pr-8">
      <a href="#hero" onClick={(event) => scrollTo('hero', event)}>
        <p className="cursor-pointer hover:text-primary">{t('nav.techtalk', 'TechTalk')}</p>
      </a>

      <Spacer />
      <HStack>
        <a href="#about" onClick={(event) => scrollTo('about', event)}>
          <p className="cursor-pointer hover:text-primary">{t('nav.about', '会社概要')}</p>
        </a>
        <a href="#contact" onClick={(event) => scrollTo('contact', event)}>
          <p className="cursor-pointer hover:text-primary">{t('nav.contact', 'お問い合わせ')}</p>
        </a>

        <LanguageSwitcher />
      </HStack>
    </HStack>
  )
}

export default Navigation
