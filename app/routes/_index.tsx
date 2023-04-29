import { Box, chakra } from '@chakra-ui/react'
import { Navigation } from '~/components/Navigation'
import { AboutPage, ContactPage, HeroPage } from '~/components/pages'

export default function Index() {
  return (
    <Box position="relative" w="100vw" h="100dvh">
      <Navigation />

      <chakra.main
        height="100dvh"
        scrollSnapType="y mandatory"
        overflowY="scroll"
      >
        <HeroPage />
        <AboutPage />
        <ContactPage />
      </chakra.main>
    </Box>
  )
}
