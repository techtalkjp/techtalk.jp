import { Heading } from '~/components/ui/heading'
import { useLocale } from '~/features/i18n/hooks/useLocale'
import CoverPage from '~/routes/_index/components/CoverPage'

export const HeroPage = () => {
  const { t } = useLocale()
  return (
    <CoverPage id="hero" bgImage="/images/hero.webp">
      <Heading size="5xl">
        Technically,
        <br />
        <span className="text-primary">It&apos;s possible.</span>
      </Heading>
      <p className="text-lg">{t('hero.subcopy', 'ビジネスを可能にする、技術の話を。')}</p>
    </CoverPage>
  )
}
