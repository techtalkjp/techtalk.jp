import { Link } from 'react-router'
import { TextReveal } from '~/components/TextRevail'
import { Button, HStack, Spacer } from '~/components/ui'
import LanguageSwitcher from '~/i18n/components/LanguageSwitcher'
import { useLocale } from '~/i18n/hooks/useLocale'

const NavItem = ({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) => {
  const scrollTo = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Button
      size="sm"
      className="text-white"
      variant="link"
      asChild
      onClick={(event) => scrollTo(id, event)}
    >
      <Link to={`#${id}`} className="hover:text-primary cursor-pointer">
        <TextReveal text={children?.toString() ?? ''} isLastLine delay={3} />
      </Link>
    </Button>
  )
}

export const Navigation = () => {
  const { t } = useLocale()

  return (
    <HStack className="fixed z-10 w-full py-2 pr-4 pl-4 font-bold sm:pr-8">
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
