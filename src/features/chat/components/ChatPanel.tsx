/* eslint-disable @next/next/no-img-element */
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useChat } from '@/features/chat/hooks/useChat'
import {
  Stack,
  Box,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel
} from '@chakra-ui/react'

interface Props {
  room: string
}
const ChatPanel: React.VFC<Props> = ({ room }) => {
  const { currentUser } = useAuth()
  const { messages, postMessage } = useChat(room)

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

  if (messages.isLoading) {
    return <div>chat message loading...</div>
  }

  return (
    <Stack>
      <Stack
        as="form"
        direction="row"
        onSubmit={handleSubmitForm}
        alignItems="baseline"
      >
        <FormLabel
          htmlFor="message"
          whiteSpace="nowrap"
          fontWeight="bold"
          color="gray.500"
        >
          メッセージ
        </FormLabel>
        <Input id="message" placeholder="type something..." rounded="md" />
        <Button size="sm" variant="outline" colorScheme="blue" type="submit">
          POST
        </Button>
      </Stack>

      <Box>
        {messages.data &&
          messages.data.map((e) => {
            return (
              <Stack direction="row" key={e.id}>
                <Text fontSize="xs" color="green.500">
                  {e.createdAt.format('YYYY-MM-DD HH:mm:ss')}
                </Text>
                <Text fontSize="sm" color="gray.400" fontWeight="bold">
                  {e.name}
                </Text>
                <Text color="gray.600">{e.text}</Text>
              </Stack>
            )
          })}
      </Box>
    </Stack>
  )
}
export default ChatPanel
