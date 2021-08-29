import type { NextPage } from 'next'
import { Flex, Spacer, HStack } from '@chakra-ui/react'

const Navigation: NextPage = () => {
  return (
    <Flex
      p="4"
      alignContent="center"
      justifyContent="center"
      position="absolute"
      w="100%"
      zIndex="10"
      color="white"
      fontWeight="bold"
      letterSpacing="tight"
    >
      <a href="/#top">TechTalk</a>
      <Spacer />
      <HStack>
        <a href="/#about">About</a>
        <a href="/#contact">Contact</a>
      </HStack>
    </Flex>
  )
}

export default Navigation
