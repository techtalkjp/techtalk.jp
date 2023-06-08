import { Box, ChakraProvider, Heading } from '@chakra-ui/react'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import type { LinksFunction, V2_MetaFunction } from '@vercel/remix'
import { createHead } from 'remix-island'
import biographyStyle from '~/styles/biography.css'
import privacyStyles from '~/styles/privacy.css'
import { theme } from './theme'

export const meta: V2_MetaFunction = () => {
  return [{ title: '株式会社TechTalk' }]
}

export const Head = createHead(() => (
  <>
    <Meta />
    <Links />
  </>
))

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: privacyStyles },
    { rel: 'stylesheet', href: biographyStyle },
  ]
}

export default function App() {
  return (
    <>
      <Head />
      <ChakraProvider theme={theme} resetCSS>
        <Outlet />
      </ChakraProvider>
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <>
      <Head />
      <ChakraProvider theme={theme} resetCSS>
        <Box>
          <Heading as="h1" bg="blue.500">
            [Error]: There was an error: {String(error)}
          </Heading>
        </Box>
      </ChakraProvider>
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </>
  )
}
