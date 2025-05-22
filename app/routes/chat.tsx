import { useChat } from '@ai-sdk/react'
import { Button, HStack, Input } from '~/components/ui'

export default function ChatPage() {
  const chat = useChat()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        chat.handleSubmit()
      }}
    >
      <div>
        {chat.messages.map((message) => (
          <div key={message.id} className={message.role}>
            {message.content}
          </div>
        ))}
      </div>

      {chat.error && (
        <div className="error">
          <p>{chat.error.message}</p>
          <p>{JSON.stringify(chat.error.cause)}</p>
        </div>
      )}

      <HStack>
        <Input onChange={chat.handleInputChange} />
        <Button
          type="submit"
          isLoading={chat.status === 'submitted' || chat.status === 'streaming'}
        >
          Send
        </Button>
      </HStack>
    </form>
  )
}
