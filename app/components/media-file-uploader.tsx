import { CloudUploadIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { href } from 'react-router'
import type { action } from '~/routes/resources+/upload-urls/route'
import { FileDrop } from './file-drop'
import { Button, HStack, Progress, Stack } from './ui'

export interface UploadedFile {
  fileKey: string
  fileName: string
}

interface FileUploadStatus {
  file: File
  progress: number // 0-100
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
  fileKey?: string
  mediaType: 'image' | 'video' | 'audio'
}

const acceptMaps = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  video: ['.mp4', '.webm'],
  audio: ['.mp3', '.ogg', '.wav', '.m4a', '.aac', '.flac'],
}

export const MediaFileUploader = ({
  mediaType,
  maxSize = null,
  name,
  id,
  onChange,
}: {
  mediaType: 'image' | 'video' | 'audio' | Array<'image' | 'video' | 'audio'>
  maxSize?: number | null
  name?: string
  id?: string
  onChange?: (files: UploadedFile[]) => void
}) => {
  const [fileStatuses, setFileStatuses] = useState<FileUploadStatus[]>([])
  const [isAllUploaded, setIsAllUploaded] = useState(false)

  // アップロード状態が変わったらコールバックを呼び出す
  useEffect(() => {
    const completedFiles = fileStatuses.filter((f) => f.status === 'completed')
    setIsAllUploaded(
      fileStatuses.length > 0 &&
        fileStatuses.every((f) => f.status === 'completed'),
    )

    if (onChange && completedFiles.length > 0) {
      const uploadedFiles: UploadedFile[] = completedFiles
        .filter((f) => f.fileKey) // key があるもののみ
        .map(
          (f) =>
            ({
              fileKey: f.fileKey!,
              fileName: f.file.name,
            }) satisfies UploadedFile,
        )
      onChange(uploadedFiles)
    }
  }, [fileStatuses, onChange])

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return

    const newFileStatuses = files.map((file) => {
      const mediaTypeValue = file.type.startsWith('image')
        ? 'image'
        : file.type.startsWith('video')
          ? 'video'
          : file.type.startsWith('audio')
            ? 'audio'
            : 'image'

      return {
        file,
        progress: 0,
        status: 'pending',
        mediaType: mediaTypeValue,
      } satisfies FileUploadStatus
    })
    setFileStatuses((prev) => [...prev, ...newFileStatuses])

    try {
      // アップロードURLを取得
      const response = await fetch(href('/resources/upload-urls'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileNames: files.map((file) => file.name),
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to get upload URLS')
      }

      const { id, uploadUrls } =
        await response.json<ReturnType<typeof action>>()

      // アップロードURLを使ってファイルをアップロード
      for (const file of files) {
        const uploadInfo = uploadUrls.find((u) => u.fileName === file.name)
        if (!uploadInfo) continue
        uploadFile(file, uploadInfo.uploadUrl, uploadInfo.fileKey)
      }
    } catch (error) {
      console.error('Upload preparation failed:', error)
      // エラー状態にする
      setFileStatuses((prev) =>
        prev.map((status) =>
          files.includes(status.file)
            ? { ...status, status: 'error', error: 'Failed to get upload URL' }
            : status,
        ),
      )
    }
  }

  const uploadFile = async (file: File, uploadUrl: string, fileKey: string) => {
    // アップロード中状態に更新
    setFileStatuses((prev) =>
      prev.map((status) =>
        status.file === file
          ? { ...status, status: 'uploading', fileKey }
          : status,
      ),
    )

    try {
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener('progress', (event) => {
        // アップロードの進捗を更新
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setFileStatuses((prev) =>
            prev.map((status) =>
              status.file === file ? { ...status, progress } : status,
            ),
          )
        }
      })

      await new Promise<void>((resolve, reject) => {
        xhr.open('PUT', uploadUrl)
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error(`HTTP Error: ${xhr.status}`))
          }
        }
        xhr.onerror = () => reject(new Error('Network Error'))
        xhr.send(file)
      })

      // アップロード成功
      setFileStatuses((prev) =>
        prev.map((status) =>
          status.file === file
            ? { ...status, status: 'completed', progress: 100 }
            : status,
        ),
      )
    } catch (error) {
      console.error(`Upload failed for ${file.name}:`, error)

      // アップロード失敗
      setFileStatuses((prev) =>
        prev.map((status) =>
          status.file === file
            ? { ...status, status: 'error', error: 'Upload failed' }
            : status,
        ),
      )
    }
  }

  // ファイルの削除
  const removeFile = (index: number) => {
    setFileStatuses((prev) => prev.filter((_, i) => i !== index))
  }

  // すべてのファイルをクリア
  const clearAllFiles = () => {
    setFileStatuses([])
    setIsAllUploaded(false)
  }

  // hidden input フィールドを生成(フォーム送信用)
  const generateHiddenFields = () => {
    if (!isAllUploaded) return null

    return fileStatuses
      .filter((status) => status.status === 'completed')
      .map((status, index) => (
        <input
          key={`${name}-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            index
          }`}
          type="hidden"
          name={`${name}[${index}]}`}
          value={JSON.stringify({
            fileKey: status.fileKey ?? '',
            fileName: status.file.name,
          })}
        />
      ))
  }

  const accepts = Array.isArray(mediaType)
    ? mediaType.flatMap((t) => acceptMaps[t])
    : acceptMaps[mediaType]

  return (
    <div className="w-full cursor-pointer rounded-md border p-4">
      <FileDrop
        id={id}
        accepts={accepts}
        maxSize={maxSize}
        onSelect={handleFilesSelected}
        multiple
      >
        {({ fileData, removeFile }) => {
          return (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="max-h-96 overflow-auto">
                {fileData.length === 0 && (
                  <Stack>
                    <CloudUploadIcon className="stroke-muted-foreground mx-auto size-6" />
                    <p className="text-muted-foreground text-sm">
                      ファイルをここにドロップ
                    </p>
                  </Stack>
                )}
              </div>
            </div>
          )
        }}
      </FileDrop>

      {fileStatuses.length > 0 && (
        <Stack>
          <h3 className="text-sm font-medium">アップロード状況</h3>
          <Stack>
            {fileStatuses.map((fileStatus, index) => (
              <div
                key={`${fileStatus.file.name}`}
                className="rounded border p-2"
              >
                <HStack>
                  <span>{fileStatus.file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    disabled={fileStatus.status === 'uploading'}
                  >
                    <XIcon />
                  </Button>
                </HStack>

                <div>
                  {fileStatus.status === 'uploading' ? (
                    <Stack>
                      <Progress value={fileStatus.progress} />
                      <span className="text-muted-foreground text-xs">
                        {fileStatus.progress}%
                      </span>
                    </Stack>
                  ) : fileStatus.status === 'completed' ? (
                    <span className="text-xs text-green-600">完了</span>
                  ) : fileStatus.status === 'error' ? (
                    <span className="text-xs text-red-600">
                      エラー: {fileStatus.error}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      準備中
                    </span>
                  )}
                </div>
              </div>
            ))}

            {fileStatuses.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAllFiles}
                disabled={fileStatuses.some(
                  (status) => status.status === 'uploading',
                )}
              >
                すべてクリア
              </Button>
            )}

            {generateHiddenFields()}
          </Stack>
        </Stack>
      )}
    </div>
  )
}
