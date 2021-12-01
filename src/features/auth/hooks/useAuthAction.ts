import {
  useAuthSignInWithRedirect,
  useAuthSignOut
} from '@react-query-firebase/auth'
import { auth, googleAuthProvider } from '@/utils/firebase'

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
