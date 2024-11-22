import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, useActionData, useNavigation } from 'react-router'
import { Button, Input, Label, Textarea } from '~/components/ui'
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
      <div>
        <Label htmlFor={fields.name.id}>Name</Label>
        <Input {...getInputProps(fields.name, { type: 'text' })} />
        <div className="text-destructive">{fields.name.errors}</div>
      </div>
      <div>
        <Label htmlFor={fields.phone.id}>Phone</Label>
        <Input {...getInputProps(fields.phone, { type: 'text' })} />
        <div className="text-destructive">{fields.phone.errors}</div>
      </div>
      <div>
        <Label htmlFor={fields.email.id}>Email</Label>
        <Input {...getInputProps(fields.email, { type: 'text' })} />
        <div className="text-destructive">{fields.email.errors}</div>
      </div>
      <div>
        <Label htmlFor={fields.zip.id}>Zip</Label>
        <Input {...getInputProps(fields.zip, { type: 'text' })} />
        <div className="text-destructive">{fields.zip.errors}</div>
      </div>
      <div>
        <Label htmlFor={fields.country.id}>Country</Label>
        <Input {...getInputProps(fields.country, { type: 'text' })} />
        <div className="text-destructive">{fields.country.errors}</div>
      </div>
      <div>
        <Label htmlFor={fields.prefecture.id}>Prefecture</Label>
        <Input {...getInputProps(fields.prefecture, { type: 'text' })} />
        <div className="text-destructive">{fields.prefecture.errors}</div>
      </div>
      <div>
        <Label htmlFor={fields.city.id}>City</Label>
        <Input {...getInputProps(fields.city, { type: 'text' })} />
        <div className="text-destructive">{fields.city.errors}</div>
      </div>
      <div>
        <Label htmlFor={fields.address.id}>Address</Label>
        <Input {...getInputProps(fields.address, { type: 'text' })} />
        <div className="text-destructive">{fields.address.errors}</div>
      </div>
      <div className="col-span-2">
        <Label htmlFor={fields.note.id}>Note</Label>
        <Textarea {...getTextareaProps(fields.note)} />
        <div className="text-destructive">{fields.note.errors}</div>
      </div>

      {form.errors && <div className="text-destructive">{form.errors}</div>}

      <div className="col-span-2">
        <Button
          className="w-full"
          isLoading={
            navigation.formData?.get('intent') === 'new' &&
            navigation.state === 'submitting' &&
            navigation.location.pathname === '/demo/db/sample_order'
          }
          type="submit"
          name="intent"
          value="new"
        >
          Submit
        </Button>
      </div>
    </Form>
  )
}
