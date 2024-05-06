import { getFormProps, useForm, useInputControl } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { z } from 'zod'
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

const schema = z.object({
  type: z.enum(['inside-form', 'outside-form']),
  option: z.enum(['option1', 'option2']).optional(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { type: null, option: null, lastResult: submission.reply() }
  }

  return {
    ...submission.value,
    lastResult: submission.reply({ resetForm: true }),
  }
}

const InsideForm = () => {
  const actionData = useActionData<typeof action>()
  const [form, { option }] = useForm({
    lastResult: actionData?.lastResult,
    defaultValue: {
      type: 'inside-form',
      option:
        actionData?.option && actionData.type === 'inside-form'
          ? actionData.option
          : 'option1',
    },
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    constraint: getZodConstraint(schema),
  })
  const optionControl = useInputControl(option)

  return (
    <Form method="POST" {...getFormProps(form)}>
      <input name="type" value="inside-form" type="hidden" />
      <Card>
        <CardHeader>Inside Form</CardHeader>
        <CardContent>
          <Stack>
            <div>
              <Label>Option</Label>
              <HStack>
                <Select
                  name={option.name}
                  value={option.value}
                  onValueChange={optionControl.change}
                >
                  <SelectTrigger
                    onBlur={optionControl.blur}
                    onFocus={optionControl.focus}
                  >
                    <SelectValue placeholder="Unselected" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option1</SelectItem>
                    <SelectItem value="option2">Option2</SelectItem>
                  </SelectContent>
                </Select>
                {option.value && (
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => optionControl.change('')}
                  >
                    Clear
                  </Button>
                )}
              </HStack>

              <div className="text-sm text-destructive">{option.errors}</div>
            </div>

            <Button disabled={!form.dirty}>Submit</Button>

            <div>
              {actionData?.type === 'inside-form' &&
                `action ${actionData?.type} executed: ${actionData?.option}`}
            </div>
          </Stack>
        </CardContent>
      </Card>
    </Form>
  )
}

const OutsideForm = () => {
  const actionData = useActionData<typeof action>()
  const [form, { option }] = useForm({
    lastResult: actionData?.lastResult,
    defaultValue: {
      type: 'outside-form',
      option:
        actionData?.option && actionData.type === 'outside-form'
          ? actionData.option
          : 'option1',
    },
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    constraint: getZodConstraint(schema),
  })
  const optionControl = useInputControl(option)

  return (
    <Card>
      <Form method="POST" {...getFormProps(form)}>
        <input name="type" value="outside-form" type="hidden" />
      </Form>
      <CardHeader>Outside Form</CardHeader>
      <CardContent>
        <Stack>
          <Label>Option</Label>
          <HStack>
            <Select
              value={optionControl.value}
              onValueChange={optionControl.change}
            >
              <SelectTrigger
                form={form.id}
                name={option.name}
                value={optionControl.value}
                onBlur={optionControl.blur}
                onFocus={optionControl.focus}
              >
                <SelectValue placeholder="Unselected" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option1</SelectItem>
                <SelectItem value="option2">Option2</SelectItem>
              </SelectContent>
            </Select>
            {option.value && (
              <Button
                type="button"
                variant="link"
                onClick={() => optionControl.change('')}
              >
                Clear
              </Button>
            )}
          </HStack>
          <div className="text-sm text-destructive">{option.errors}</div>

          <Button form={form.id} disabled={!form.dirty}>
            Submit
          </Button>

          <div>
            {actionData?.type === 'outside-form' &&
              `action ${actionData?.type} executed: ${actionData?.option}`}
          </div>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default function ConformSelect() {
  return (
    <Stack>
      <InsideForm />
      <OutsideForm />
    </Stack>
  )
}
