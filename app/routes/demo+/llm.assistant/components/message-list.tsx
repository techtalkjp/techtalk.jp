import { ScrollArea } from '~/components/ui'
import { useAutoScroll } from '../hooks/use-auto-scroll'
import type { Message } from '../types/message'
import { MessageItem } from './message-item'
import { TypingIndicator } from './typing-indicator'

interface MessageList {
  messages: Array<Message>
  isLoading: boolean
}
export const MessageList = ({ messages, isLoading }: MessageList) => {
  const messagesEndRef = useAutoScroll([messages, isLoading])

  return (
    <ScrollArea className="flex-1 p-4" type="auto">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}
