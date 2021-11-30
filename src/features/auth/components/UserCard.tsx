/* eslint-disable @next/next/no-img-element */
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Stack, Avatar, Image, Text } from '@chakra-ui/react'

const UserCard: React.VFC = () => {
  const { currentUser } = useAuth()
  return (
    <Stack
      direction="row"
      border="1px solid white"
      rounded="md"
      w="auto"
      boxShadow="md"
    >
      <Avatar
        size="md"
        rounded="md"
        src={currentUser.data?.photoURL ?? undefined}
      />

      <Text fontWeight="bold" textAlign="center">
        {currentUser.data?.displayName}
      </Text>
    </Stack>
  )
}
export default UserCard
