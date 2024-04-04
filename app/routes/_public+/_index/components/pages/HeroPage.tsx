import { TextReveal } from '~/components/TextRevail'
import { Heading } from '~/components/ui'
import { useLocale } from '~/i18n/hooks/useLocale'
import CoverPage from '~/routes/_public+/_index/components/CoverPage'

export const HeroPage = () => {
  const { t } = useLocale()
  return (
    <CoverPage id="hero" bgImage="/images/hero.webp" className="text-center">
      <Heading size="5xl">
        <TextReveal text="Technically," />
        <TextReveal
          text="It's possible."
          className="text-primary"
          delay={0.5}
        />
      </Heading>
      <TextReveal
        className="text-lg"
        text={t('hero.subcopy', 'ビジネスを可能にする、技術の話を。')}
        delay={2}
        isLastLine
      />
    </CoverPage>
  )
}
