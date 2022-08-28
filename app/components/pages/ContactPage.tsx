import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Textarea,
  VStack
} from '@chakra-ui/react'
import { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { useLocale } from '~/hooks/useLocale'
import type { ContactFormData } from '~/interfaces/ContactFormData'
import ContactSentMessage from '../ContactSentMessage'
import CoverPage from '../CoverPage'
import PrivacyPolicyDialog from '../PrivacyPolicyDialog'

export const ContactPage = () => {
  const { t } = useLocale()
  const [sentContact, setSentContact] = useState<ContactFormData>()

  const { register, handleSubmit, formState } = useForm<ContactFormData>({
    mode: 'all'
  })
  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    /*
    await ky
      .post('/api/contact', { json: data })
      .json()
      .catch(() => null)
    setSentContact(data)
    */
  }

  return (
    <CoverPage id="contact" bgImage="/contact.jpg">
      <Heading fontSize="5xl" fontWeight="black" lineHeight="1">
        {t('contact.title', 'お問い合わせ')}
      </Heading>

      {sentContact ? (
        <ContactSentMessage sentData={sentContact} />
      ) : (
        <chakra.form mt="4" onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing="2">
            <FormControl
              id="name"
              isInvalid={formState.errors.name ? true : false}
            >
              <FormLabel htmlFor="name">
                {t('contact.name', 'お名前')}
              </FormLabel>
              <Input
                backgroundColor="blackAlpha.400"
                placeholder={t('contact.name', 'お名前')}
                {...register('name', {
                  required: t('contact.required', '必須')
                })}
              />
              <FormErrorMessage>
                {formState.errors.name && formState.errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              id="company"
              isInvalid={formState.errors.company ? true : false}
            >
              <FormLabel htmlFor="company">
                {t('contact.company', '会社名')}
              </FormLabel>
              <Input
                backgroundColor="blackAlpha.400"
                placeholder={t('contact.company', '会社名')}
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
              <FormLabel htmlFor="phone">
                {t('contact.phone', '電話番号')}
              </FormLabel>
              <Input
                backgroundColor="blackAlpha.400"
                placeholder={t('contact.phone', '電話番号')}
                {...register('phone')}
              />
              <FormErrorMessage>
                {formState.errors.phone && formState.errors.phone.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              id="email"
              isInvalid={formState.errors.email ? true : false}
            >
              <FormLabel htmlFor="email">
                {t('contact.email', 'メール')}
              </FormLabel>
              <Input
                type="email"
                backgroundColor="blackAlpha.400"
                placeholder={t('contact.email', 'メール')}
                {...register('email', {
                  required: t('contact.required', '必須'),
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: t(
                      'contact.email.message',
                      'メールアドレスの形式で入力してください。'
                    )
                  }
                })}
              />
              <FormErrorMessage>
                {formState.errors.email && formState.errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              id="message"
              isInvalid={formState.errors.message ? true : false}
            >
              <FormLabel htmlFor="message">
                {t('contact.message', 'メッセージ')}
              </FormLabel>
              <Textarea
                backgroundColor="blackAlpha.400"
                placeholder={t('contact.message', 'メッセージ')}
                {...register('message', {
                  required: t('contact.required', '必須')
                })}
              />
              <FormErrorMessage>
                {formState.errors.message && formState.errors.message.message}
              </FormErrorMessage>
            </FormControl>

            <PrivacyPolicyDialog />

            <Button
              type="submit"
              colorScheme="accent"
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
