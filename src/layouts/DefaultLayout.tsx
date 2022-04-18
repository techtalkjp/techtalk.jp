import { Box } from '@chakra-ui/react'
import Navigation from '../components/Navigation'

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box position="relative" w="100vw" h="100vh">
      <Navigation />
      <Box>{children}</Box>
    </Box>
  )
}

export default DefaultLayout
