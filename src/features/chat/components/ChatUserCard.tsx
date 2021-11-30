/* eslint-disable @next/next/no-img-element */
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  Stack,
  Avatar,
  Text,
  Spacer,
  Button,
  Input,
  FormLabel,
  Skeleton
} from '@chakra-ui/react'

import AuthSignOutButton from '@/features/auth/components/AuthSignOutButton'
import AuthSignInWithGoogleButton from '@/features/auth/components/AuthSignInWithGoogleButton'
import { useChat } from '@/features/chat/hooks/useChat'

const UserCard: React.VFC = () => {
  const { currentUser } = useAuth()
  const { postMessage } = useChat()

  const handleSubmitForm: React.FormEventHandler<HTMLDivElement> = (event) => {
    const target = event.target as typeof event.target & {
      message: { value: string; focus: () => void }
    }
    event.preventDefault()
    if (target.message.value === '') return
    postMessage(target.message.value)
    target.message.value = ''
    target.message.focus()
  }

  return (
    <Stack
      p="4"
      rounded="md"
      boxShadow="md"
      border="1px solid"
      borderColor="gray.100"
    >
      <Stack direction="row" alignItems="center">
        <Avatar
          size="md"
          rounded="full"
          src={currentUser.data?.photoURL ?? undefined}
        />

        <Skeleton isLoaded={!currentUser.isLoading}>
          <Text fontWeight="bold" textAlign="center">
            {currentUser.data
              ? currentUser.data.displayName
              : 'ログインしていません'}
          </Text>
        </Skeleton>

        <Spacer />

        <Skeleton isLoaded={!currentUser.isLoading}>
          {currentUser.data ? (
            <AuthSignOutButton />
          ) : (
            <AuthSignInWithGoogleButton />
          )}
        </Skeleton>
      </Stack>

      <Stack
        as="form"
        direction="row"
        alignItems="baseline"
        onSubmit={handleSubmitForm}
      >
        <FormLabel
          htmlFor="message"
          whiteSpace="nowrap"
          fontWeight="bold"
          color="gray.500"
        >
          メッセージ
        </FormLabel>

        <Input
          autoComplete="off"
          id="message"
          placeholder="type something..."
          rounded="md"
          disabled={!currentUser.data}
        />

        <Button
          size="sm"
          variant="outline"
          colorScheme="blue"
          type="submit"
          disabled={!currentUser.data}
        >
          送信
        </Button>
      </Stack>
    </Stack>
  )
}
export default UserCard
