import { useAuth } from '@/features/auth/hooks/useAuth'

const AuthSignInWithGoogleButton: React.VFC = () => {
  const { signInWithGoogle } = useAuth()
  return <button onClick={() => signInWithGoogle()}>Sign In with Google</button>
}
export default AuthSignInWithGoogleButton
