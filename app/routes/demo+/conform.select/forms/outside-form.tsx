import { getFormProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, useActionData } from 'react-router'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  HStack,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
} from '~/components/ui'
import { ActionResult } from '../components'
import type { action } from '../route'
import { FormType, schema } from '../types'

export const OutsideForm = () => {
  const actionData = useActionData<typeof action>()
  const [form, { option }] = useForm({
    lastResult: actionData?.lastResult,
    defaultValue: {
      formType: FormType.OUTSIDE_FORM,
      option:
        actionData?.formType === FormType.OUTSIDE_FORM
          ? (actionData.option ?? '')
          : 'option1',
    },
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    constraint: getZodConstraint(schema),
  })

  return (
    <Card>
      <Form method="POST" {...getFormProps(form)}>
        <input name="formType" value={FormType.OUTSIDE_FORM} type="hidden" />
        <input
          name={option.name}
          value={option.value}
          type="hidden"
          key={option.key}
        />
      </Form>
      <CardHeader>Outside Form</CardHeader>
      <CardContent>
        <Stack>
          <div>
            <Label htmlFor={option.id}>Option</Label>
            <HStack>
              <Select
                value={option.value ?? ''}
                onValueChange={(value) => {
                  form.update({
                    name: option.name,
                    value,
                  })
                }}
              >
                <SelectTrigger id={option.id}>
                  <SelectValue placeholder="Unselected" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option1</SelectItem>
                  <SelectItem value="option2">Option2</SelectItem>
                </SelectContent>
              </Select>
              {option.value && (
                <Button
                  variant="link"
                  {...form.update.getButtonProps({
                    name: option.name,
                    value: '',
                  })}
                >
                  Clear
                </Button>
              )}
            </HStack>
            <div className="text-sm text-destructive">{option.errors}</div>
          </div>

          <Button form={form.id} disabled={!form.dirty}>
            Submit
          </Button>

          {actionData?.formType === FormType.OUTSIDE_FORM && (
            <ActionResult actionData={actionData} />
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
