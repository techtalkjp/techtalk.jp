import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import { promises as fs } from 'fs'
import marked from 'marked'
import styles from '../assets/privacy.module.css'
import { Box, Button } from '@chakra-ui/react'

interface Props {
  content: string
}

const Privacy: NextPage<Props> = ({ content }) => {
  return (
    <>
      <Head>
        <title>プライバシーポリシー - TechTalk</title>
        <meta name="description" content="Technicaly, It's possible." />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={styles.markdown}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <Box textAlign="center" my="4rem">
        <NextLink href="/">
          <Button colorScheme="blue" as="a">
            トップに戻る
          </Button>
        </NextLink>
      </Box>
    </>
  )
}
export default Privacy

export const getStaticProps: GetStaticProps = async () => {
  const content = await fs.readFile('src/assets/privacy.md')
  return {
    props: {
      content: marked(content.toString())
    }
  }
}
