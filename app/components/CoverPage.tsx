import { Box, Flex } from '@chakra-ui/react'
import React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  id: string
  bgImage: string
}

const CoverPage = ({ children, bgImage, id, ...rest }: Props) => {
  return (
    <Box
      id={id}
      position="relative"
      w="100vw"
      h="100dvh"
      bg="blackAlpha.500"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundImage={bgImage}
      backgroundBlendMode="overlay"
      scrollSnapAlign="start"
      scrollSnapStop="always"
      {...rest}
    >
      <Flex w="full" h="full" align="center" justify="center">
        <Box px="1rem" textAlign="center" mx="auto" minW="container.sm">
          {children}
        </Box>
      </Flex>
    </Box>
  )
}

export default CoverPage
