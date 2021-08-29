import React from 'react'
import { Heading } from '@chakra-ui/react'
import CoverPage from '../components/CoverPage'

const ContactPage: React.FC = () => {
  return (
    <CoverPage bgImage="/contact.jpg">
      <Heading fontSize="5xl" fontWeight="black" lineHeight="1">
        Contact
      </Heading>
    </CoverPage>
  )
}

export default ContactPage
