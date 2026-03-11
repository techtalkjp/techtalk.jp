import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod/v4'
import { env } from 'cloudflare:workers'
import dayjs from 'dayjs'
import { Form, href, useFetcher, useNavigation } from 'react-router'
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
import { db } from '~/services/db.server'
import type { Route } from './+types/conform.image-upload-direct'

const uploadKeySchema = z.string().startsWith('uploads/')

const schema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('process'),
    files: z.array(uploadKeySchema),
  }),
  z.object({
    intent: z.literal('delete'),
    key: uploadKeySchema,
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

  if (submission.value.intent === 'process') {
    const heads = await Promise.all(
      submission.value.files.map((key) =>
        env.R2.head(key).then((obj) => ({ key, obj })),
      ),
    )
    for (const { key, obj } of heads) {
      await db
        .insertInto('uploadedFiles')
        .values({
          key,
          contentType: obj?.httpMetadata?.contentType ?? null,
          size: obj?.size ?? 0,
        })
        .onConflict((oc) =>
          oc.column('key').doUpdateSet({
            contentType: obj?.httpMetadata?.contentType ?? null,
            size: obj?.size ?? 0,
          }),
        )
        .execute()
    }
    return dataWithSuccess(
      { lastResult: submission.reply({ resetForm: true }) },
      {
        message: 'File process successfully!',
        description: submission.value.files.join('\n'),
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
            <MediaFileUploader
              name="file"
              mediaType="image"
              prefix="uploads/"
            />
          </FormField>

          <Button
            type="submit"
            name="intent"
            value="process"
            isLoading={
              navigation.formAction ===
              href('/demo/conform/image-upload-direct')
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
                        <Button
                          variant="link"
                          className="cursor-pointer text-sm"
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
