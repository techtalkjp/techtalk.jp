import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod/v4'
import { env } from 'cloudflare:workers'
import dayjs from 'dayjs'
import { EllipsisIcon } from 'lucide-react'
import { Form, href, useNavigation, useSubmit } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { MediaFileDropInput } from '~/components/media-file-drop-input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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

const schema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('upload'),
    file: z.instanceof(File),
  }),
  z.object({
    intent: z.literal('delete'),
    key: z.string(),
  }),
])

export const loader = async () => {
  const { objects } = await env.R2.list({ prefix: 'uploads/' })

  const images = objects.map((obj) => ({
    key: obj.key,
    type: obj.httpMetadata?.contentType,
    url: `${env.IMAGE_ENDPOINT_URL}${obj.key}`,
    uploaded: obj.uploaded,
    size: obj.size,
  }))
  return { images }
}

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  if (submission.value.intent === 'upload') {
    await env.R2.put(
      `uploads/${submission.value.file.name}`,
      submission.value.file,
      {
        httpMetadata: { contentType: submission.value.file.type },
      },
    )
    return dataWithSuccess(
      { lastResult: submission.reply({ resetForm: true }) },
      {
        message: 'File uploaded successfully!',
        description: submission.value.file.name,
      },
    )
  }

  if (submission.value.intent === 'delete') {
    await env.R2.delete(submission.value.key)
    return dataWithSuccess(
      {
        lastResult: submission.reply({ resetForm: true }),
      },
      {
        message: 'File deleted successfully!',
        description: submission.value.key,
      },
    )
  }
}

export default function ImageUploadDemoPage({
  loaderData: { images },
  actionData,
}: Route.ComponentProps) {
  const navigation = useNavigation()
  const [form, { file }] = useForm({
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })
  const submit = useSubmit()

  return (
    <Stack gap="lg">
      <Form
        method="POST"
        encType="multipart/form-data"
        {...getFormProps(form)}
        className="w-full"
      >
        <input type="hidden" name="intent" value="upload" />
        <Stack align="stretch">
          <FormField>
            <Label htmlFor={file.id}>Image File</Label>
            <MediaFileDropInput
              key={file.key}
              id={file.id}
              name={file.name}
              mediaType="image"
            />
            <FormMessage id={file.errorId} className="text-destructive">
              {file.errors}
            </FormMessage>
          </FormField>

          <Button
            type="submit"
            isLoading={
              navigation.formAction === href('/demo/conform/image-upload')
            }
          >
            Upload
          </Button>
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
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {images.map((image) => {
              return (
                <TableRow key={image.key}>
                  <TableCell>
                    <div className="relative">
                      <span className="absolute right-2 bottom-2 left-2 text-right text-sm text-white drop-shadow-sm">
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

                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" type="button">
                          <EllipsisIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the image from the server.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              const formData = new FormData()
                              formData.set('key', image.key)
                              formData.set('intent', 'delete')
                              submit(formData, { method: 'POST' })
                            }}
                          >
                            削除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
