import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import dayjs from 'dayjs'
import {
  type ActionFunctionArgs,
  Form,
  type LoaderFunctionArgs,
} from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { MediaFileDropInput } from '~/components/media-file-drop-input'
import {
  Button,
  FormField,
  FormMessage,
  Label,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'
import type { Route } from './+types/route'

const schema = z.object({
  file: z.instanceof(File),
  mimeType: z.string(),
})

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { objects } = await context.cloudflare.env.R2.list()
  const images = objects.map((obj) => ({
    key: obj.key,
    type: obj.httpMetadata?.contentType,
    url: `${context.cloudflare.env.IMAGE_ENDPOINT_URL}${obj.key}`,
    uploaded: obj.uploaded,
    size: obj.size,
  }))
  console.log({ images })
  return { images }
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  console.time('upload')
  await context.cloudflare.env.R2.put(
    submission.value.file.name,
    submission.value.file,
    {
      httpMetadata: { contentType: submission.value.mimeType },
    },
  )
  console.timeEnd('upload')

  return dataWithSuccess(
    { lastResult: submission.reply({ resetForm: true }) },
    {
      message: 'File uploaded successfully!',
      description: submission.value.file.name,
    },
  )
}

export default function ImageUploadDemoPage({
  loaderData: { images },
  actionData,
}: Route.ComponentProps) {
  const [form, { file, mimeType }] = useForm({
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  return (
    <Stack gap="lg">
      <Form
        method="POST"
        encType="multipart/form-data"
        {...getFormProps(form)}
        className="w-full"
      >
        <Stack align="stretch">
          <FormField>
            <Label htmlFor={file.id}>Image File</Label>
            <MediaFileDropInput
              key={file.key}
              id={file.id}
              name={file.name}
              type="image"
              onMetadataReady={({ file }) => {
                form.update({
                  name: mimeType.name,
                  value: file.type,
                })
              }}
            />
            <FormMessage id={file.errorId} className="text-destructive">
              {file.errors}
            </FormMessage>
          </FormField>

          <input
            {...getInputProps(mimeType, { type: 'hidden' })}
            key={mimeType.key}
          />

          <Button type="submit">Upload</Button>
        </Stack>
      </Form>

      <div className="w-full overflow-auto rounded border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>LastModified</TableHead>
              <TableHead>Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {images.map((image) => {
              return (
                <TableRow key={image.key}>
                  <TableCell>
                    <div className="relative">
                      <span className="absolute bottom-2 left-2 right-2 text-right text-sm text-white drop-shadow">
                        {image.key}
                      </span>
                      <a href={image.url} target="_blank" rel="noreferrer">
                        <img
                          className="rounded"
                          loading="lazy"
                          src={image.url}
                          alt={image.key}
                        />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>{image.type}</TableCell>
                  <TableCell>
                    {dayjs(image.uploaded).format('YYYY-MM-DD HH:mm')}
                  </TableCell>
                  <TableCell>
                    {image.size.toLocaleString()}
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
