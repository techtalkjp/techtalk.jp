import { Card, CardContent } from '~/components/ui'
import { MESSAGE_ROLES } from '../types/message'
import { MessageAvatar } from './message-avatar'

export const TypingIndicator = () => (
  <div className="flex justify-start gap-3">
    <MessageAvatar role={MESSAGE_ROLES.ASSISTANT} />
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-1">
          <div className="bg-muted-foreground size-2 animate-bounce rounded-full" />
          <div
            className="bg-muted-foreground size-2 animate-bounce rounded-full"
            style={{ animationDelay: '0.1s' }}
          />
          <div
            className="bg-muted-foreground size-2 animate-bounce rounded-full"
            style={{ animationDelay: '0.2s' }}
          />
        </div>
      </CardContent>
    </Card>
  </div>
)
