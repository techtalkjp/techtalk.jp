import { ChatHeader, MessageInput } from './components'
import { MessageList } from './components/message-list'
import { useChat } from './hooks/use-chat'
import { MESSAGE_ROLES } from './types/message'

// ===== Main Chat Component =====
const ChatUI = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: '/api/chat',
      initialMessages: [
        {
          id: '1',
          role: MESSAGE_ROLES.ASSISTANT,
          content:
            'こんにちは！私は構造化されたAIアシスタントです。shadcn/uiベースでコード、HTML、文書などを作成できます。\n\n試しに「Pythonのコード書いて」「HTMLページ作って」「文書作成して」などと話しかけてみてください！',
          createdAt: new Date(),
        },
      ],
    })

  return (
    <div className="bg-background mx-auto flex h-screen max-w-6xl flex-col">
      <ChatHeader isLoading={isLoading} />
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput
        input={input}
        onInputChange={handleInputChange}
        onSubmit={(e) => {
          console.log('handleSubmit called')
          handleSubmit(e)
        }}
        isLoading={isLoading}
      />
    </div>
  )
}

export default ChatUI
