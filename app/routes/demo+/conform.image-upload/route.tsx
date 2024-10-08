import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import type { ActionFunctionArgs } from '@vercel/remix'
import dayjs from 'dayjs'
import { z } from 'zod'
import {
  Button,
  Input,
  Label,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'
import { ImageEndpointUrl, list, upload } from '~/services/r2.server'

const schema = z.object({
  file: z.custom<File>((file) => file instanceof File),
})

export const loader = async () => {
  const objects = await list()
  return { objects, ImageEndpointUrl }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  await upload(submission.value.file)

  return { lastResult: submission.reply({ resetForm: true }) }
}

export default function ImageUploadDemoPage() {
  const { objects, ImageEndpointUrl } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const [form, { file }] = useForm({
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  return (
    <Stack>
      <Stack asChild>
        <Form
          method="POST"
          encType="multipart/form-data"
          {...getFormProps(form)}
        >
          <div>
            <Label htmlFor={file.id}>File</Label>
            <Input {...getInputProps(file, { type: 'file' })} />
            <div id={file.errorId} className="text-destructive">
              {file.errors}
            </div>
          </div>

          <Button type="submit">Upload</Button>
        </Form>
      </Stack>

      <div className="overflow-auto rounded border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>LastModified</TableHead>
              <TableHead>Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {objects?.map((object) => {
              const imageUrl = `${ImageEndpointUrl}${object.name}`
              return (
                <TableRow key={object.name}>
                  <TableCell>
                    <div className="relative">
                      <span className="absolute bottom-2 left-2 right-2 text-right text-sm text-white drop-shadow">
                        {object.name}
                      </span>
                      <a href={imageUrl} target="_blank" rel="noreferrer">
                        <img
                          className="rounded"
                          loading="lazy"
                          src={imageUrl}
                          alt={object.name}
                        />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    {dayjs(object.lastModified).format('YYYY-MM-DD HH:mm')}
                  </TableCell>
                  <TableCell>
                    {object.size?.toLocaleString()}
                    <small> bytes</small>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </Stack>
  )
}
