import React from 'react'
import { VStack, Box, SimpleGrid } from '@chakra-ui/react'
import { ContactFormData } from '../interfaces/ContactFormData'

interface Props {
  sentData: ContactFormData
}

const ContactSentMessage: React.FC<Props> = ({ sentData }) => {
  return (
    <VStack mt="4" spacing={4}>
      <Box>
        お問い合わせありがとうございます。
        <br />
        以下のメッセージを受付ました。
        <br />
        お返事をお待ち下さい。
      </Box>
      <SimpleGrid columns={2} spacing={4} justifyItems="start">
        <div>お名前</div>
        <Box>{sentData.name}</Box>
        <Box>会社名</Box>
        <Box>{sentData.company}</Box>
        <Box>電話番号</Box>
        <Box>{sentData.phone}</Box>
        <Box>メールアドレス</Box>
        <Box>{sentData.email}</Box>
        <Box>メッセージ</Box>
        <Box>{sentData.message}</Box>
      </SimpleGrid>
    </VStack>
  )
}

export default ContactSentMessage
