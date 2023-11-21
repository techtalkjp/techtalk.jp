import { useState } from 'react'
import { flatten, safeParse } from 'valibot'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { useI18n } from '~/services/i18n'
import { ContactFormSchema } from '../contact'

export const ContactForm = ({ path }: { path: string }) => {
  const { t } = useI18n(path)
  const [result, setResult] = useState(null)
  const [errors, setErrors] = useState({})

  const handleFormSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    setErrors({})

    const formData = new FormData(event.target as HTMLFormElement)

    // validation
    const validateResult = safeParse(ContactFormSchema, Object.fromEntries(formData.entries()))
    if (!validateResult.success) {
      setErrors(flatten(validateResult.issues).nested)
      return
    }

    // submit
    const response = await fetch('/contact', {
      method: 'POST',
      body: formData,
    })
    const result = await response.json()
    setResult(result)
  }

  if (result) {
    return <div>{JSON.stringify(result)}</div>
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
        {t('contact.name', 'お名前')}
        <Input type="text" name="name" />
      </Label>

      <Label>
        {t('contact.company', '会社名')}
        <Input type="tel" name="tel" />
      </Label>

      <Label>
        {t('contact.tel', '電話番号')}
        <Input type="tel" name="tel" />
      </Label>

      <Label>
        {t('contact.email', 'メールアドレス')}
        <Input type="email" name="email" />
      </Label>

      <Label>
        {t('contact.message', 'メッセージ')}
        <Textarea rows={4} name="message"></Textarea>
      </Label>

      <Label>
        <Checkbox name="privacy" />
        {t('contact.agree-to-the-privacy-policy', 'プライバシーポリシーに同意する')}
      </Label>

      <div id="errors">{JSON.stringify(errors, null, 2)}</div>

      <Button>{t('contact.submit', '送信')}</Button>
    </form>
  )
}
