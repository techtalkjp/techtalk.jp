import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { twc } from 'react-twc'
import { z } from 'zod'
import {
  Button,
  Checkbox,
  HStack,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
  Switch,
  Textarea,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
} from '~/components/ui'

const Caption = twc.div`inline text-xs font-bold text-muted-foreground`
const FieldError = twc.div`text-destructive`

const schema = z.object({
  f1_text: z
    .string({ required_error: '必須' })
    .max(100, { message: '100文字以内で入力してください' }),
  f2_email: z
    .string({ required_error: '必須' })
    .email({ message: 'メールアドレスの形式で入力してください' })
    .max(500, { message: '500文字以内で入力してください' }),
  f3_search: z
    .string({ required_error: '必須' })
    .max(100, { message: '100文字以内で入力してください' }),
  f4_password: z
    .string({ required_error: '必須' })
    .max(100, { message: '100文字以内で入力してください' }),
  f5_url: z
    .string({ required_error: '必須' })
    .max(100, { message: '100文字以内で入力してください' })
    .url({ message: 'URLの形式で入力してください' }),
  f6_phone: z
    .string({ required_error: '必須' })
    .regex(
      /^\d{3}-\d{4}-\d{4}$/,
      '000-0000-0000形式で電話番号を入力してください',
    ),
  f7_number: z.number({ required_error: '必須' }),
  f8_range: z.number({ required_error: '必須' }).min(0).max(100),
  f9_date: z.date({
    required_error: '必須',
    message: '日付を入力してください',
  }),
  f10_datetime: z
    .string({ required_error: '必須' })
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: '日時を入力してください',
    })
    .transform((value) => new Date(value)),
  f11_time: z
    .string({ required_error: '必須' })
    .time({ message: '時間を入力してください' }),
  f12_month: z
    .string({ required_error: '必須' })
    .refine((value) => !Number.isNaN(new Date(value).getMonth())),
  f13_week: z.string({ required_error: '必須' }),
  f13_textarea: z.string({ required_error: '必須' }).min(1).max(1000, {
    message: '1000文字以内で入力してください',
  }),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  console.log(submission.value)
  return { lastResult: submission.reply() }
}

const testValues = {}

export default function ShadcnUiPage() {
  const actionData = useActionData<typeof action>()
  const [form, fields] = useForm({
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  })

  return (
    <Form {...getFormProps(form)} method="post">
      <Stack>
        <div className="text-right">
          <Button
            type="button"
            size="xs"
            onClick={() => {
              form.update({
                name: fields.f1_text.name,
                value: 'テキスト',
              })
              form.update({
                name: fields.f2_email.name,
                value: 'test@example.com',
              })
              form.update({
                name: fields.f3_search.name,
                value: '検索キーワード',
              })
              form.update({
                name: fields.f4_password.name,
                value: 'password',
              })
              form.update({
                name: fields.f5_url.name,
                value: 'https://example.com',
              })
              form.update({
                name: fields.f6_phone.name,
                value: '080-1234-5678',
              })
              form.update({
                name: fields.f7_number.name,
                value: 123,
              })
              form.update({
                name: fields.f8_range.name,
                value: 50,
              })
              form.update({
                name: fields.f9_date.name,
                value: '2022-01-01',
              })
              form.update({
                name: fields.f10_datetime.name,
                value: '2022-01-01T12:23:45',
              })
              form.update({
                name: fields.f11_time.name,
                value: '12:00:00',
              })
              form.update({
                name: fields.f12_month.name,
                value: '2022-01',
              })
              form.update({
                name: fields.f13_textarea.name,
                value: 'テキスト\nエ\nリ\nア\n',
              })
            }}
          >
            テスト入力
          </Button>
        </div>

        <h2 className="w-full flex-1 border-b text-2xl font-bold">
          Input (文字列)
        </h2>

        {/* input text */}
        <div>
          <h3>
            Input <small>text</small>
          </h3>
          <Input
            placeholder="テキスト"
            {...getInputProps(fields.f1_text, { type: 'text' })}
            key={fields.f1_text.key}
          />
          <FieldError>{fields.f1_text.errors}</FieldError>
        </div>

        {/* input email */}
        <div>
          <h3>
            Input <small>email</small>
          </h3>
          <Input
            placeholder="test@example.com"
            {...getInputProps(fields.f2_email, { type: 'email' })}
            key={fields.f2_email.key}
          />
          <FieldError>{fields.f2_email.errors}</FieldError>
        </div>

        {/* input search */}
        <div>
          <h3>
            Input <small>search</small>
          </h3>
          <Input
            placeholder="検索キーワード"
            {...getInputProps(fields.f3_search, { type: 'search' })}
            key={fields.f3_search.key}
          />
          <FieldError>{fields.f3_search.errors}</FieldError>
        </div>

        {/* input password */}
        <div>
          <h3>
            Input <small>password</small>
          </h3>
          <Input
            placeholder="パスワード"
            {...getInputProps(fields.f4_password, { type: 'password' })}
            key={fields.f4_password.key}
          />
          <FieldError>{fields.f4_password.errors}</FieldError>
        </div>

        {/* input url */}
        <div>
          <h3>
            Input <small>url</small>
          </h3>
          <Input
            placeholder="https://example.com"
            {...getInputProps(fields.f5_url, { type: 'url' })}
            key={fields.f5_url.key}
          />
          <FieldError>{fields.f5_url.errors}</FieldError>
        </div>

        {/* input tel */}
        <div>
          <h3>
            Input <small>tel</small>
          </h3>
          <Input
            placeholder="080-1234-5678"
            {...getInputProps(fields.f6_phone, { type: 'tel' })}
            key={fields.f6_phone.key}
          />
          <FieldError>{fields.f6_phone.errors}</FieldError>
        </div>

        <h2 className="w-full flex-1 border-b text-2xl font-bold">
          Input (数値)
        </h2>

        {/* input number */}
        <div>
          <h3>
            Input <small>number</small>
          </h3>
          <Input
            placeholder="123"
            {...getInputProps(fields.f7_number, { type: 'number' })}
            key={fields.f7_number.key}
          />
          <FieldError>{fields.f7_number.errors}</FieldError>
        </div>

        {/* input range */}
        <div>
          <h3>
            Input <small>range</small>
          </h3>
          <HStack>
            <Input
              {...getInputProps(fields.f8_range, { type: 'range' })}
              className="shadow-none"
              step={25}
              min={0}
              max={100}
              key={fields.f8_range.key}
            />
            <div>{fields.f8_range.value}</div>
          </HStack>
          <FieldError>{fields.f8_range.errors}</FieldError>
        </div>

        <h2 className="w-full flex-1 border-b text-2xl font-bold">
          Input (日付・時刻)
        </h2>

        {/* date */}
        <div>
          <h3>
            Input <small>date</small>
          </h3>
          <Input
            {...getInputProps(fields.f9_date, { type: 'date' })}
            key={fields.f9_date.key}
          />
          <FieldError>{fields.f9_date.errors}</FieldError>
        </div>

        {/* datetime-local */}
        <div>
          <h3>
            Input <small>datetime-local</small>
          </h3>
          <Input
            {...getInputProps(fields.f10_datetime, { type: 'datetime-local' })}
            step={1}
            key={fields.f10_datetime.key}
          />
          <FieldError>{fields.f10_datetime.errors}</FieldError>
        </div>

        {/* time */}
        <div>
          <h3>
            Input <small>time</small>
          </h3>
          <Input
            {...getInputProps(fields.f11_time, { type: 'time' })}
            step={1}
            key={fields.f11_time.key}
          />
          <FieldError>{fields.f11_time.errors}</FieldError>
        </div>

        {/* month */}
        <div>
          <h3>
            Input <small>month</small>
          </h3>
          <Input
            {...getInputProps(fields.f12_month, { type: 'month' })}
            key={fields.f12_month.key}
          />
          <FieldError>{fields.f12_month.errors}</FieldError>
        </div>

        {/* week */}
        <div>
          <h3>
            Input <small>week</small>
          </h3>
          <Input
            {...getInputProps(fields.f13_week, { type: 'week' })}
            key={fields.f13_week.key}
          />
          <FieldError>{fields.f13_week.errors}</FieldError>
        </div>

        {/* Textarea */}
        <div>
          <h3>Textarea</h3>
          <Textarea
            placeholder="テキストエリア"
            {...getTextareaProps(fields.f13_textarea)}
            key={fields.f13_textarea.key}
          />
          <FieldError>{fields.f13_textarea.errors}</FieldError>
        </div>

        <div>
          <h3>select</h3>
          <Select>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">a </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3>checkbox</h3>
          <HStack>
            <Checkbox />
            <Label>hoge</Label>
          </HStack>
        </div>

        <div>
          <h3>Radio Group</h3>
          <RadioGroup>
            <HStack>
              <RadioGroupItem value="a" />
              <Label>A</Label>
            </HStack>
            <HStack>
              <RadioGroupItem value="b" />
              <Label>B</Label>
            </HStack>
            <HStack>
              <RadioGroupItem value="c" />
              <Label>C</Label>
            </HStack>
          </RadioGroup>
        </div>

        <div>
          <h3>Switch</h3>
          <HStack>
            <Switch />
            <Label>Hoge</Label>
          </HStack>
        </div>

        <div>
          <h3>Toggle</h3>
          <Toggle>hogehoge</Toggle>
        </div>

        <div>
          <h3>
            Toggle Group <small>multiple</small>
          </h3>
          <ToggleGroup type="multiple">
            <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
            <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
            <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div>
          <h3>
            Toggle Group <small>single</small>
          </h3>
          <ToggleGroup type="single">
            <ToggleGroupItem value="start">Start</ToggleGroupItem>
            <ToggleGroupItem value="center">Center</ToggleGroupItem>
            <ToggleGroupItem value="end">End</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div>
          <h3>Input OTP</h3>
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div>{JSON.stringify(form.value)}</div>

        <Button>Submit</Button>
      </Stack>
    </Form>
  )
}
