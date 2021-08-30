import type { NextPage } from 'next'
import { Flex, Text, Spacer, HStack } from '@chakra-ui/react'
import { Link as Scroll } from 'react-scroll'

const Navigation: NextPage = () => {
  const scrollTo = (
    id: string,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
    event.preventDefault()
  }

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
      <a href="#hero" onClick={(event) => scrollTo('hero', event)}>
        <Text
          _hover={{
            color: 'accent.500',
            cursor: 'pointer'
          }}
        >
          TechTalk
        </Text>
      </a>
      <Spacer />
      <HStack>
        <a href="#about" onClick={(event) => scrollTo('about', event)}>
          <Text
            _hover={{
              color: 'accent.500',
              cursor: 'pointer'
            }}
          >
            About
          </Text>
        </a>
        <a href="#contact" onClick={(event) => scrollTo('contact', event)}>
          <Text
            _hover={{
              color: 'accent.500',
              cursor: 'pointer'
            }}
          >
            Contact
          </Text>
        </a>
      </HStack>
    </Flex>
  )
}

export default Navigation
