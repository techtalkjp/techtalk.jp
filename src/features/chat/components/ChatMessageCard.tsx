import { Box, BoxProps, Text, HStack } from '@chakra-ui/react'
import type { ChatMessage } from '../interfaces/model'

interface ChatMessageCardProps extends BoxProps {
  message: ChatMessage
}

export const ChatMessageCard: React.VFC<ChatMessageCardProps> = ({
  message
}) => (
  <Box key={message.id} maxW="70%">
    <HStack>
      <Text fontSize="sm" color="gray.400" fontWeight="bold" flex="1">
        {message.name}
      </Text>
      <Text fontSize="xs" color="green.500">
        {message.createdAt.format('YYYY-MM-DD HH:mm:ss')}
      </Text>
    </HStack>
    <Text color="gray.600">{message.text}</Text>
  </Box>
)
