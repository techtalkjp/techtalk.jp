import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import dayjs from 'dayjs'
import { EllipsisIcon } from 'lucide-react'
import {
  type ActionFunctionArgs,
  Form,
  type LoaderFunctionArgs,
  useNavigation,
  useSubmit,
} from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { toast } from 'sonner'
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
    intent: z.literal('process'),
    files: z.array(z.string()),
  }),
  z.object({
    intent: z.literal('delete'),
    key: z.string(),
  }),
])

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { objects } = await context.cloudflare.env.R2.list({
    include: ['httpMetadata'],
  })

  console.log(objects.map((o) => o.httpMetadata))
  const images = objects.map((obj) => ({
    key: obj.key,
    type: obj.httpMetadata?.contentType,
    url: `${context.cloudflare.env.IMAGE_ENDPOINT_URL}${obj.key}`,
    uploaded: obj.uploaded,
    size: obj.size,
  }))
  return { images }
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
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
    await context.cloudflare.env.R2.delete(submission.value.key)
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
    onSubmit: async (event, { formData }) => {
      toast.info('onSubmit')
      event.preventDefault()

      const files = formData.getAll('file') as File[]
      const response = await fetch('/resources/upload-urls', {
        method: 'POST',
        body: JSON.stringify({ fileNames: files.map((f) => f.name) }),
      })
      const { uploadUrls } = (await response.json()) as {
        id: string
        uploadUrls: { fileName: string; uploadUrl: string; fileKey: string }[]
      }

      const uploadPromises: Promise<string>[] = files.map((file, index) => {
        const { uploadUrl, fileKey } = uploadUrls[index]!
        const xhr = new XMLHttpRequest()
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 100,
            )
            console.log(file.name, percentComplete)
          }
        })

        const promise = new Promise<string>((resolve, reject) => {
          xhr.open('PUT', uploadUrl)
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(fileKey)
            } else {
              reject(new Error(`Upload failed: ${xhr.statusText}`))
            }
          }
          xhr.onerror = () => reject(new Error('Network error'))
          xhr.send(file)
        })

        return promise
      })

      // アップロード完了待ち
      try {
        const keys = await Promise.all(uploadPromises)
        console.log('upload completed', uploadPromises)

        //        setFileKeys(keys)
        //        setUploadComplete(true)

        // 3. Remixのフォーム送信でジョブ登録
        //const formData = new FormData(e.target)
        //        formData.append('fileKeys', JSON.stringify(keys))

        //        submit(formData, { method: 'post' })
      } catch (error) {
        console.error('Upload error:', error)
        // エラー処理
      }
    },
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
            <Label htmlFor="file">Image Files</Label>
            <MediaFileDropInput
              name="file"
              mediaType="image"
              onSelect={(files) => {
                console.log(files)
              }}
            />
          </FormField>

          <Button type="submit" isLoading={navigation.state === 'submitting'}>
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
