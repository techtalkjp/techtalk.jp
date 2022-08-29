import path from 'path'
import { Box, chakra } from '@chakra-ui/react'
import type { LoaderArgs } from '@remix-run/node'
import { Navigation } from '~/components/Navigation'
import { HeroPage, AboutPage, ContactPage } from '~/components/pages'
import { locales } from '~/features/i18n/utils/detectLocale'

export const loader = ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  if (!locales.includes(path.basename(url.pathname)))
    throw new Response('Not Found', { status: 404 })
  return {}
}

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
