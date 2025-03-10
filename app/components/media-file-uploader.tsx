import { XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { action } from '~/routes/resources+/upload-urls/route'
import { MediaFileDropInput } from './media-file-drop-input'
import { Button, HStack, Progress, Stack } from './ui'

export interface UploadedFile {
  fileKey: string
  fileName: string
  mediaType: 'image' | 'video' | 'audio'
  metadata?: {
    width?: number
    height?: number
    duration?: number
  }
}

interface FileUploadStatus {
  file: File
  progress: number // 0-100
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
  fileKey?: string
  mediaType: 'image' | 'video' | 'audio'
  metadata?: {
    width?: number
    height?: number
    duration?: number
  }
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
        .map((f) => ({
          fileKey: f.fileKey!,
          fileName: f.file.name,
          mediaType: f.mediaType,
          metadata: f.metadata,
        }))
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
      const response = await fetch('/resources/upload-urls', {
        method: 'POST',
        headers: { ContentType: 'application/json' },
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

  // メタデータ(画像サイズなど)が準備できたときの処理
  const handleMetadataReady = ({
    file,
    mediaType,
    metadata,
  }: {
    file: File
    mediaType: 'image' | 'video' | 'audio'
    metadata: {
      width?: number
      height?: number
      duration?: number
    }
  }) =>
    setFileStatuses((prev) =>
      prev.map((status) =>
        status.file === file ? { ...status, metadata, mediaType } : status,
      ),
    )

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
          name={`${name}[${index}]]}`}
          value={JSON.stringify({
            fileKey: status.fileKey,
            fileName: status.file.name,
            mediaType: status.mediaType,
            metadata: status.metadata ?? {},
          })}
        />
      ))
  }

  return (
    <div className="w-full">
      <MediaFileDropInput
        id={id}
        mediaType={mediaType}
        maxSize={maxSize}
        onSelect={handleFilesSelected}
        onMetadataReady={handleMetadataReady}
      />

      {fileStatuses.length > 0 && (
        <Stack>
          <h3 className="text-sm font-medium">アップロード状況</h3>
          <Stack>
            {fileStatuses.map((fileStatus, index) => (
              <li
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
                      <span>{fileStatus.progress}%</span>
                    </Stack>
                  ) : fileStatus.status === 'completed' ? (
                    <span>完了</span>
                  ) : fileStatus.status === 'error' ? (
                    <span>エラー: {fileStatus.error}</span>
                  ) : (
                    <span>準備中</span>
                  )}
                </div>
              </li>
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
