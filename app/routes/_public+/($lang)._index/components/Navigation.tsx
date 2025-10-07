/** biome-ignore-all lint/correctness/useUniqueElementIds: anchor links are handled by the CoverPage component */
import { Link } from 'react-router'
import { Header } from '~/components/Header'
import { TextReveal } from '~/components/TextRevail'
import { Button } from '~/components/ui'
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
    <Header left={<NavItem id="hero">{t('nav.techtalk', 'TechTalk')}</NavItem>}>
      <NavItem id="about">{t('nav.about', '会社概要')}</NavItem>
      <NavItem id="contact">{t('nav.contact', 'お問い合わせ')}</NavItem>
    </Header>
  )
}

export default Navigation
