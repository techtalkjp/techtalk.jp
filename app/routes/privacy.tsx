import styles from '~/styles/privacy.css'
import { Heading, Box, Button, Container } from '@chakra-ui/react'
import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import Content from '~/assets/privacy.md'

export const meta: MetaFunction = () => ({
  title: 'プライバシーポリシー - TechTalk'
})

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

const Privacy = () => {
  return (
    <>
      <Heading textAlign="center" my="4rem">
        TechTalkプライバシーポリシー
      </Heading>

      <Container>
        <Content />

        <Box textAlign="center" my="4rem">
          <Link to="/">
            <Button colorScheme="accent" as="a">
              トップに戻る
            </Button>
          </Link>
        </Box>
      </Container>
    </>
  )
}
export default Privacy
