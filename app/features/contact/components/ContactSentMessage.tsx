import { VStack, Box, SimpleGrid } from '@chakra-ui/react'
import type { ContactFormData } from '~/features/contact/interfaces/ContactFormData'

interface ContactSentMessageProps {
  data: ContactFormData
}

export const ContactSentMessage = ({ data }: ContactSentMessageProps) => {
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
        <Box>{data.name}</Box>
        <Box>会社名</Box>
        <Box>{data.company}</Box>
        <Box>電話番号</Box>
        <Box>{data.phone}</Box>
        <Box>メールアドレス</Box>
        <Box>{data.email}</Box>
        <Box>メッセージ</Box>
        <Box>{data.message}</Box>
      </SimpleGrid>
    </VStack>
  )
}
