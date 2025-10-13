import { TextReveal } from '~/components/TextRevail'
import { Heading } from '~/components/typography'
import CoverPage from '~/routes/_public+/($lang)._index/components/CoverPage'

export const HeroPage = () => {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: anchor links are handled by the CoverPage component
    <CoverPage id="hero" bgImage="/images/hero.webp" className="text-center">
      <Heading size="5xl">
        <TextReveal text="Tech talks," />
        <TextReveal text="Value matters" className="text-primary" delay={0.5} />
      </Heading>
      <TextReveal
        className="text-lg"
        text="技術を語り、価値を創る。"
        delay={2}
        isLastLine
      />
    </CoverPage>
  )
}
