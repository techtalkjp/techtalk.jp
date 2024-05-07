import { getFormProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, useActionData } from '@remix-run/react'
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
import { schema } from '../types'

export const InsideForm = () => {
  const TYPE = 'inside-form'
  const actionData = useActionData<typeof action>()
  const [form, { option }] = useForm({
    lastResult: actionData?.lastResult,
    defaultValue: {
      type: TYPE,
      option: actionData?.type === TYPE ? actionData.option ?? '' : 'option1',
    },
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
  })

  return (
    <Form method="POST" {...getFormProps(form)}>
      <input name="type" value={TYPE} type="hidden" />
      <input
        name={option.name}
        value={option.value}
        type="hidden"
        key={option.key}
      />
      <Card>
        <CardHeader>Inside Form</CardHeader>
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

            <Button disabled={!form.dirty}>Submit</Button>

            {actionData?.type === TYPE && (
              <ActionResult actionData={actionData} />
            )}
          </Stack>
        </CardContent>
      </Card>
    </Form>
  )
}
