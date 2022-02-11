import type { Dayjs } from 'dayjs'

export interface ChatMessage {
  id?: string
  name: string
  photoURL: string
  text: string
  createdAt: Dayjs
}
