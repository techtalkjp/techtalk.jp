import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
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
import { getSelectProps, getSelectTriggerProps } from './helper'

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
  f19_select: z.enum(['apple', 'peach', 'strawberry', 'cherry', 'plum'], {
    required_error: '必須',
    message: 'いずれかを選択してください',
  }),
  f20_selectWithHelper: z.enum(
    ['apple', 'peach', 'strawberry', 'cherry', 'plum'],
    {
      required_error: '必須',
      message: 'いずれかを選択してください',
    },
  ),
})

const testData = {
  f1_text: 'テキスト',
  f2_email: 'test@example.com',
  f3_search: '検索キーワード',
  f4_password: 'password',
  f5_url: 'https://example.com',
  f6_phone: '080-1234-5678',
  f7_number: 123,
  f8_range: 50,
  f9_date: '2022-01-01',
  f10_datetime: '2022-01-01T12:23:45',
  f11_time: '12:00:00',
  f12_month: '2022-01',
  f13_week: '2022-W01',
  f14_checkbox: true,
  f15_radio: 'B',
  f17_color: '#ff0000',
  f18_textarea: 'テキスト\nエ\nリ\nア\n',
  f19_select: 'apple',
  f20_selectWithHelper: 'apple',
}

export const loader = ({ request }: LoaderFunctionArgs) => {
  return { defaultValue: {} }
}

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
  const { defaultValue } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const [form, fields] = useForm({
    defaultValue: { ...defaultValue },
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  })

  const handleClickSetTestData = () => {
    form.update({
      name: fields.f1_text.name,
      value: testData.f1_text,
    })
    form.update({
      name: fields.f2_email.name,
      value: testData.f2_email,
    })
    form.update({
      name: fields.f3_search.name,
      value: testData.f3_search,
    })
    form.update({
      name: fields.f4_password.name,
      value: testData.f4_password,
    })
    form.update({
      name: fields.f5_url.name,
      value: testData.f5_url,
    })
    form.update({
      name: fields.f6_phone.name,
      value: testData.f6_phone,
    })
    form.update({
      name: fields.f7_number.name,
      value: testData.f7_number,
    })
    form.update({
      name: fields.f8_range.name,
      value: testData.f8_range,
    })
    form.update({
      name: fields.f9_date.name,
      value: testData.f9_date,
    })
    form.update({
      name: fields.f10_datetime.name,
      value: testData.f10_datetime,
    })
    form.update({
      name: fields.f11_time.name,
      value: testData.f11_time,
    })
    form.update({
      name: fields.f12_month.name,
      value: testData.f12_month,
    })
    form.update({
      name: fields.f13_week.name,
      value: testData.f13_week,
    })
    form.update({
      name: fields.f14_checkbox.name,
      value: testData.f14_checkbox,
    })
    form.update({
      name: fields.f15_radio.name,
      value: testData.f15_radio,
    })
    form.update({
      name: fields.f17_color.name,
      value: testData.f17_color,
    })
    form.update({
      name: fields.f18_textarea.name,
      value: testData.f18_textarea,
    })
    form.update({
      name: fields.f19_select.name,
      value: testData.f19_select,
    })
    form.update({
      name: fields.f20_selectWithHelper.name,
      value: testData.f20_selectWithHelper,
    })
    toast.info('フォームにテストデータを入力しました')
  }

  return (
    <Form {...getFormProps(form)} method="post">
      <Stack>
        <HStack className="justify-end">
          <Button
            type="button"
            size="xs"
            onClick={() => handleClickSetTestData()}
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
            <Label htmlFor={fields.f1_text.id}>
              Input <small>text</small>
            </Label>
            <Input
              placeholder="テキスト"
              {...getInputProps(fields.f1_text, { type: 'text' })}
              key={fields.f1_text.key}
            />
            <div id={fields.f1_text.errorId} className="text-destructive">
              {fields.f1_text.errors}
            </div>
          </div>

          {/* input email */}
          <div>
            <Label htmlFor={fields.f2_email.id}>
              Input <small>email</small>
            </Label>
            <Input
              placeholder="test@example.com"
              {...getInputProps(fields.f2_email, { type: 'email' })}
              key={fields.f2_email.key}
            />
            <div id={fields.f2_email.errorId} className="text-destructive">
              {fields.f2_email.errors}
            </div>
          </div>

          {/* input search */}
          <div>
            <Label htmlFor={fields.f3_search.id}>
              Input <small>search</small>
            </Label>
            <Input
              placeholder="検索キーワード"
              {...getInputProps(fields.f3_search, { type: 'search' })}
              key={fields.f3_search.key}
            />
            <div id={fields.f3_search.errorId} className="text-destructive">
              {fields.f3_search.errors}
            </div>
          </div>

          {/* input password */}
          <div>
            <Label htmlFor={fields.f4_password.id}>
              Input <small>password</small>
            </Label>
            <Input
              placeholder="パスワード"
              {...getInputProps(fields.f4_password, { type: 'password' })}
              key={fields.f4_password.key}
            />
            <div id={fields.f4_password.errorId} className="text-destructive">
              {fields.f4_password.errors}
            </div>
          </div>

          {/* input url */}
          <div>
            <Label htmlFor={fields.f5_url.id}>
              Input <small>url</small>
            </Label>
            <Input
              placeholder="https://example.com"
              {...getInputProps(fields.f5_url, { type: 'url' })}
              key={fields.f5_url.key}
            />
            <div id={fields.f5_url.errorId} className="text-destructive">
              {fields.f5_url.errors}
            </div>
          </div>

          {/* input tel */}
          <div>
            <Label htmlFor={fields.f6_phone.id}>
              Input <small>tel</small>
            </Label>
            <Input
              placeholder="080-1234-5678"
              {...getInputProps(fields.f6_phone, { type: 'tel' })}
              key={fields.f6_phone.key}
            />
            <div id={fields.f6_phone.errorId} className="text-destructive">
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
            <Label htmlFor={fields.f7_number.id}>
              Input <small>number</small>
            </Label>
            <Input
              placeholder="123"
              {...getInputProps(fields.f7_number, { type: 'number' })}
              key={fields.f7_number.key}
            />
            <div id={fields.f7_number.errorId} className="text-destructive">
              {fields.f7_number.errors}
            </div>
          </div>

          {/* input range */}
          <div>
            <Label htmlFor={fields.f8_range.id}>
              Input <small>range</small>
            </Label>
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
            <div id={fields.f8_range.errorId} className="text-destructive">
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
            <Label htmlFor={fields.f9_date.id}>
              Input <small>date</small>
            </Label>
            <Input
              {...getInputProps(fields.f9_date, { type: 'date' })}
              key={fields.f9_date.key}
            />
            <div id={fields.f9_date.errorId} className="text-destructive">
              {fields.f9_date.errors}
            </div>
          </div>

          {/* input datetime-local */}
          <div>
            <Label htmlFor={fields.f10_datetime.id}>
              Input <small>datetime-local</small>
            </Label>
            <Input
              {...getInputProps(fields.f10_datetime, {
                type: 'datetime-local',
              })}
              step={1}
              key={fields.f10_datetime.key}
            />
            <div id={fields.f10_datetime.errorId} className="text-destructive">
              {fields.f10_datetime.errors}
            </div>
          </div>

          {/* input time */}
          <div>
            <Label htmlFor={fields.f11_time.id}>
              Input <small>time</small>
            </Label>
            <Input
              {...getInputProps(fields.f11_time, { type: 'time' })}
              step={1}
              key={fields.f11_time.key}
            />
            <div id={fields.f11_time.errorId} className="text-destructive">
              {fields.f11_time.errors}
            </div>
          </div>

          {/* input month */}
          <div>
            <Label htmlFor={fields.f12_month.id}>
              Input <small>month</small>
            </Label>
            <Input
              {...getInputProps(fields.f12_month, { type: 'month' })}
              key={fields.f12_month.key}
            />
            <div id={fields.f12_month.errorId} className="text-destructive">
              {fields.f12_month.errors}
            </div>
          </div>

          {/* input week */}
          <div>
            <Label htmlFor={fields.f13_week.id}>
              Input <small>week</small>
            </Label>
            <Input
              {...getInputProps(fields.f13_week, { type: 'week' })}
              key={fields.f13_week.key}
            />
            <div id={fields.f13_week.errorId} className="text-destructive">
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
            <div>Checkbox</div>
            <HStack>
              <Input
                className="h-auto w-auto cursor-pointer shadow-none"
                {...getInputProps(fields.f14_checkbox, { type: 'checkbox' })}
                key={fields.f14_checkbox.key}
              />
              <Label htmlFor={fields.f14_checkbox.id}>確認しました</Label>
            </HStack>
            <div id={fields.f14_checkbox.errorId} className="text-destructive">
              {fields.f14_checkbox.errors}
            </div>
          </div>

          {/* input radio */}
          <div>
            <div>Radio</div>
            <fieldset>
              <legend>ラジオボタン</legend>
              <HStack>
                <Input
                  className="h-auto w-auto cursor-pointer shadow-none"
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
                  className="h-auto w-auto cursor-pointer shadow-none"
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
                  className="h-auto w-auto cursor-pointer shadow-none"
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
            <div id={fields.f15_radio.errorId} className="text-destructive">
              {fields.f15_radio.errors}
            </div>
          </div>

          <div>
            <Label htmlFor={fields.f16_file.id}>File</Label>
            <Input
              className="cursor-pointer"
              {...getInputProps(fields.f16_file, { type: 'file' })}
              key={fields.f16_file.key}
            />
            <div id={fields.f16_file.errorId} className="text-destructive">
              {fields.f16_file.errors}
            </div>
          </div>

          <div>
            <Label htmlFor={fields.f17_color.id}>Color</Label>
            <Input
              className="cursor-pointer"
              {...getInputProps(fields.f17_color, { type: 'color' })}
              key={fields.f17_color.key}
            />
            <div id={fields.f17_color.errorId} className="text-destructive">
              {fields.f17_color.errors}
            </div>
          </div>
        </Stack>

        <Stack>
          <h2 className="mt-4 w-full flex-1 border-b text-2xl font-bold">
            Textarea
          </h2>

          {/* Textarea */}
          <div>
            <Label htmlFor={fields.f18_textarea.id}>Textarea</Label>
            <Textarea
              placeholder="テキストエリア"
              {...getTextareaProps(fields.f18_textarea)}
              key={fields.f18_textarea.key}
            />
            <div id={fields.f18_textarea.errorId} className="text-destructive">
              {fields.f18_textarea.errors}
            </div>
          </div>
        </Stack>

        <Stack>
          <h2 className="mt-4 w-full flex-1 border-b text-2xl font-bold">
            Select
          </h2>
          {/* Select */}
          <div>
            <Label htmlFor={fields.f19_select.id}>Select</Label>
            <HStack>
              <Select
                name={fields.f19_select.name}
                required={fields.f19_select.required}
                defaultValue={fields.f19_select.initialValue}
                key={fields.f19_select.key}
                onValueChange={(value) => {
                  form.update({
                    name: fields.f19_select.name,
                    value,
                  })
                }}
              >
                <SelectTrigger
                  id={fields.f19_select.id}
                  className={'aria-invalid:border-destructive'}
                  aria-invalid={!fields.f19_select.valid || undefined}
                  aria-describedby={
                    !fields.f19_select.valid
                      ? fields.f19_select.errorId
                      : undefined
                  }
                >
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">りんご</SelectItem>
                  <SelectItem value="peach">もも</SelectItem>
                  <SelectItem value="strawberry">いちご</SelectItem>
                  <SelectItem value="cherry">さくらんぼ</SelectItem>
                  <SelectItem value="plum">うめ</SelectItem>
                </SelectContent>
              </Select>

              {/* 選択解除 */}
              {fields.f19_select.value && (
                <Button
                  type="button"
                  variant="link"
                  size="xs"
                  onClick={() => {
                    form.update({
                      name: fields.f19_select.name,
                      value: '',
                    })
                  }}
                >
                  Clear
                </Button>
              )}
            </HStack>
            <div id={fields.f19_select.errorId} className="text-destructive">
              {fields.f19_select.errors}
            </div>
          </div>

          {/* Select with controll */}
          <div>
            <Label htmlFor={fields.f20_selectWithHelper.id}>
              Select <small>Control</small>
            </Label>
            <HStack>
              <Select
                {...getSelectProps(fields.f20_selectWithHelper)}
                key={fields.f20_selectWithHelper.key}
                onValueChange={(value) => {
                  form.update({
                    name: fields.f20_selectWithHelper.name,
                    value,
                  })
                }}
              >
                <SelectTrigger
                  {...getSelectTriggerProps(fields.f20_selectWithHelper)}
                  className={
                    fields.f20_selectWithHelper.errors && 'border-destructive'
                  }
                >
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">りんご</SelectItem>
                  <SelectItem value="peach">もも</SelectItem>
                  <SelectItem value="strawberry">いちご</SelectItem>
                  <SelectItem value="cherry">さくらんぼ</SelectItem>
                  <SelectItem value="plum">うめ</SelectItem>
                </SelectContent>
              </Select>

              {/* 選択解除 */}
              {fields.f20_selectWithHelper.value && (
                <Button
                  type="button"
                  variant="link"
                  size="xs"
                  onClick={() => {
                    form.update({
                      name: fields.f20_selectWithHelper.name,
                      value: '',
                    })
                  }}
                >
                  Clear
                </Button>
              )}
            </HStack>
            <div
              id={fields.f20_selectWithHelper.errorId}
              className="text-destructive"
            >
              {fields.f20_selectWithHelper.errors}
            </div>
          </div>
        </Stack>

        <div>
          <h3>checkbox</h3>
          <HStack>
            <Checkbox id="hoge" />
            <Label htmlFor="hoge">hoge</Label>
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
