import type { NextPage } from 'next'
import Head from 'next/head'
import { chakra } from '@chakra-ui/react'
import { useLocale } from '../utils/useLocale'
import DefaultLayout from '../layouts/DefaultLayout'
import HeroPage from '../components/HeroPage'
import AboutPage from '../components/AboutPage'
import ContactPage from '../components/ContactPage'

const Home: NextPage = () => {
  const { t } = useLocale()
  return (
    <DefaultLayout>
      <Head>
        <title>{t('techtalkinc', '株式会社 TechTalk')}</title>
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
