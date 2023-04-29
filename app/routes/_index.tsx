import { Box, chakra } from '@chakra-ui/react'
import { Navigation } from '~/components/Navigation'
import { AboutPage, ContactPage, HeroPage } from '~/components/pages'

export default function Index() {
  return (
    <Box position="relative" w="100vw" h="100vh">
      <Navigation />

      <chakra.main
        height="100vh"
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
