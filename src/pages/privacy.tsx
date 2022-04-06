import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import { promises as fs } from 'fs'
import MarkdownIt from 'markdown-it'
import styles from '../assets/privacy.module.css'
import { Heading, Box, Button } from '@chakra-ui/react'

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

      <Heading textAlign="center" my="4rem">
        TechTalkプライバシーポリシー
      </Heading>

      <Box
        maxW="80%"
        className={styles.markdown}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <Box textAlign="center" my="4rem">
        <NextLink href="/" passHref>
          <Button colorScheme="accent" as="a">
            トップに戻る
          </Button>
        </NextLink>
      </Box>
    </>
  )
}
export default Privacy

export const getStaticProps: GetStaticProps = async () => {
  const content = await fs.readFile('public/privacy.md')
  const md = new MarkdownIt()
  return {
    props: {
      content: md.render(content.toString())
    }
  }
}
