import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import dayjs from 'dayjs'
import { Form } from 'react-router'
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
import {
  ImageEndpointUrl,
  createPresignedUrl,
  list,
} from '~/services/r2.server'
import type * as Route from './+types.route'

const schema = z.object({
  file: z.instanceof(File),
})

export const loader = async ({ request }: Route.LoaderArgs) => {
  const objects = await list()
  return { objects, ImageEndpointUrl }
}

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply(), presignedUrl: null }
  }

  const presignedUrl = await createPresignedUrl(submission.value.file.name)
  return {
    lastResult: submission.reply({ resetForm: true }),
    presignedUrl,
  }
}

export const clientAction = async ({
  request,
  serverAction,
}: Route.ClientActionArgs) => {
  const submission = parseWithZod(await request.clone().formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply(), presignedUrl: null }
  }

  const actionData = await serverAction()
  if (!actionData.presignedUrl) {
    return actionData
  }

  await fetch(actionData.presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'multipart/form-data' },
    body: submission.value.file,
  })

  return actionData
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
            {objects?.map((object) => (
              <TableRow key={object.name}>
                <TableCell>
                  <div className="relative">
                    <span className="absolute bottom-2 right-2 text-sm text-white drop-shadow">
                      {object.name}
                    </span>
                    <img
                      className="rounded"
                      loading="lazy"
                      src={`${ImageEndpointUrl}${object.name}`}
                      alt={object.name}
                    />
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
            ))}
          </TableBody>
        </Table>
      </div>
    </Stack>
  )
}
