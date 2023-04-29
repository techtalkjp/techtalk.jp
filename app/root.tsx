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
import React from 'react'
import biographyStyle from '~/styles/biography.css'
import privacyStyles from '~/styles/privacy.css'
import { theme } from './theme'

export const meta: V2_MetaFunction = () => {
  return [{ title: '株式会社TechTalk' }]
}

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: privacyStyles },
    { rel: 'stylesheet', href: biographyStyle },
  ]
}

interface DocumentProps {
  children: React.ReactNode
}

const Document = ({ children }: DocumentProps) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <ChakraProvider theme={theme} resetCSS>
        <Outlet />
      </ChakraProvider>
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <ChakraProvider>
        <Box>
          <Heading as="h1" bg="blue.500">
            [Error]: There was an error: {String(error)}
          </Heading>
        </Box>
      </ChakraProvider>
    </Document>
  )
}
