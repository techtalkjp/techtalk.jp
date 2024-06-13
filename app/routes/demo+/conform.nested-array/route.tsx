import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { TrashIcon } from 'lucide-react'
import { z } from 'zod'
import {
  Button,
  Input,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui'
import { ZipInput } from '~/routes/demo+/resources.zip-input/route'
import { jsonWithSuccess } from '~/services/single-fetch-toast'
import { fakeEmail, fakeName, fakeTel, fakeZip } from './faker.server'

const schema = z.object({
  persons: z.array(
    z.object({
      name: z.string({ required_error: '必須' }),
      zip: z
        .string({ required_error: '必須' })
        .regex(/^\d{3}-\d{4}$/, { message: '000-0000形式' }),
      tel: z
        .string({ required_error: '必須' })
        .regex(/^\d{3}-\d{4}-\d{4}$/, { message: '000-0000-0000形式' }),
      email: z
        .string({ required_error: '必須' })
        .email({ message: 'メールアドレス' }),
    }),
  ),
})

export const loader = ({ request }: LoaderFunctionArgs) => {
  // ブラウザバンドルが巨大になってしまうので、faker はサーバサイドでのみ使用
  const fakePersons = Array.from({ length: 30 }, () => ({
    name: fakeName(),
    zip: fakeZip(),
    tel: fakeTel(),
    email: fakeEmail(),
  }))

  const defaultPersons = [fakePersons[0]]
  return { defaultPersons, fakePersons }
}

export const action = async ({ request, response }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply(), result: null }
  }

  // 0 で始まる郵便番号は存在しないのでエラーにする
  const zipErrors: Record<string, string[]> = {}
  for (const [idx, person] of submission.value.persons.entries()) {
    if (person.zip.startsWith('0')) {
      zipErrors[`persons[${idx}].zip`] = ['郵便番号が存在しません']
    }
  }
  if (Object.keys(zipErrors).length > 0) {
    return {
      lastResult: submission.reply({ fieldErrors: zipErrors }),
      result: null,
    }
  }

  return jsonWithSuccess(
    response,
    {
      lastResult: submission.reply({ resetForm: true }),
      result: submission.value.persons.map((person, idx) => ({
        id: idx + 1, // IDを振る
        ...person,
      })),
    },
    {
      message: 'Success!',
      description: `${submission.value.persons.length} persons submitted`,
    },
  )
}

export default function ConformNestedArrayDemo() {
  const { defaultPersons, fakePersons } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const [form, fields] = useForm({
    lastResult: actionData?.lastResult,
    defaultValue: { persons: defaultPersons },
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    shouldValidate: 'onInput',
    shouldRevalidate: 'onInput',
  })
  const persons = fields.persons.getFieldList()

  return (
    <Form method="POST" {...getFormProps(form)}>
      <Stack>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>郵便番号</TableHead>
              <TableHead>電話番号</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {persons.map((person, index) => {
              const personFields = person.getFieldset()
              return (
                <TableRow key={person.key}>
                  <TableCell>
                    <Input
                      {...getInputProps(personFields.name, { type: 'text' })}
                      key={personFields.name.key}
                    />
                    <div
                      id={personFields.name.errorId}
                      className="text-xs text-destructive"
                    >
                      {personFields.name.errors}
                    </div>
                  </TableCell>
                  <TableCell>
                    <input
                      {...getInputProps(personFields.zip, { type: 'hidden' })}
                      key={personFields.zip.key}
                    />
                    <ZipInput
                      defaultValue={personFields.zip.value}
                      onChange={(value) => {
                        form.update({
                          name: personFields.zip.name,
                          value,
                        })
                      }}
                    />
                    <div
                      id={personFields.zip.errorId}
                      className="text-xs text-destructive"
                    >
                      {personFields.zip.errors}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      {...getInputProps(personFields.tel, { type: 'text' })}
                      key={personFields.tel.key}
                    />
                    <div
                      id={personFields.tel.errorId}
                      className="text-xs text-destructive"
                    >
                      {personFields.tel.errors}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      {...getInputProps(personFields.email, { type: 'text' })}
                      key={personFields.email.key}
                    />
                    <div
                      id={personFields.email.errorId}
                      className="text-xs text-destructive"
                    >
                      {personFields.email.errors}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="xs"
                          {...form.remove.getButtonProps({
                            name: fields.persons.name,
                            index: index,
                          })}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Remove Item</TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        <Button
          size="xs"
          variant="outline"
          disabled={persons.length >= fakePersons.length}
          {...form.insert.getButtonProps({
            name: fields.persons.name,
            defaultValue: {
              ...fakePersons[persons.length],
            },
          })}
        >
          Append
        </Button>

        <Button type="submit">Submit</Button>

        {actionData?.result && (
          <Stack className="text-xs">
            <div>登録されました。</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>名前</TableHead>
                  <TableHead>郵便番号</TableHead>
                  <TableHead>電話番号</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actionData.result.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell>{person.id}</TableCell>
                    <TableCell>{person.name}</TableCell>
                    <TableCell>{person.zip}</TableCell>
                    <TableCell>{person.tel}</TableCell>
                    <TableCell>{person.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Stack>
        )}
      </Stack>
    </Form>
  )
}
