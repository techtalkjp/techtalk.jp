import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { Form, useActionData, useNavigation } from 'react-router'
import {
  Button,
  FormField,
  FormMessage,
  Input,
  Label,
  Textarea,
} from '~/components/ui'
import type { action } from '../../db.fts'
import { schema } from '../schema'

export function AddContentForm() {
  const actionData = useActionData<typeof action>()
  const [form, fields] = useForm({
    lastResult: actionData?.lastResult,
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  })
  const navigation = useNavigation()

  return (
    <Form method="POST" {...getFormProps(form)} className="space-y-4">
      <FormField>
        <Label htmlFor={fields.title.id}>タイトル</Label>
        <Input
          {...getInputProps(fields.title, { type: 'text' })}
          placeholder="記事タイトル"
        />
        <FormMessage id={fields.title.errorId}>
          {fields.title.errors}
        </FormMessage>
      </FormField>

      <FormField>
        <Label htmlFor={fields.body.id}>本文</Label>
        <Textarea
          {...getTextareaProps(fields.body)}
          placeholder="記事の内容..."
          rows={4}
        />
        <FormMessage id={fields.body.errorId}>{fields.body.errors}</FormMessage>
      </FormField>

      {form.errors && <div className="text-destructive">{form.errors}</div>}

      <Button
        type="submit"
        name="intent"
        value="add"
        className="w-full"
        isLoading={
          navigation.formData?.get('intent') === 'add' &&
          navigation.state === 'submitting'
        }
      >
        コンテンツを追加
      </Button>
    </Form>
  )
}
