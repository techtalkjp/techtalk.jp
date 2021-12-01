import { useAuthAction } from '@/features/auth/hooks/useAuthAction'
import { Button } from '@chakra-ui/react'

const AuthSignOutButton: React.VFC = () => {
  const { signOut } = useAuthAction()
  return (
    <Button variant="outline" colorScheme="blue" onClick={() => signOut()}>
      サインアウト
    </Button>
  )
}
export default AuthSignOutButton
