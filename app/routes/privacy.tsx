import { Box, Button, Container, Heading } from '@chakra-ui/react'
import { Link } from '@remix-run/react'
import type { V2_MetaFunction } from '@vercel/remix'
import Content from '~/assets/privacy.md'
import styles from '~/styles/privacy.css'

export const meta: V2_MetaFunction = () => [
  {
    title: 'プライバシーポリシー - TechTalk',
  },
]

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

const Privacy = () => {
  return (
    <>
      <Heading textAlign="center" my="4rem">
        TechTalkプライバシーポリシー
      </Heading>

      <Container className="markdown">
        <Content />

        <Box textAlign="center" my="4rem">
          <Link to="/">
            <Button colorScheme="accent">トップに戻る</Button>
          </Link>
        </Box>
      </Container>
    </>
  )
}
export default Privacy
