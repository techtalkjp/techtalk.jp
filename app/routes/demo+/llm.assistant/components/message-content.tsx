import { Card, CardContent } from '~/components/ui'
import { MESSAGE_ROLES, type Message } from '../types/message'

export const MessageContent = ({ message }: { message: Message }) => {
  const isUser = message.role === MESSAGE_ROLES.USER

  return (
    <Card className={isUser ? 'bg-primary text-primary-foreground' : ''}>
      <CardContent className="p-4">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <p
          className={`mt-2 text-xs ${
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </CardContent>
    </Card>
  )
}
