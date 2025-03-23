import {
  CloudUploadIcon,
  FileImageIcon,
  FileTextIcon,
  XIcon,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { href } from 'react-router'
import { cn } from '~/libs/utils'
import type { action } from '~/routes/resources+/upload-urls/route'
import { FileDrop } from './file-drop'
import { Button, HStack, Progress, Stack } from './ui'

export interface UploadedFile {
  prefix: string
  key: string
  name: string
}

interface FileUploadStatus {
  file: File
  progress: number // 0-100
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
  prefix: string
  key?: string
  type: 'image' | 'video' | 'audio' | 'pdf'
}

const acceptMaps = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  video: ['.mp4', '.webm'],
  audio: ['.mp3', '.ogg', '.wav', '.m4a', '.aac', '.flac'],
  pdf: ['.pdf'],
}

export const MediaFileUploader = ({
  mediaType,
  maxSize = null,
  name,
  id,
  prefix = 'uploads',
  onChange,
}: {
  mediaType:
    | 'image'
    | 'video'
    | 'audio'
    | 'pdf'
    | Array<'image' | 'video' | 'audio' | 'pdf'>
  maxSize?: number | null
  name?: string
  id?: string
  prefix?: string
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
        .filter((f) => f.key) // key があるもののみ
        .map(
          (f) =>
            ({
              prefix,
              key: f.key!,
              name: f.file.name,
            }) satisfies UploadedFile,
        )
      onChange(uploadedFiles)
    }
  }, [prefix, fileStatuses, onChange])

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return

    const newFileStatuses = files.map((file) => {
      const mediaTypeValue = file.type.startsWith('image')
        ? 'image'
        : file.type.startsWith('video')
          ? 'video'
          : file.type.startsWith('audio')
            ? 'audio'
            : file.type === 'application/pdf'
              ? 'pdf'
              : 'image'

      return {
        file,
        progress: 0,
        status: 'pending',
        prefix,
        type: mediaTypeValue,
      } satisfies FileUploadStatus
    })
    setFileStatuses((prev) => [...prev, ...newFileStatuses])

    try {
      // アップロードURLを取得
      const response = await fetch(href('/resources/upload-urls'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          names: files.map((file) => file.name),
          prefix,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to get upload URLS')
      }

      const { id, uploadUrls } =
        await response.json<ReturnType<typeof action>>()

      // アップロードURLを使ってファイルをアップロード
      for (const file of files) {
        const uploadInfo = uploadUrls.find((u) => u.name === file.name)
        if (!uploadInfo) continue
        uploadFile(file, uploadInfo.uploadUrl, uploadInfo.key)
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

  const uploadFile = async (file: File, uploadUrl: string, key: string) => {
    // アップロード中状態に更新
    setFileStatuses((prev) =>
      prev.map((status) =>
        status.file === file ? { ...status, status: 'uploading', key } : status,
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
        <React.Fragment key={status.key}>
          <input
            type="hidden"
            name={`${name}[${index}].prefix`}
            value={status.prefix}
          />
          <input
            type="hidden"
            name={`${name}[${index}].key`}
            value={status.key ?? ''}
          />
          <input
            type="hidden"
            name={`${name}[${index}].name`}
            value={status.file.name}
          />
          <input
            type="hidden"
            name={`${name}[${index}].type`}
            value={status.type}
          />
        </React.Fragment>
      ))
  }

  const accepts = Array.isArray(mediaType)
    ? mediaType.flatMap((t) => acceptMaps[t])
    : acceptMaps[mediaType]

  return (
    <Stack>
      <FileDrop
        key={fileStatuses.length} // ファイルの状態が変わったら再マウント
        id={id}
        accepts={accepts}
        maxSize={maxSize}
        onSelect={handleFilesSelected}
        className={({ isDragging }) => {
          return cn(
            'cursor-pointer rounded-md border p-4',
            isDragging && 'bg-secondary',
          )
        }}
        multiple
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="max-h-96 overflow-auto">
            <Stack>
              <CloudUploadIcon className="stroke-muted-foreground mx-auto size-6" />
              <p className="text-muted-foreground text-sm">
                ファイルをここにドロップ
              </p>
            </Stack>
          </div>
        </div>
      </FileDrop>

      {fileStatuses.length > 0 && (
        <div>
          <HStack>
            <h3 className="flex-1 text-sm font-medium">
              選択されたファイル: {fileStatuses.length}件
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={clearAllFiles}
              disabled={fileStatuses.some(
                (status) => status.status === 'uploading',
              )}
            >
              すべてクリア
            </Button>
          </HStack>

          <Stack>
            {fileStatuses.map((fileStatus, index) => (
              <div
                key={`${fileStatus.file.name}-${index}`}
                className="rounded border p-2"
              >
                <HStack>
                  {fileStatus.type === 'pdf' && <FileTextIcon size="16" />}
                  {fileStatus.type === 'image' && <FileImageIcon size="16" />}

                  <div className="text-sm">{fileStatus.file.name}</div>
                  <div className="flex-1" />
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

            {generateHiddenFields()}
          </Stack>
        </div>
      )}
    </Stack>
  )
}
