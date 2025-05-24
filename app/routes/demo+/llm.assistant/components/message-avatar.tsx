import { Bot, User } from 'lucide-react'
import { MESSAGE_ROLES } from '../types/message'

export const MessageAvatar = ({ role }: { role: string }) => {
  const isUser = role === MESSAGE_ROLES.USER
  const IconComponent = isUser ? User : Bot

  return (
    <div
      className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
        isUser ? 'bg-secondary' : 'bg-primary'
      }`}
    >
      <IconComponent
        className={`h-4 w-4 ${
          isUser ? 'text-secondary-foreground' : 'text-primary-foreground'
        }`}
      />
    </div>
  )
}
