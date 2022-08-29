import { Heading, Text } from '@chakra-ui/react'
import { useLocale } from '~/features/i18n/hooks/useLocale'
import CoverPage from '../CoverPage'

export const HeroPage = () => {
  const { t } = useLocale()
  return (
    <CoverPage id="hero" bgImage="/images/hero.webp">
      <Heading
        fontSize="5xl"
        fontWeight="black"
        lineHeight="1"
        letterSpacing="tight"
        textShadow="5px 5px black 5px"
      >
        Technically,
        <br />
        <Text color="accent.600">It&apos;s possible.</Text>
      </Heading>
      <Text fontSize="lg">
        {t('hero.subcopy', 'ビジネスを可能にする、技術の話を。')}
      </Text>
    </CoverPage>
  )
}
