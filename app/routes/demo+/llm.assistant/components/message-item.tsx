import { MESSAGE_ROLES, type Message } from '../types/message'
import { ArtifactViewer } from './artifact-viewer'
import { MessageAvatar } from './message-avatar'
import { MessageContent } from './message-content'

export const MessageItem = ({ message }: { message: Message }) => {
  const isUser = message.role === MESSAGE_ROLES.USER

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <MessageAvatar role={message.role} />}

      <div className={`max-w-[80%] ${isUser ? 'ml-auto' : ''}`}>
        <MessageContent message={message} />
        {message.artifacts?.map((artifact) => (
          <ArtifactViewer key={artifact.id} artifact={artifact} />
        ))}
      </div>

      {isUser && <MessageAvatar role={message.role} />}
    </div>
  )
}
