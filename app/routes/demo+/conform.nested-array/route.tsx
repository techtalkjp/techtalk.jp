import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { fakerJA as faker } from '@faker-js/faker'
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
import { jsonWithSuccess } from '~/services/single-fetch-toast'

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

const generatePerson = () => {}

export const loader = ({ request }: LoaderFunctionArgs) => {
  const defaultPersons = [
    {
      name: faker.person.fullName(),
      zip: faker.location.zipCode({ format: '###-####' }),
      tel: faker.helpers.fromRegExp(/[0-9]{3}-[0-9]{4}-[0-9]{4}/),
      email: faker.internet.email(),
    },
  ]
  return { defaultPersons }
}

export const action = async ({ request, response }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply(), result: null }
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
  const { defaultPersons } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const [form, fields] = useForm({
    lastResult: actionData?.lastResult,
    defaultValue: { persons: defaultPersons },
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    shouldValidate: 'onSubmit',
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
                    <Input
                      {...getInputProps(personFields.zip, { type: 'text' })}
                      key={personFields.zip.key}
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
          {...form.insert.getButtonProps({
            name: fields.persons.name,
            defaultValue: {
              name: faker.person.fullName(),
              zip: faker.location.zipCode({ format: '###-####' }),
              tel: faker.helpers.fromRegExp(/[0-9]{3}-[0-9]{4}-[0-9]{4}/),
              email: faker.internet.email(),
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
