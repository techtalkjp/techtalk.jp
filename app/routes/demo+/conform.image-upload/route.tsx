import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
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
import { ImageEndpointUrl, list, upload } from './services/r2.server'
import { resizeImage } from './services/sharp.server'

const schema = z.object({
  file: z.instanceof(File),
})

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const objects = await list()
  return json({ objects, ImageEndpointUrl })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return json({ lastResult: submission.reply() })
  }

  // Resize and convert to webp
  const image = await resizeImage(submission.value.file, { width: 1920 })

  // Upload
  await upload(image)

  return json({ lastResult: submission.reply({ resetForm: true }) })
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
              const imageUrl = `${ImageEndpointUrl}${object.Key}`
              return (
                <TableRow key={object.Key}>
                  <TableCell>
                    <div className="relative">
                      <span className="absolute bottom-2 left-2 right-2 text-right text-sm text-white drop-shadow">
                        {object.Key}
                      </span>
                      <a href={imageUrl} target="_blank" rel="noreferrer">
                        <img
                          className="rounded"
                          loading="lazy"
                          src={imageUrl}
                          alt={object.Key}
                        />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    {dayjs(object.LastModified).format('YYYY-MM-DD HH:mm')}
                  </TableCell>
                  <TableCell>
                    {object.Size?.toLocaleString()}
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
