import {
  useAuthUser,
  useAuthSignInWithRedirect,
  useAuthSignOut
} from '@react-query-firebase/auth'
import { auth, googleAuthProvider } from '@/utils/firebase'

export const useAuth = () => {
  const currentUser = useAuthUser(['user'], auth)
  return {
    currentUser
  }
}

export const useAuthAction = () => {
  const authSignIn = useAuthSignInWithRedirect(auth)
  const authSignOut = useAuthSignOut(auth)

  const signInWithGoogle = () => {
    return authSignIn.mutate({
      provider: googleAuthProvider
    })
  }

  const signOut = () => {
    return authSignOut.mutate()
  }

  return {
    signInWithGoogle,
    signOut
  }
}
