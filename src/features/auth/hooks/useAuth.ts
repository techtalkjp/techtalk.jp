import { useAuthUser } from '@react-query-firebase/auth'
import { auth } from '@/utils/firebase'

export const useAuth = () => {
  const currentUser = useAuthUser(['user'], auth)
  return {
    currentUser
  }
}
