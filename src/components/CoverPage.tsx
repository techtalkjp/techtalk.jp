import React from 'react'
import Image from 'next/image'
import { Box, Flex } from '@chakra-ui/react'

interface Props {
  children?: React.ReactNode
  id: string
  bgImage: string
}

const CoverPage: React.FC<Props> = ({ children, bgImage, id }) => {
  return (
    <Box
      id={id}
      position="relative"
      w="100vw"
      h="100vh"
      bg="blackAlpha.500"
      bgImage={`linear-gradient(rgba(0, 0, 0, 0.2),rgba(0, 0, 0, 0.2)) , url('${bgImage}')`}
      backgroundSize="cover"
      backgroundPosition="center"
      sx={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
    >
      <Flex w="100vw" h="100vh" align="center" justify="center">
        <Box color="white" minW="60%" px="1rem" align="center" mx="auto">
          {children}
        </Box>
      </Flex>
    </Box>
  )
}

export default CoverPage
