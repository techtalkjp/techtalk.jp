/* eslint-disable @next/next/no-img-element */
import { useChat } from '@/features/chat/hooks/useChat'
import { Stack, Box, BoxProps, SkeletonText } from '@chakra-ui/react'
import { ChatMessageCard } from '../components/ChatMessageCard'

interface ChatMessagePanelProps extends BoxProps {}
const ChatMessagePanel: React.VFC<ChatMessagePanelProps> = ({ ...rest }) => {
  const { messages } = useChat()

  return (
    <Box
      boxShadow="md"
      p="4"
      border="1px solid"
      borderColor="gray.100"
      rounded="md"
      {...rest}
    >
      <SkeletonText isLoaded={!messages.isFetching} noOfLines={5} spacing={3.5}>
        <Stack direction="column-reverse">
          {messages.data &&
            messages.data.map((e) => (
              <ChatMessageCard key={e.id} message={e} />
            ))}
        </Stack>
      </SkeletonText>
    </Box>
  )
}
export default ChatMessagePanel
