import React from 'react'
import { Heading, Text } from '@chakra-ui/react'
import CoverPage from '../components/CoverPage'

const HeroPage: React.FC = () => {
  return (
    <CoverPage id="hero" bgImage="/hero.jpg">
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
      <Text fontSize="lg">ビジネスを可能にする、技術の話を。</Text>
    </CoverPage>
  )
}

export default HeroPage
