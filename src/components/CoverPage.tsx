import React from 'react'
import Image from 'next/image'
import { Box, Center, Flex } from '@chakra-ui/react'

interface Props {
  children?: React.ReactNode
  id: string
  bgImage: string
}

const CoverPage: React.VFC<Props> = ({ children, bgImage, id }) => {
  return (
    <Box
      id={id}
      position="relative"
      w="100vw"
      h="100vh"
      bg="blackAlpha.400"
      backgroundSize="cover"
      backgroundPosition="center"
      scrollSnapAlign="start"
      scrollSnapStop="always"
    >
      <Box
        position="absolute"
        height="full"
        width="full"
        zIndex="-1"
        bgColor="black"
      >
        <Image
          alt="background"
          src={bgImage}
          objectFit="cover"
          layout="fill"
          quality={70}
          priority
        />
      </Box>
      <Flex w="full" h="full" align="center" justify="center">
        <Box color="white" px="1rem" textAlign="center" mx="auto">
          {children}
        </Box>
      </Flex>
    </Box>
  )
}

export default CoverPage
