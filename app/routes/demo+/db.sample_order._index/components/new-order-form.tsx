import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { Form, href, useActionData, useNavigation } from 'react-router'
import {
  Button,
  FormField,
  FormMessage,
  Input,
  Label,
  Textarea,
} from '~/components/ui'
import type { action } from '../route'
import type { DummyData } from '../schema'
import { schema } from '../schema'

export function NewOrderForm({
  dummyData,
  now,
}: {
  dummyData: DummyData
  now: string
}) {
  const actionData = useActionData<typeof action>()
  const [form, fields] = useForm({
    id: now,
    lastResult: actionData?.lastResult,
    defaultValue: dummyData,
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  })
  const navigation = useNavigation()

  return (
    <Form
      className="grid grid-cols-2 gap-4"
      method="POST"
      {...getFormProps(form)}
    >
      <FormField>
        <Label htmlFor={fields.name.id}>Name</Label>
        <Input {...getInputProps(fields.name, { type: 'text' })} />
        <FormMessage id={fields.name.errorId}>{fields.name.errors}</FormMessage>
      </FormField>

      <FormField>
        <Label htmlFor={fields.phone.id}>Phone</Label>
        <Input {...getInputProps(fields.phone, { type: 'text' })} />
        <FormMessage id={fields.phone.errorId}>
          {fields.phone.errors}
        </FormMessage>
      </FormField>

      <FormField>
        <Label htmlFor={fields.email.id}>Email</Label>
        <Input {...getInputProps(fields.email, { type: 'text' })} />
        <FormMessage id={fields.email.errorId}>
          {fields.email.errors}
        </FormMessage>
      </FormField>

      <FormField>
        <Label htmlFor={fields.zip.id}>Zip</Label>
        <Input {...getInputProps(fields.zip, { type: 'text' })} />
        <FormMessage id={fields.zip.errorId}>{fields.zip.errors}</FormMessage>
      </FormField>

      <FormField>
        <Label htmlFor={fields.country.id}>Country</Label>
        <Input {...getInputProps(fields.country, { type: 'text' })} />
        <FormMessage id={fields.country.errorId}>
          {fields.country.errors}
        </FormMessage>
      </FormField>

      <FormField>
        <Label htmlFor={fields.prefecture.id}>Prefecture</Label>
        <Input {...getInputProps(fields.prefecture, { type: 'text' })} />
        <FormMessage id={fields.prefecture.errorId}>
          {fields.prefecture.errors}
        </FormMessage>
      </FormField>

      <FormField>
        <Label htmlFor={fields.city.id}>City</Label>
        <Input {...getInputProps(fields.city, { type: 'text' })} />
        <FormMessage id={fields.city.errorId}>{fields.city.errors}</FormMessage>
      </FormField>

      <FormField>
        <Label htmlFor={fields.address.id}>Address</Label>
        <Input {...getInputProps(fields.address, { type: 'text' })} />
        <FormMessage id={fields.address.errorId}>
          {fields.address.errors}
        </FormMessage>
      </FormField>

      <FormField className="col-span-2">
        <Label htmlFor={fields.note.id}>Note</Label>
        <Textarea {...getTextareaProps(fields.note)} />
        <FormMessage id={fields.note.errorId}>{fields.note.errors}</FormMessage>
      </FormField>

      {form.errors && <div className="text-destructive">{form.errors}</div>}

      <Button
        className="col-span-2 w-full"
        isLoading={
          navigation.formAction === `${href('/demo/db/sample_order')}?index` &&
          navigation.formData?.get('intent') === 'new'
        }
        type="submit"
        name="intent"
        value="new"
      >
        Submit
      </Button>
    </Form>
  )
}
