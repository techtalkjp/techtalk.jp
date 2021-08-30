import type { NextPage } from 'next'
import Head from 'next/head'
import { chakra, Heading, Text } from '@chakra-ui/react'
import DefaultLayout from '../layouts/DefaultLayout'
import HeroPage from '../components/HeroPage'
import AboutPage from '../components/AboutPage'
import ContactPage from '../components/ContactPage'

const Home: NextPage = () => {
  return (
    <DefaultLayout>
      <Head>
        <title>株式会社 TechTalk</title>
        <meta name="description" content="Technicaly, It's possible." />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <chakra.main
        height="100vh"
        sx={{ overflowY: 'scroll', scrollSnapType: 'y mandatory' }}
      >
        <HeroPage />
        <AboutPage />
        <ContactPage />
      </chakra.main>
    </DefaultLayout>
  )
}

export default Home
