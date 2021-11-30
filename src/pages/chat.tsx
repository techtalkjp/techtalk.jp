/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import { useAuth } from '@/features/auth/hooks/useAuth'
import AuthSignInWithGoogleButton from '@/features/auth/components/AuthSignInWithGoogleButton'
import AuthSignOutButton from '@/features/auth/components/AuthSignOutButton'
import UserCard from '@/features/auth/components/UserCard'
import ChatPanel from '@/features/chat/components/ChatPanel'
import { Container } from '@chakra-ui/react'

const Home: NextPage = () => {
  const { currentUser } = useAuth()

  if (currentUser.isLoading) {
    return <div>loading...</div>
  }

  if (!currentUser.data) {
    // signed out
    return (
      <div>
        <AuthSignInWithGoogleButton />
      </div>
    )
  }

  // signed in
  return (
    <Container maxW="container.xl">
      <UserCard />
      <AuthSignOutButton />
      <ChatPanel room="5" />
    </Container>
  )
}
export default Home
