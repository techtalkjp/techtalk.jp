/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import ChatUserCard from '@/features/chat/components/ChatUserCard'
import ChatMessagePanel from '@/features/chat/components/ChatMessagePanel'
import { Container, Stack } from '@chakra-ui/react'

const Home: NextPage = () => {
  return (
    <Container maxW="container.xl" my="2">
      <Stack>
        <ChatUserCard />
        <ChatMessagePanel />
      </Stack>
    </Container>
  )
}
export default Home
