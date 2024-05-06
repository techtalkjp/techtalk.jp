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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui'

const schema = z.object({
  type: z.enum(['inside-form', 'outside-form']),
  option: z.enum(['option1', 'option2']).optional(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return {
      type: null,
      option: null,
      now: new Date().toISOString(),
      lastResult: submission.reply(),
    }
  }

  return {
    ...submission.value,
    now: new Date().toISOString(),
    lastResult: submission.reply({ resetForm: true }),
  }
}

const ActionResult = ({
  actionData,
}: {
  actionData: Awaited<ReturnType<typeof action>>
}) => {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-4 rounded-md border p-4">
      <div className="col-span-2">Result</div>
      <div className="capitalize text-foreground/50">type</div>
      <div>{actionData.type}</div>
      <div className="capitalize text-foreground/50">now</div>
      <div>{actionData.now}</div>
      <div className="capitalize text-foreground/50">option</div>
      <div>{actionData.option ?? 'undefined'}</div>
    </div>
  )
}

const InsideForm = () => {
  const actionData = useActionData<typeof action>()
  const [form, { option }] = useForm({
    lastResult: actionData?.lastResult,
    defaultValue: {
      type: 'inside-form',
      option:
        actionData?.option && actionData.type === 'inside-form'
          ? actionData.option ?? ''
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
                  value={option.value ?? ''}
                  onValueChange={(value) => {
                    // なぜか name を指定していると初期状態で onValueChange で '' が渡されるので無視する
                    if (value !== '') {
                      optionControl.change(value)
                    }
                  }}
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

            {actionData?.type === 'inside-form' && (
              <ActionResult actionData={actionData} />
            )}
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
          ? actionData.option ?? ''
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
          <div>
            <Label>Option</Label>
            <HStack>
              <Select
                value={optionControl.value}
                onValueChange={optionControl.change}
              >
                <SelectTrigger
                  form={form.id}
                  name={option.name}
                  value={optionControl.value ?? ''}
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

          <Button form={form.id} disabled={!form.dirty}>
            Submit
          </Button>

          {actionData?.type === 'outside-form' && (
            <ActionResult actionData={actionData} />
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default function ConformSelect() {
  return (
    <Stack>
      <Tabs defaultValue="inside-form">
        <TabsList>
          <TabsTrigger value="inside-form">Inside Form</TabsTrigger>
          <TabsTrigger value="outside-form">Outside Form</TabsTrigger>
        </TabsList>
        <TabsContent value="inside-form">
          <InsideForm />
        </TabsContent>
        <TabsContent value="outside-form">
          <OutsideForm />
        </TabsContent>
      </Tabs>
    </Stack>
  )
}
