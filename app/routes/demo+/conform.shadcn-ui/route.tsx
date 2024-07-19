import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { jsonWithSuccess } from 'remix-toast'
import { toast } from 'sonner'
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
  f14_checkbox: z.boolean({ required_error: '必須' }),
  f15_radio: z.string({ required_error: '必須' }),
  f16_file: z.instanceof(File).optional(),
  f17_color: z.string({ required_error: '必須' }),
  f18_textarea: z.string({ required_error: '必須' }).min(1).max(1000, {
    message: '1000文字以内で入力してください',
  }),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  console.log(submission.value)

  return jsonWithSuccess(
    { lastResult: submission.reply() },
    {
      message: 'フォームを送信しました',
      description: JSON.stringify(submission.value, null, 2),
    },
  )
}

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
        <HStack className="justify-end">
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
                name: fields.f13_week.name,
                value: '2022-W01',
              })
              form.update({
                name: fields.f14_checkbox.name,
                value: true,
              })
              form.update({
                name: fields.f15_radio.name,
                value: 'B',
              })
              form.update({
                name: fields.f17_color.name,
                value: '#ff0000',
              })
              form.update({
                name: fields.f18_textarea.name,
                value: 'テキスト\nエ\nリ\nア\n',
              })
              toast.info('フォームにテストデータを入力しました')
            }}
          >
            テストデータ入力
          </Button>
          <Button size="xs" {...form.reset.getButtonProps()}>
            リセット
          </Button>
        </HStack>

        <Stack>
          <h2 className="mt-4 w-full flex-1 border-b text-2xl font-bold">
            Input{' '}
            <small className="text-muted-foreground">
              text, email, search, password, url, tel
            </small>
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
            <div className="text-destructive-foreground">
              {' '}
              {fields.f1_text.errors}
            </div>
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
            <div className="text-destructive-foreground">
              {fields.f2_email.errors}
            </div>
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
            <div className="text-destructive-foreground">
              {fields.f3_search.errors}
            </div>
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
            <div className="text-destructive-foreground">
              {fields.f4_password.errors}
            </div>
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
            <div className="text-destructive-foreground">
              {fields.f5_url.errors}
            </div>
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
            <div className="text-destructive-foreground">
              {fields.f6_phone.errors}
            </div>
          </div>
        </Stack>

        <Stack>
          <h2 className="mt-4 w-full flex-1 border-b text-2xl font-bold">
            Input <small className="text-muted-foreground">number, range</small>
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
            <div className="text-destructive-foreground">
              {fields.f7_number.errors}
            </div>
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
            <div className="text-destructive-foreground">
              {fields.f8_range.errors}
            </div>
          </div>
        </Stack>

        <Stack>
          <h2 className="mt-4 w-full flex-1 border-b text-2xl font-bold">
            Input{' '}
            <small className="text-muted-foreground">
              date, datetime-local, time, month, week
            </small>
          </h2>

          {/* input date */}
          <div>
            <h3>
              Input <small>date</small>
            </h3>
            <Input
              {...getInputProps(fields.f9_date, { type: 'date' })}
              key={fields.f9_date.key}
            />
            <div className="text-destructive-foreground">
              {fields.f9_date.errors}
            </div>
          </div>

          {/* input datetime-local */}
          <div>
            <h3>
              Input <small>datetime-local</small>
            </h3>
            <Input
              {...getInputProps(fields.f10_datetime, {
                type: 'datetime-local',
              })}
              step={1}
              key={fields.f10_datetime.key}
            />
            <div className="text-destructive-foreground">
              {fields.f10_datetime.errors}
            </div>
          </div>

          {/* input time */}
          <div>
            <h3>
              Input <small>time</small>
            </h3>
            <Input
              {...getInputProps(fields.f11_time, { type: 'time' })}
              step={1}
              key={fields.f11_time.key}
            />
            <div className="text-destructive-foreground">
              {fields.f11_time.errors}
            </div>
          </div>

          {/* input month */}
          <div>
            <h3>
              Input <small>month</small>
            </h3>
            <Input
              {...getInputProps(fields.f12_month, { type: 'month' })}
              key={fields.f12_month.key}
            />
            <div className="text-destructive-foreground">
              {fields.f12_month.errors}
            </div>
          </div>

          {/* input week */}
          <div>
            <h3>
              Input <small>week</small>
            </h3>
            <Input
              {...getInputProps(fields.f13_week, { type: 'week' })}
              key={fields.f13_week.key}
            />
            <div className="text-destructive-foreground">
              {fields.f13_week.errors}
            </div>
          </div>
        </Stack>

        <Stack>
          <h2 className="mt-4 w-full flex-1 border-b text-2xl font-bold">
            Input{' '}
            <small className="text-muted-foreground">
              checkbox, radio, file, color
            </small>
          </h2>

          {/* input checkbox */}
          <div>
            <h3>Checkbox</h3>
            <HStack>
              <Input
                className="h-auto w-auto shadow-none"
                {...getInputProps(fields.f14_checkbox, { type: 'checkbox' })}
                key={fields.f14_checkbox.key}
              />
              <Label htmlFor={fields.f14_checkbox.id}>確認しました</Label>
            </HStack>
            <div className="text-destructive-foreground">
              {fields.f14_checkbox.errors}
            </div>
          </div>

          {/* input radio */}
          <div>
            <h3>Radio</h3>
            <fieldset>
              <HStack>
                <Input
                  className="h-auto w-auto shadow-none"
                  {...getInputProps(fields.f15_radio, {
                    type: 'radio',
                    value: 'A',
                  })}
                  id={`${fields.f15_radio.id}-A`}
                  key={fields.f15_radio.key}
                />
                <Label htmlFor={`${fields.f15_radio.id}-A`}>A</Label>
              </HStack>
              <HStack>
                <Input
                  className="h-auto w-auto shadow-none"
                  {...getInputProps(fields.f15_radio, {
                    type: 'radio',
                    value: 'B',
                  })}
                  id={`${fields.f15_radio.id}-B`}
                  key={fields.f15_radio.key}
                />
                <Label htmlFor={`${fields.f15_radio.id}-B`}>B</Label>
              </HStack>
              <HStack>
                <Input
                  className="h-auto w-auto shadow-none"
                  {...getInputProps(fields.f15_radio, {
                    type: 'radio',
                    value: 'C',
                  })}
                  id={`${fields.f15_radio.id}-C`}
                  key={fields.f15_radio.key}
                />
                <Label htmlFor={`${fields.f15_radio.id}-C`}>C</Label>
              </HStack>
            </fieldset>
            <div className="text-destructive-foreground">
              {fields.f15_radio.errors}
            </div>
          </div>

          <div>
            <h3>File</h3>
            <Input
              {...getInputProps(fields.f16_file, { type: 'file' })}
              key={fields.f16_file.key}
            />
            <div className="text-destructive-foreground">
              {fields.f16_file.errors}
            </div>
          </div>

          <div>
            <h3>Color</h3>
            <Input
              {...getInputProps(fields.f17_color, { type: 'color' })}
              key={fields.f17_color.key}
            />
            <div className="text-destructive-foreground">
              {fields.f17_color.errors}
            </div>
          </div>
        </Stack>

        <h2 className="mt-4 w-full flex-1 border-b text-2xl font-bold">
          Textarea
        </h2>
        {/* Textarea */}
        <div>
          <h3>Textarea</h3>
          <Textarea
            placeholder="テキストエリア"
            {...getTextareaProps(fields.f18_textarea)}
            key={fields.f18_textarea.key}
          />
          <div className="text-destructive-foreground">
            {fields.f18_textarea.errors}
          </div>
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
