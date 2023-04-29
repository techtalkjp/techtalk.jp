import { Box, Flex } from '@chakra-ui/react'
import React from 'react'

interface Props {
  children?: React.ReactNode
  id: string
  bgImage: string
}

const CoverPage = ({ children, bgImage, id }: Props) => {
  return (
    <Box
      id={id}
      position="relative"
      w="100vw"
      h="100dvh"
      bg="blackAlpha.400"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundImage={bgImage}
      scrollSnapAlign="start"
      scrollSnapStop="always"
    >
      <Flex w="full" h="full" align="center" justify="center">
        <Box color="white" px="1rem" textAlign="center" mx="auto">
          {children}
        </Box>
      </Flex>
    </Box>
  )
}

export default CoverPage
