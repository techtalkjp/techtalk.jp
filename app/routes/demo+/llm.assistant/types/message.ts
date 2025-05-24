import type { Artifact } from './artifact'

export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
} as const

export interface Message {
  id: string
  role: (typeof MESSAGE_ROLES)[keyof typeof MESSAGE_ROLES]
  content: string
  createdAt: Date
  artifacts?: Array<Artifact>
}
