import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import dayjs from 'dayjs'
import { Form, useFetcher, useNavigation } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { MediaFileUploader } from '~/components/media-file-uploader'
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
  Label,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'
import { createMinioService } from '~/services/minio.server'
import type { Route } from './+types/route'

const schema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('process'),
    files: z.array(z.string()),
  }),
  z.object({
    intent: z.literal('delete'),
    key: z.string(),
  }),
])

export const loader = async ({ context }: Route.LoaderArgs) => {
  const minio = createMinioService(context.cloudflare.env.TECHTALK_S3_URL)
  const objects = await minio.list('uploads/')
  const images = []

  for (const obj of objects) {
    images.push({
      key: obj.name ?? 'no key',
      type: 'image',
      url: await minio.generatePresignedUrl(obj.name ?? '', 'GET', 3600),
      uploaded: obj.lastModified,
      size: obj.size,
    })
  }
  return { images }
}

export const action = async ({ request, context }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  if (submission.value.intent === 'process') {
    return dataWithSuccess(
      { lastResult: submission.reply({ resetForm: true }) },
      {
        message: 'File process successfully!',
        description: submission.value.files.join('\n'),
      },
    )
  }

  if (submission.value.intent === 'delete') {
    const minio = createMinioService(context.cloudflare.env.TECHTALK_S3_URL)
    await minio.remove(submission.value.key)
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
  const [form] = useForm({
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })
  const deleteFetcher = useFetcher()

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
            <Label htmlFor="file">Image Files</Label>
            <MediaFileUploader name="file" mediaType="image" />
          </FormField>

          <Button
            type="submit"
            name="intent"
            value="upload"
            isLoading={navigation.state === 'submitting'}
          >
            Upload
          </Button>

          <div>{JSON.stringify(form.errors)}</div>
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
                        <Button
                          variant="link"
                          className="text-sm"
                          type="button"
                        >
                          削除
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            本当に削除しますか？
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            このアクションは元に戻せません。サーバーから画像を永久に削除します。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>キャンセル</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              const formData = new FormData()
                              formData.set('key', image.key)
                              formData.set('intent', 'delete')
                              deleteFetcher.submit(formData, { method: 'POST' })
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
