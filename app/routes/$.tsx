import { Box, chakra } from '@chakra-ui/react'
import { Navigation } from '~/components/Navigation'
import { HeroPage, AboutPage, ContactPage } from '~/components/pages'

export default function Index() {
  console.log('IndexPage', typeof window)

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
