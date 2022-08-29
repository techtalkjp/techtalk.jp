import { VStack, Box, Grid, Button } from '@chakra-ui/react'
import type { ContactFormData } from '~/features/contact/interfaces/ContactFormData'
import { Link } from '@remix-run/react'

interface ContactSentMessageProps {
  data: Partial<ContactFormData>
}

export const ContactSentMessage = ({ data }: ContactSentMessageProps) => {
  return (
    <VStack mt="4" spacing={4}>
      <Box>
        お問い合わせありがとうございます。
        <br />
        以下のメッセージを受付けました。
        <br />
        お返事をお待ち下さい。
      </Box>

      <Grid
        gridTemplateColumns="auto 1fr"
        justifyItems="start"
        bgColor="blackAlpha.500"
        rounded="md"
        gap="4"
        p="4"
      >
        <Box>お名前</Box>
        <Box>{data.name}</Box>
        <Box>会社名</Box>
        <Box>{data.company}</Box>
        <Box>電話番号</Box>
        <Box>{data.phone}</Box>
        <Box>メールアドレス</Box>
        <Box>{data.email}</Box>
        <Box>メッセージ</Box>
        <Box>{data.message}</Box>
      </Grid>

      <Link to="." reloadDocument>
        <Button colorScheme="accent">OK</Button>
      </Link>
    </VStack>
  )
}
