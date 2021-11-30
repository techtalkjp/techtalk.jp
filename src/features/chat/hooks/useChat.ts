import {
  useFirestoreQueryData,
  useFirestoreCollectionMutation
} from '@react-query-firebase/firestore'
import {
  query,
  collection,
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore'
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
    snapshot: QueryDocumentSnapshot<ChatMessage>,
    options: SnapshotOptions
  ) => {
    const { createdAt, ...rest } = snapshot.data()
    return {
      id: snapshot.id,
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

export const useChat = () => {
  const { currentUser } = useAuth()

  const collectionRef = collection(
    firestore,
    `chat`
  ).withConverter<ChatMessage>(chatMessageConverter)

  const messages = useFirestoreQueryData<ChatMessage>(
    ['chat'],
    query(collectionRef, orderBy('createdAt', 'desc'), limit(20)),
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
