import type { NextPage } from 'next'
import { Flex, Text, Spacer, HStack } from '@chakra-ui/react'
import { Link as Scroll } from 'react-scroll'

const Navigation: NextPage = () => {
  return (
    <Flex
      p="4"
      alignContent="center"
      justifyContent="center"
      position="fixed"
      w="100%"
      zIndex="10"
      color="white"
      fontWeight="bold"
      letterSpacing="tight"
    >
      <Scroll to="hero" smooth={true}>
        <Text
          _hover={{
            color: 'accent.500',
            cursor: 'pointer'
          }}
        >
          TechTalk
        </Text>
      </Scroll>
      <Spacer />
      <HStack>
        <Scroll to="about" smooth={true}>
          <Text
            _hover={{
              color: 'accent.500',
              cursor: 'pointer'
            }}
          >
            About
          </Text>
        </Scroll>
        <Scroll to="contact" smooth={true}>
          <Text
            _hover={{
              color: 'accent.500',
              cursor: 'pointer'
            }}
          >
            Contact
          </Text>
        </Scroll>
      </HStack>
    </Flex>
  )
}

export default Navigation
