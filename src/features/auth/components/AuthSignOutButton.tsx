import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button } from '@chakra-ui/react'

const AuthSignOutButton: React.VFC = () => {
  const { signOut } = useAuth()
  return (
    <Button variant="outline" colorScheme="blue" onClick={() => signOut()}>
      サインアウト
    </Button>
  )
}
export default AuthSignOutButton
