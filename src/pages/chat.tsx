/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import ChatUserCard from '@/features/chat/components/ChatUserCard'
import ChatMessagePanel from '@/features/chat/components/ChatMessagePanel'
import { Container, Stack } from '@chakra-ui/react'

const Home: NextPage = () => {
  return (
    <Container
      maxW="container.xl"
      my="2"
      maxH="100vh"
      overflow="auto"
      display="flex"
      flexDirection="column"
    >
      <ChatUserCard />
      <ChatMessagePanel flex="1" />
    </Container>
  )
}
export default Home
