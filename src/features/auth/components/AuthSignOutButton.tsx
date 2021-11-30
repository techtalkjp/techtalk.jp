import { useAuth } from '@/features/auth/hooks/useAuth'

const AuthSignOutButton: React.VFC = () => {
  const { signOut } = useAuth()
  return <button onClick={() => signOut()}>Sign Out</button>
}
export default AuthSignOutButton
