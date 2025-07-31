import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { Form } from 'react-router'
import { twc } from 'react-twc'
import { dataWithError, dataWithSuccess } from 'remix-toast'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  Button,
  Checkbox,
  FormDescription,
  FormField,
  FormMessage,
  HStack,
  Input,
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
} from '~/components/ui'
import type { Route } from './+types/route'
import {
  getCheckboxProps,
  getRadioGroupProps,
  getSelectProps,
  getSelectTriggerProps,
  getSwitchProps,
} from './helper'

const Section = twc(Stack)``
const SectionHeading = twc.h2`mt-4 w-full flex-1 border-b text-2xl font-bold`

const schema = z.object({
  f1_text: z
    .string({ error: '必須' })
    .max(100, { message: '100文字以内で入力してください' }),
  f2_email: z
    .email({ error: '必須' })
    .max(500, { message: '500文字以内で入力してください' }),
  f3_search: z
    .string({ error: '必須' })
    .max(100, { message: '100文字以内で入力してください' }),
  f4_password: z
    .string({ error: '必須' })
    .max(100, { message: '100文字以内で入力してください' }),
  f5_url: z
    .url({ error: '必須' })
    .max(100, { message: '100文字以内で入力してください' }),
  f6_phone: z
    .string({ error: '必須' })
    .regex(
      /^\d{3}-\d{4}-\d{4}$/,
      '000-0000-0000形式で電話番号を入力してください',
    ),
  f7_number: z.number({ error: '必須' }),
  f8_range: z.number({ error: '必須' }).min(0).max(100),
  f9_date: z.date({
    error: '必須',
  }),
  f10_datetime: z
    .string({ error: '必須' })
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: '日時を入力してください',
    })
    .transform((value) => new Date(value)),
  f11_time: z
    .string({ error: '必須' })
    .time({ message: '時間を入力してください' }),
  f12_month: z
    .string({ error: '必須' })
    .refine((value) => !Number.isNaN(new Date(value).getMonth())),
  f13_week: z.string({ error: '必須' }),
  f14_checkbox: z.boolean({ error: '必須' }),
  f15_radio: z.enum(['all', 'mention', 'nothing'], {
    error: '必須',
  }),
  f16_file: z.instanceof(File).optional(),
  f17_color: z.string({ error: '必須' }),
  f18_textarea: z.string({ error: '必須' }).min(1).max(1000, {
    message: '1000文字以内で入力してください',
  }),
  f19_select: z.enum(['apple', 'peach', 'strawberry', 'cherry', 'plum'], {
    error: '必須',
  }),
  f20_selectWithHelper: z.enum(
    ['apple', 'peach', 'strawberry', 'cherry', 'plum'],
    {
      error: '必須',
    },
  ),
  f21_checkbox: z.boolean({ error: '必須' }),
  f22_checkboxWithHelper: z.boolean({ error: '必須' }),
  f23_switch: z.boolean({ error: '必須' }),
  f24_switchWithHelper: z.boolean({ error: '必須' }),
  f25_radioGroup: z.enum(['all', 'mention', 'nothing'], {
    error: '必須',
  }),
  f26_radioGroupWithHelper: z.enum(['all', 'mention', 'nothing'], {
    error: '必須',
  }),
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
  f15_radio: 'all',
  f17_color: '#ff0000',
  f18_textarea: 'テキスト\nエ\nリ\nア\n',
  f19_select: 'apple',
  f20_selectWithHelper: 'apple',
  f21_checkbox: 'on',
  f22_checkboxWithHelper: 'on',
  f23_switch: 'on',
  f24_switchWithHelper: 'on',
  f25_radioGroup: 'all',
  f26_radioGroupWithHelper: 'all',
}

export const loader = () => {
  return {
    defaultValue: {},
  }
}

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return dataWithError(
      { lastResult: submission.reply() },
      { message: 'エラー' },
    )
  }

  return dataWithSuccess(
    { lastResult: submission.reply() },
    {
      message: 'フォームを送信しました',
      description: JSON.stringify(submission.value, null, 2),
    },
  )
}

export default function ShadcnUiPage({
  loaderData: { defaultValue },
  actionData,
}: Route.ComponentProps) {
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
      name: form.name,
      value: testData,
    })
    toast.info('フォームにテストデータを入力しました')
  }

  return (
    <Form {...getFormProps(form)} method="post">
      <Stack>
        <HStack className="justify-end">
          <Button
            type="button"
            size="sm"
            onClick={() => handleClickSetTestData()}
          >
            テストデータ入力
          </Button>
          <Button size="sm" {...form.reset.getButtonProps()}>
            リセット
          </Button>
        </HStack>

        <Section>
          <SectionHeading id="input">
            Input{' '}
            <small className="text-muted-foreground">
              text, email, search, password, url, tel
            </small>
          </SectionHeading>

          {/* input text */}
          <FormField>
            <Label htmlFor={fields.f1_text.id}>
              Input <small>text</small>
            </Label>
            <Input
              placeholder="テキスト"
              {...getInputProps(fields.f1_text, { type: 'text' })}
            />
            <FormMessage id={fields.f1_text.errorId}>
              {fields.f1_text.errors}
            </FormMessage>
          </FormField>

          {/* input email */}
          <FormField>
            <Label htmlFor={fields.f2_email.id}>
              Input <small>email</small>
            </Label>
            <Input
              placeholder="test@example.com"
              {...getInputProps(fields.f2_email, { type: 'email' })}
            />
            <FormMessage id={fields.f2_email.errorId}>
              {fields.f2_email.errors}
            </FormMessage>
          </FormField>

          {/* input search */}
          <FormField>
            <Label htmlFor={fields.f3_search.id}>
              Input <small>search</small>
            </Label>
            <Input
              placeholder="検索キーワード"
              {...getInputProps(fields.f3_search, { type: 'search' })}
            />
            <FormMessage id={fields.f3_search.errorId}>
              {fields.f3_search.errors}
            </FormMessage>
          </FormField>

          {/* input password */}
          <FormField>
            <Label htmlFor={fields.f4_password.id}>
              Input <small>password</small>
            </Label>
            <Input
              placeholder="パスワード"
              {...getInputProps(fields.f4_password, { type: 'password' })}
            />
            <FormMessage id={fields.f4_password.errorId}>
              {fields.f4_password.errors}
            </FormMessage>
          </FormField>

          {/* input url */}
          <FormField>
            <Label htmlFor={fields.f5_url.id}>
              Input <small>url</small>
            </Label>
            <Input
              placeholder="https://example.com"
              {...getInputProps(fields.f5_url, { type: 'url' })}
            />
            <FormMessage id={fields.f5_url.errorId}>
              {fields.f5_url.errors}
            </FormMessage>
          </FormField>

          {/* input tel */}
          <FormField>
            <Label htmlFor={fields.f6_phone.id}>
              Input <small>tel</small>
            </Label>
            <Input
              placeholder="080-1234-5678"
              {...getInputProps(fields.f6_phone, { type: 'tel' })}
            />
            <FormMessage id={fields.f6_phone.errorId}>
              {fields.f6_phone.errors}
            </FormMessage>
          </FormField>
        </Section>

        <Section>
          <SectionHeading id="input_number">
            Input <small className="text-muted-foreground">number, range</small>
          </SectionHeading>

          {/* input number */}
          <FormField>
            <Label htmlFor={fields.f7_number.id}>
              Input <small>number</small>
            </Label>
            <Input
              placeholder="123"
              {...getInputProps(fields.f7_number, { type: 'number' })}
            />
            <FormMessage id={fields.f7_number.errorId}>
              {fields.f7_number.errors}
            </FormMessage>
          </FormField>

          {/* input range */}
          <FormField>
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
              />
              <div>{fields.f8_range.value}</div>
            </HStack>
            <FormMessage id={fields.f8_range.errorId}>
              {fields.f8_range.errors}
            </FormMessage>
          </FormField>
        </Section>

        <Section>
          <SectionHeading id="input_date">
            Input{' '}
            <small className="text-muted-foreground">
              date, datetime-local, time, month, week
            </small>
          </SectionHeading>

          {/* input date */}
          <FormField>
            <Label htmlFor={fields.f9_date.id}>
              Input <small>date</small>
            </Label>
            <Input {...getInputProps(fields.f9_date, { type: 'date' })} />
            <FormMessage id={fields.f9_date.errorId}>
              {fields.f9_date.errors}
            </FormMessage>
          </FormField>

          {/* input datetime-local */}
          <FormField>
            <Label htmlFor={fields.f10_datetime.id}>
              Input <small>datetime-local</small>
            </Label>
            <Input
              {...getInputProps(fields.f10_datetime, {
                type: 'datetime-local',
              })}
              step={1}
            />
            <FormMessage id={fields.f10_datetime.errorId}>
              {fields.f10_datetime.errors}
            </FormMessage>
          </FormField>

          {/* input time */}
          <FormField>
            <Label htmlFor={fields.f11_time.id}>
              Input <small>time</small>
            </Label>
            <Input
              {...getInputProps(fields.f11_time, { type: 'time' })}
              step={1}
            />
            <FormField id={fields.f11_time.errorId}>
              {fields.f11_time.errors}
            </FormField>
          </FormField>

          {/* input month */}
          <FormField>
            <Label htmlFor={fields.f12_month.id}>
              Input <small>month</small>
            </Label>
            <Input {...getInputProps(fields.f12_month, { type: 'month' })} />
            <FormMessage id={fields.f12_month.errorId}>
              {fields.f12_month.errors}
            </FormMessage>
          </FormField>

          {/* input week */}
          <FormField>
            <Label htmlFor={fields.f13_week.id}>
              Input <small>week</small>
            </Label>
            <Input {...getInputProps(fields.f13_week, { type: 'week' })} />
            <FormMessage id={fields.f13_week.errorId}>
              {fields.f13_week.errors}
            </FormMessage>
          </FormField>
        </Section>

        <Section>
          <SectionHeading id="input_others">
            Input{' '}
            <small className="text-muted-foreground">
              checkbox, radio, file, color
            </small>
          </SectionHeading>

          {/* input checkbox */}
          <FormField>
            <FormDescription>Checkbox</FormDescription>
            <HStack>
              <Input
                className="h-auto w-auto cursor-pointer shadow-none"
                {...getInputProps(fields.f14_checkbox, { type: 'checkbox' })}
              />
              <Label
                htmlFor={fields.f14_checkbox.id}
                className="cursor-pointer"
              >
                確認しました
              </Label>
            </HStack>
            <FormMessage id={fields.f14_checkbox.errorId}>
              {fields.f14_checkbox.errors}
            </FormMessage>
          </FormField>

          {/* input radio */}
          <FormField>
            <FormDescription>Radio</FormDescription>
            <fieldset>
              <legend>通知設定</legend>
              <HStack>
                <Input
                  className="h-auto w-auto cursor-pointer shadow-none"
                  {...getInputProps(fields.f15_radio, {
                    type: 'radio',
                    value: 'all',
                  })}
                  id={`${fields.f15_radio.id}-all`}
                />
                <Label
                  htmlFor={`${fields.f15_radio.id}-all`}
                  className="cursor-pointer"
                >
                  すべての新着メッセージ
                </Label>
              </HStack>
              <HStack>
                <Input
                  className="h-auto w-auto cursor-pointer shadow-none"
                  {...getInputProps(fields.f15_radio, {
                    type: 'radio',
                    value: 'mention',
                  })}
                  id={`${fields.f15_radio.id}-mention`}
                />
                <Label
                  htmlFor={`${fields.f15_radio.id}-mention`}
                  className="cursor-pointer"
                >
                  DMとメンション
                </Label>
              </HStack>
              <HStack>
                <Input
                  className="h-auto w-auto cursor-pointer shadow-none"
                  {...getInputProps(fields.f15_radio, {
                    type: 'radio',
                    value: 'nothing',
                  })}
                  id={`${fields.f15_radio.id}-nothing`}
                />
                <Label
                  htmlFor={`${fields.f15_radio.id}-nothing`}
                  className="cursor-pointer"
                >
                  なし
                </Label>
              </HStack>
            </fieldset>
            <FormMessage id={fields.f15_radio.errorId}>
              {fields.f15_radio.errors}
            </FormMessage>
          </FormField>

          <FormField>
            <Label htmlFor={fields.f16_file.id}>File</Label>
            <Input
              className="cursor-pointer"
              {...getInputProps(fields.f16_file, { type: 'file' })}
            />
            <FormMessage id={fields.f16_file.errorId}>
              {fields.f16_file.errors}
            </FormMessage>
          </FormField>

          <FormField>
            <Label htmlFor={fields.f17_color.id}>Color</Label>
            <Input
              className="cursor-pointer"
              {...getInputProps(fields.f17_color, { type: 'color' })}
            />
            <FormMessage id={fields.f17_color.errorId}>
              {fields.f17_color.errors}
            </FormMessage>
          </FormField>
        </Section>

        <Section>
          <SectionHeading id="textarea">Textarea</SectionHeading>

          {/* Textarea */}
          <FormField>
            <Label htmlFor={fields.f18_textarea.id}>Textarea</Label>
            <Textarea
              placeholder="テキストエリア"
              {...getTextareaProps(fields.f18_textarea)}
            />
            <FormMessage id={fields.f18_textarea.errorId}>
              {fields.f18_textarea.errors}
            </FormMessage>
          </FormField>
        </Section>

        <Section>
          <SectionHeading id="select">Select</SectionHeading>
          {/* Select */}
          <FormField>
            <Label htmlFor={fields.f19_select.id}>Select</Label>
            <HStack>
              <Select
                name={fields.f19_select.name}
                required={fields.f19_select.required}
                defaultValue={fields.f19_select.initialValue}
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
                  size="sm"
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
            <FormMessage id={fields.f19_select.errorId}>
              {fields.f19_select.errors}
            </FormMessage>
          </FormField>

          {/* Select with helper */}
          <FormField>
            <Label htmlFor={fields.f20_selectWithHelper.id}>
              Select <small>with helper</small>
            </Label>
            <HStack>
              <Select
                {...getSelectProps(fields.f20_selectWithHelper)}
                onValueChange={(value) => {
                  form.update({
                    name: fields.f20_selectWithHelper.name,
                    value,
                  })
                }}
              >
                <SelectTrigger
                  {...getSelectTriggerProps(fields.f20_selectWithHelper)}
                  className="aria-invalid:border-destructive"
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
                  size="sm"
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
            <FormField id={fields.f20_selectWithHelper.errorId}>
              {fields.f20_selectWithHelper.errors}
            </FormField>
          </FormField>
        </Section>

        <Section>
          <SectionHeading id="checkbox">Checkbox</SectionHeading>
          <FormField>
            <FormDescription>Checkbox</FormDescription>
            <HStack>
              <Checkbox
                id={fields.f21_checkbox.id}
                name={fields.f21_checkbox.name}
                required={fields.f21_checkbox.required}
                defaultChecked={fields.f21_checkbox.initialValue === 'on'}
                aria-invalid={!fields.f21_checkbox.valid || undefined}
                aria-describedby={
                  !fields.f21_checkbox.valid
                    ? fields.f21_checkbox.errorId
                    : undefined
                }
                className="aria-invalid:border-destructive"
                onCheckedChange={(value) => {
                  form.update({
                    name: fields.f21_checkbox.name,
                    value,
                  })
                }}
              />
              <Label
                htmlFor={fields.f21_checkbox.id}
                className="cursor-pointer"
              >
                確認しました
              </Label>
            </HStack>
            <FormMessage id={fields.f21_checkbox.errorId}>
              {fields.f21_checkbox.errors}
            </FormMessage>
          </FormField>

          <FormField>
            <FormDescription>
              Checkbox <small>with helper</small>
            </FormDescription>
            <HStack>
              <Checkbox
                {...getCheckboxProps(fields.f22_checkboxWithHelper, {
                  ariaAttributes: true,
                })}
                className="aria-invalid:border-destructive"
                onCheckedChange={(value) => {
                  form.update({
                    name: fields.f22_checkboxWithHelper.name,
                    value,
                  })
                }}
              />
              <Label
                htmlFor={fields.f22_checkboxWithHelper.id}
                className="cursor-pointer"
              >
                確認しました
              </Label>
            </HStack>
            <FormMessage id={fields.f22_checkboxWithHelper.errorId}>
              {fields.f22_checkboxWithHelper.errors}
            </FormMessage>
          </FormField>
        </Section>

        <Section>
          <SectionHeading id="switch">Switch</SectionHeading>
          <FormField>
            <FormDescription>Switch</FormDescription>
            <HStack>
              <Switch
                id={fields.f23_switch.id}
                name={fields.f23_switch.name}
                aria-invalid={!fields.f23_switch.valid || undefined}
                aria-describedby={
                  !fields.f23_switch.valid
                    ? fields.f23_switch.errorId
                    : undefined
                }
                defaultChecked={fields.f23_switch.initialValue === 'on'}
                className="aria-invalid:border-destructive"
                onCheckedChange={(value) => {
                  form.update({
                    name: fields.f23_switch.name,
                    value,
                  })
                }}
              />
              <Label htmlFor={fields.f23_switch.id} className="cursor-pointer">
                OK
              </Label>
            </HStack>
            <FormMessage id={fields.f23_switch.errorId}>
              {fields.f23_switch.errors}
            </FormMessage>
          </FormField>

          <FormField>
            <FormDescription>
              Switch <small>with helper</small>
            </FormDescription>
            <HStack>
              <Switch
                {...getSwitchProps(fields.f24_switchWithHelper, {
                  ariaAttributes: true,
                })}
                className="aria-invalid:border-destructive"
                onCheckedChange={(value) => {
                  form.update({
                    name: fields.f24_switchWithHelper.name,
                    value,
                  })
                }}
              />
              <Label
                htmlFor={fields.f24_switchWithHelper.id}
                className="cursor-pointer"
              >
                OK
              </Label>
            </HStack>
            <FormMessage id={fields.f24_switchWithHelper.errorId}>
              {fields.f24_switchWithHelper.errors}
            </FormMessage>
          </FormField>
        </Section>

        <Section>
          <SectionHeading id="radiogroup">RadioGroup</SectionHeading>
          <FormField>
            <FormDescription>Radio Group</FormDescription>
            <RadioGroup
              name={fields.f25_radioGroup.name}
              aria-invalid={!fields.f25_radioGroup.valid || undefined}
              aria-describedby={
                !fields.f25_radioGroup.valid
                  ? fields.f25_radioGroup.errorId
                  : undefined
              }
              defaultValue={fields.f25_radioGroup.initialValue}
              className="aria-invalid:border-destructive aria-invalid:border"
              onValueChange={(value) => {
                form.update({
                  name: fields.f25_radioGroup.name,
                  value,
                })
              }}
            >
              <div>通知設定</div>
              <HStack>
                <RadioGroupItem
                  id={`${fields.f25_radioGroup.id}_all`}
                  value="all"
                />
                <Label
                  htmlFor={`${fields.f25_radioGroup.id}_all`}
                  className="cursor-pointer"
                >
                  すべての新着メッセージ
                </Label>
              </HStack>
              <HStack>
                <RadioGroupItem
                  id={`${fields.f25_radioGroup.id}_mention`}
                  value="mention"
                />
                <Label
                  htmlFor={`${fields.f25_radioGroup.id}_mention`}
                  className="cursor-pointer"
                >
                  DMとメンション
                </Label>
              </HStack>
              <HStack>
                <RadioGroupItem
                  id={`${fields.f25_radioGroup.id}_nothing`}
                  value="nothing"
                />
                <Label
                  htmlFor={`${fields.f25_radioGroup.id}_nothing`}
                  className="cursor-pointer"
                >
                  なし
                </Label>
              </HStack>
            </RadioGroup>
            <FormMessage
              id={fields.f25_radioGroup.errorId}
              className="text-destructive"
            >
              {fields.f25_radioGroup.errors}
            </FormMessage>
          </FormField>

          <FormField>
            <FormDescription>
              Radio Group <small>with helper</small>
            </FormDescription>
            <RadioGroup
              {...getRadioGroupProps(fields.f26_radioGroupWithHelper)}
              className="aria-invalid:border-destructive aria-invalid:border"
              onValueChange={(value) => {
                form.update({
                  name: fields.f26_radioGroupWithHelper.name,
                  value,
                })
              }}
            >
              <div>通知設定</div>
              <HStack>
                <RadioGroupItem
                  id={`${fields.f26_radioGroupWithHelper.id}_all`}
                  value="all"
                />
                <Label
                  htmlFor={`${fields.f26_radioGroupWithHelper.id}_all`}
                  className="cursor-pointer"
                >
                  すべての新着メッセージ
                </Label>
              </HStack>
              <HStack>
                <RadioGroupItem
                  id={`${fields.f26_radioGroupWithHelper.id}_mention`}
                  value="mention"
                />
                <Label
                  htmlFor={`${fields.f26_radioGroupWithHelper.id}_mention`}
                  className="cursor-pointer"
                >
                  DMとメンション
                </Label>
              </HStack>
              <HStack>
                <RadioGroupItem
                  id={`${fields.f26_radioGroupWithHelper.id}_nothing`}
                  value="nothing"
                />
                <Label
                  htmlFor={`${fields.f26_radioGroupWithHelper.id}_nothing`}
                  className="cursor-pointer"
                >
                  なし
                </Label>
              </HStack>
            </RadioGroup>
            <FormMessage id={fields.f26_radioGroupWithHelper.errorId}>
              {fields.f26_radioGroupWithHelper.errors}
            </FormMessage>
          </FormField>
        </Section>

        <Section>
          <SectionHeading id="debug">Debug</SectionHeading>
          <FormField>
            <h3>form value</h3>
            <div className="overflow-auto rounded-md border p-4">
              <pre>{JSON.stringify(form.value, null, 2)}</pre>
            </div>
          </FormField>

          <FormField>
            <h3>form all errors</h3>
            <div className="border-destructive overflow-auto rounded-md border p-4">
              <div>{JSON.stringify(form.allErrors, null, 2)}</div>
            </div>
          </FormField>
        </Section>

        <Button>Submit</Button>
      </Stack>
    </Form>
  )
}
