import React, { useState } from 'react'
import {
  chakra,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Checkbox,
  Button,
  Box,
  SimpleGrid
} from '@chakra-ui/react'
import { useForm, SubmitHandler } from 'react-hook-form'
import axios from 'axios'
import CoverPage from '../components/CoverPage'
import { ContactFormData } from '../interfaces/ContactFormData'

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const [sentContact, setSentContact] = useState<ContactFormData>()

  const { register, handleSubmit, formState } = useForm<ContactFormData>({
    mode: 'all'
  })
  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    await axios.post('/api/contact', data).catch(() => null)
    setSentContact(data)
  }

  return (
    <CoverPage id="contact" bgImage="/contact.jpg">
      <Heading fontSize="5xl" fontWeight="black" lineHeight="1">
        Contact
      </Heading>

      {sentContact ? (
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
            <Box>{sentContact.name}</Box>
            <Box>会社名</Box>
            <Box>{sentContact.company}</Box>
            <Box>電話番号</Box>
            <Box>{sentContact.phone}</Box>
            <Box>メールアドレス</Box>
            <Box>{sentContact.email}</Box>
            <Box>メッセージ</Box>
            <Box>{sentContact.message}</Box>
            <Box>プライバシーポリシー</Box>
            <Box>{sentContact.privacy ? '同意する' : '同意しない'}</Box>
          </SimpleGrid>
        </VStack>
      ) : (
        <chakra.form mt="4" onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing="2">
            <FormControl
              id="name"
              isRequired
              isInvalid={formState.errors.name ? true : false}
            >
              <FormLabel htmlFor="name">お名前</FormLabel>
              <Input
                placeholder="お名前"
                {...register('name', { required: '必須です' })}
              />
              <FormErrorMessage>
                {formState.errors.name && formState.errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              id="company"
              isInvalid={formState.errors.company ? true : false}
            >
              <FormLabel htmlFor="company">会社名</FormLabel>
              <Input placeholder="会社名" {...register('company')} />
              <FormErrorMessage>
                {formState.errors.company && formState.errors.company.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              id="phone"
              isInvalid={formState.errors.phone ? true : false}
            >
              <FormLabel htmlFor="phone">電話番号</FormLabel>
              <Input placeholder="電話番号" {...register('phone')} />
              <FormErrorMessage>
                {formState.errors.phone && formState.errors.phone.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              id="email"
              isRequired
              isInvalid={formState.errors.email ? true : false}
            >
              <FormLabel htmlFor="email">メール</FormLabel>
              <Input
                type="email"
                placeholder="メール"
                {...register('email', {
                  required: 'メールアドレスは必須です。',
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'メールアドレス形式で入力してください。'
                  }
                })}
              />
              <FormErrorMessage>
                {formState.errors.email && formState.errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              id="message"
              isRequired
              isInvalid={formState.errors.phone ? true : false}
            >
              <FormLabel htmlFor="message">メッセージ</FormLabel>
              <Textarea
                placeholder="メッセージ"
                {...register('message', { required: '必須です' })}
              />
              <FormErrorMessage>
                {formState.errors.message && formState.errors.message.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl id="privacy" isRequired>
              <Checkbox {...register('privacy', { required: '必須です' })}>
                プライバシーポリシーに同意
              </Checkbox>
              <FormErrorMessage>
                {formState.errors.privacy && formState.errors.privacy.message}
              </FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="accent"
              disabled={!formState.isValid}
              isLoading={formState.isSubmitting}
            >
              Let's talk
            </Button>
          </VStack>
        </chakra.form>
      )}
    </CoverPage>
  )
}

export default ContactPage
