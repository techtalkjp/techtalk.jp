import { useState } from 'react'
import { flatten, safeParse } from 'valibot'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { useI18n } from '~/services/i18n'
import { ContactFormSchema, type ContactFormData } from '../contact'

export const ContactForm = ({ path }: { path: string }) => {
  const { t } = useI18n(path)
  const [result, setResult] = useState<ContactFormData | null>(null)
  const [errors, setErrors] = useState<ReturnType<typeof flatten<typeof ContactFormSchema>>['nested']>({})

  const handleFormSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    setErrors({})

    const formData = new FormData(event.target as HTMLFormElement)

    // validation
    const validateResult = safeParse(ContactFormSchema, Object.fromEntries(formData.entries()))
    if (!validateResult.success) {
      setErrors(flatten<typeof ContactFormSchema>(validateResult.issues).nested)
      return
    }

    // submit
    const response = await fetch('/contact', {
      method: 'POST',
      body: formData,
    })
    const result = await response.json()
    setResult(result.output)
  }

  if (result) {
    return (
      <div className="flex flex-col gap-4">
        <p>
          お問い合わせありがとうございます。
          <br />
          以下のメッセージを受付けました。
          <br />
          お返事をお待ち下さい。
        </p>

        <div className="grid grid-cols-[auto_1fr] max-h-96 overflow-y-scroll max-w-md mx-auto text-left rounded-md bg-black/50 gap-4 p-4">
          <div>{t('contact.name', 'お名前')}</div>
          <div>{result.name}</div>
          <div>{t('contact.company', '会社名')}</div>
          <div>{result.company}</div>
          <div>{t('contact.tel', '電話番号')}</div>
          <div>{result.tel}</div>
          <div>{t('contact.email', 'メールアドレス')}</div>
          <div>{result.email}</div>
          <div>{t('contact.message', 'メッセージ')}</div>
          <div>{result.message}</div>
        </div>
      </div>
    )
  }

  return (
    <form
      id="contact-form"
      action="/contact"
      method="post"
      className="mx-auto grid max-w-lg grid-cols-1 text-left gap-x-4 gap-y-2"
      onSubmit={handleFormSubmit}
    >
      <Label>
        <div>{t('contact.name', 'お名前')}</div>
        <Input type="text" name="name" />
        <div className="text-red-500 mt-1">{errors.name?.join(' / ')}</div>
      </Label>

      <Label>
        <div>{t('contact.company', '会社名')}</div>
        <Input type="text" name="company" />
        <div className="text-red-500 mt-1">{errors.company?.join(' / ')}</div>
      </Label>

      <Label>
        <div>{t('contact.tel', '電話番号')}</div>
        <Input type="tel" name="tel" />
        <div className="text-red-500 mt-1">{errors.tel?.join(' / ')}</div>
      </Label>

      <Label>
        <div>{t('contact.email', 'メールアドレス')}</div>
        <Input type="email" name="email" />
        <div className="text-red-500 mt-1">{errors.email?.join(' / ')}</div>
      </Label>

      <Label>
        <div>{t('contact.message', 'メッセージ')}</div>
        <Textarea rows={4} name="message"></Textarea>
        <div className="text-red-500 mt-1">{errors.message?.join(' / ')}</div>
      </Label>

      <Label>
        <div className="flex items-center gap-2">
          <Checkbox name="privacy" />
          <div>{t('contact.agree-to-the-privacy-policy', 'プライバシーポリシーに同意する')}</div>
        </div>
        <div className="text-red-500 mt-1">{errors.privacy?.join(' / ')}</div>
      </Label>

      <Button>{t('contact.submit', '送信')}</Button>
    </form>
  )
}
