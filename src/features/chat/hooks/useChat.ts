import {
  useFirestoreQueryData,
  useFirestoreCollectionMutation
} from '@react-query-firebase/firestore'
import { query, collection, serverTimestamp, orderBy } from 'firebase/firestore'
import type { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'
import { firestore } from '@/utils/firebase'
import dayjs, { Dayjs } from 'dayjs'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface ChatMessage {
  id?: string
  name: string
  photoURL: string
  text: string
  createdAt: Dayjs
}

const chatMessageConverter = {
  fromFirestore: (
    ss: QueryDocumentSnapshot<ChatMessage>,
    op: SnapshotOptions
  ) => {
    const { createdAt, ...rest } = ss.data()
    console.log('createdAt', createdAt)
    return {
      id: ss.id,
      ...rest,
      createdAt: createdAt ? dayjs(createdAt.toDate()) : dayjs()
    } as ChatMessage
  },
  toFirestore: (message: ChatMessage) => {
    const { id, ...rest } = message
    return {
      ...rest
    }
  }
}

export const useChat = (roomId: string) => {
  const { currentUser } = useAuth()

  const collectionRef = collection(
    firestore,
    `chat/${roomId}/messages`
  ).withConverter<ChatMessage>(chatMessageConverter)

  const messages = useFirestoreQueryData<ChatMessage>(
    ['chat', roomId],
    query(collectionRef, orderBy('createdAt', 'desc')),
    {
      subscribe: true
    }
  )
  const mutation = useFirestoreCollectionMutation<ChatMessage>(collectionRef)

  const postMessage = (message: string) => {
    return mutation.mutate({
      name: currentUser.data?.displayName ?? '',
      photoURL: currentUser.data?.photoURL ?? '',
      text: message,
      createdAt: serverTimestamp()
    })
  }

  return {
    messages,
    postMessage
  }
}
