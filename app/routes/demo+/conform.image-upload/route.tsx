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
import {
  Button,
  FormField,
  FormMessage,
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
import type { Route } from './+types/route'

const schema = z.object({
  file: z.custom<File>((file) => file instanceof File),
})

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { objects } = await context.cloudflare.env.R2.list()
  return {
    objects,
    ImageEndpointUrl: context.cloudflare.env.IMAGE_ENDPOINT_URL,
  }
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  await context.cloudflare.env.R2.put(
    submission.value.file.name,
    submission.value.file,
  )

  return dataWithSuccess(
    { lastResult: submission.reply({ resetForm: true }) },
    {
      message: 'File uploaded successfully!',
      description: submission.value.file.name,
    },
  )
}

export default function ImageUploadDemoPage({
  loaderData: { objects, ImageEndpointUrl },
  actionData,
}: Route.ComponentProps) {
  const [form, { file }] = useForm({
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  return (
    <Stack>
      <Form method="POST" encType="multipart/form-data" {...getFormProps(form)}>
        <Stack>
          <FormField>
            <Label htmlFor={file.id}>File</Label>
            <Input {...getInputProps(file, { type: 'file' })} />
            <FormMessage id={file.errorId} className="text-destructive">
              {file.errors}
            </FormMessage>
          </FormField>

          <Button type="submit">Upload</Button>
        </Stack>
      </Form>

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
            {objects.map((object) => {
              const imageUrl = `${ImageEndpointUrl}${object.key}`
              return (
                <TableRow key={object.key}>
                  <TableCell>
                    <div className="relative">
                      <span className="absolute bottom-2 left-2 right-2 text-right text-sm text-white drop-shadow">
                        {object.key}
                      </span>
                      <a href={imageUrl} target="_blank" rel="noreferrer">
                        <img
                          className="rounded"
                          loading="lazy"
                          src={imageUrl}
                          alt={object.key}
                        />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    {dayjs(object.uploaded).format('YYYY-MM-DD HH:mm')}
                  </TableCell>
                  <TableCell>
                    {object.size.toLocaleString()}
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
