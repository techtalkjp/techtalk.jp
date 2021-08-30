import React, { useState } from 'react'
import NextLink from 'next/link'
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
  Text
} from '@chakra-ui/react'
import { useForm, SubmitHandler } from 'react-hook-form'
import axios from 'axios'
import CoverPage from '../components/CoverPage'
import { ContactFormData } from '../interfaces/ContactFormData'
import ContactSentMessage from './ContactSentMessage'
import PrivacyPolicyDialog from './PrivacyPolicyDialog'

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
        <ContactSentMessage sentData={sentContact} />
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
                backgroundColor="blackAlpha.400"
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
              <Input
                backgroundColor="blackAlpha.400"
                placeholder="会社名"
                {...register('company')}
              />
              <FormErrorMessage>
                {formState.errors.company && formState.errors.company.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              id="phone"
              isInvalid={formState.errors.phone ? true : false}
            >
              <FormLabel htmlFor="phone">電話番号</FormLabel>
              <Input
                backgroundColor="blackAlpha.400"
                placeholder="電話番号"
                {...register('phone')}
              />
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
                backgroundColor="blackAlpha.400"
                placeholder="メール"
                {...register('email', {
                  required: '必須です。',
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
              isInvalid={formState.errors.message ? true : false}
            >
              <FormLabel htmlFor="message">メッセージ</FormLabel>
              <Textarea
                backgroundColor="blackAlpha.400"
                placeholder="メッセージ"
                {...register('message', { required: '必須です' })}
              />
              <FormErrorMessage>
                {formState.errors.message && formState.errors.message.message}
              </FormErrorMessage>
            </FormControl>

            <PrivacyPolicyDialog />

            <FormControl
              id="privacy"
              isRequired
              isInvalid={formState.errors.privacy ? true : false}
            >
              <Checkbox {...register('privacy', { required: '必須です' })}>
                プライバシーポリシーに同意する
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
              Let&apos;s talk
            </Button>
          </VStack>
        </chakra.form>
      )}
    </CoverPage>
  )
}

export default ContactPage
