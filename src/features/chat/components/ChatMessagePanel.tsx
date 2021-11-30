/* eslint-disable @next/next/no-img-element */
import { useChat } from '@/features/chat/hooks/useChat'
import { Stack, Box, Text, SkeletonText } from '@chakra-ui/react'

const ChatMessagePanel: React.VFC = () => {
  const { messages } = useChat()

  return (
    <Box
      boxShadow="md"
      p="4"
      border="1px solid"
      borderColor="gray.100"
      rounded="md"
    >
      <SkeletonText isLoaded={!messages.isFetching} noOfLines={5} spacing={3.5}>
        {messages.data &&
          messages.data.map((e) => {
            return (
              <Stack direction="row" key={e.id} alignItems="center">
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
      </SkeletonText>
    </Box>
  )
}
export default ChatMessagePanel
