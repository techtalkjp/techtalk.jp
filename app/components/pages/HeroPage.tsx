import { Heading } from '~/components/ui'
import { useLocale } from '~/features/i18n/hooks/useLocale'
import CoverPage from '../CoverPage'

export const HeroPage = () => {
  const { t } = useLocale()
  return (
    <CoverPage id="hero" bgImage="/images/hero.webp">
      <Heading size="5xl">
        Technically,
        <br />
        <p className="text-primary">It&apos;s possible.</p>
      </Heading>
      <p className="text-lg">
        {t('hero.subcopy', 'ビジネスを可能にする、技術の話を。')}
      </p>
    </CoverPage>
  )
}
