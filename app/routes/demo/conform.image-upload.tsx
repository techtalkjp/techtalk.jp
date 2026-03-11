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
import { db } from '~/services/db.server'
import type { Route } from './+types/conform.image-upload'

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
  const files = await db
    .selectFrom('uploadedFiles')
    .select(['key', 'contentType', 'size', 'createdAt'])
    .where('key', 'like', 'uploads/%')
    .orderBy('createdAt', 'desc')
    .limit(100)
    .execute()

  const images = files.map((f) => ({
    key: f.key,
    type: f.contentType,
    url: `${env.IMAGE_ENDPOINT_URL}${f.key}`,
    uploaded: f.createdAt,
    size: f.size,
  }))
  return { images }
}

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  if (submission.value.intent === 'upload') {
    const { file } = submission.value
    const key = `uploads/${file.name}`
    await env.R2.put(key, file, {
      httpMetadata: { contentType: file.type },
    })
    await db
      .insertInto('uploadedFiles')
      .values({
        key,
        contentType: file.type,
        size: file.size,
      })
      .onConflict((oc) =>
        oc.column('key').doUpdateSet({
          contentType: file.type,
          size: file.size,
        }),
      )
      .execute()
    return dataWithSuccess(
      { lastResult: submission.reply({ resetForm: true }) },
      {
        message: 'File uploaded successfully!',
        description: file.name,
      },
    )
  }

  if (submission.value.intent === 'delete') {
    await Promise.all([
      env.R2.delete(submission.value.key),
      db
        .deleteFrom('uploadedFiles')
        .where('key', '=', submission.value.key)
        .execute(),
    ])
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
