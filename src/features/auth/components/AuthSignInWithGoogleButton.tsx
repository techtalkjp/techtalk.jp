import { useAuthAction } from '@/features/auth/hooks/useAuthAction'
import { Button } from '@chakra-ui/react'

const AuthSignInWithGoogleButton: React.VFC = () => {
  const { signInWithGoogle } = useAuthAction()
  return (
    <Button
      variant="outline"
      colorScheme="blue"
      onClick={() => signInWithGoogle()}
    >
      Googleアカウントで続ける
    </Button>
  )
}
export default AuthSignInWithGoogleButton
