import { Link } from '@remix-run/react'
import { Button, HStack, Spacer } from '~/components/ui'
import LanguageSwitcher from '~/features/i18n/components/LanguageSwitcher'
import { useLocale } from '~/features/i18n/hooks/useLocale'

const NavItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const scrollTo = (id: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    event.stopPropagation()
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Button size="xs" variant="ghost" asChild onClick={(event) => scrollTo(id, event)}>
      <Link to={`#${id}`} className="cursor-pointer hover:text-primary">
        {children}
      </Link>
    </Button>
  )
}

export const Navigation = () => {
  const { t } = useLocale()

  return (
    <HStack className="fixed z-10 w-full py-2 pl-4 pr-4 font-bold text-white sm:pr-8">
      <NavItem id="hero">{t('nav.techtalk', 'TechTalk')}</NavItem>

      <Spacer />
      <HStack>
        <NavItem id="about">{t('nav.about', '会社概要')}</NavItem>
        <NavItem id="contact">{t('nav.contact', 'お問い合わせ')}</NavItem>
        <LanguageSwitcher />
      </HStack>
    </HStack>
  )
}

export default Navigation
