import React from 'react'
import Image from 'next/image'
import { Box, Flex } from '@chakra-ui/react'

interface Props {
  children?: React.ReactNode
  bgImage: string
}

const CoverPage: React.FC<Props> = ({ children, bgImage }) => {
  return (
    <Box
      position="relative"
      w="100vw"
      h="100vh"
      bg="blackAlpha.500"
      bgImage={`linear-gradient(rgba(0, 0, 0, 0.2),rgba(0, 0, 0, 0.2)) , url('${bgImage}')`}
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Flex w="100vw" h="100vh" align="center" justify="center">
        <Box color="white" align="center" mx="auto">
          {children}
        </Box>
      </Flex>
    </Box>
  )
}

export default CoverPage
