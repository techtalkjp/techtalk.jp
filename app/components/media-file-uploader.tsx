import {
  CloudUploadIcon,
  FileImageIcon,
  FileTextIcon,
  XIcon,
} from 'lucide-react'
import React, { useEffect, useReducer } from 'react'
import { href } from 'react-router'
import { cn } from '~/libs/utils'
import type { action } from '~/routes/resources+/upload-urls/route'
import { FileDrop } from './file-drop'
import { Button, HStack, Progress, Stack } from './ui'

export interface UploadedFile {
  prefix: string
  key: string
  name: string
  type: MediaType
}

export type MediaType = 'image' | 'video' | 'audio' | 'pdf'

interface FileUploadStatus {
  file: File
  progress: number // 0-100
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
  key?: string
  type: MediaType
}

interface UploadState {
  fileStatuses: FileUploadStatus[]
  isAllUploaded: boolean
}

// アクション定義
type UploadAction =
  | { type: 'ADD_FILES'; payload: { files: FileUploadStatus[] } }
  | {
      type: 'UPDATE_STATUS'
      payload: { file: File; updates: Partial<FileUploadStatus> }
    }
  | { type: 'REMOVE_FILE'; payload: { index: number } }
  | { type: 'CLEAR_ALL' }
  | { type: 'CHECK_ALL_UPLOADED' }

export const ACCEPT_MAPS: Record<MediaType, string[]> = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  video: ['.mp4', '.webm'],
  audio: ['.mp3', '.ogg', '.wav', '.m4a', '.aac', '.flac'],
  pdf: ['.pdf'],
}

/**
 * ファイルからメディアタイプを判断する
 */
const determineMediaType = (file: File): MediaType => {
  if (file.type.startsWith('image')) return 'image'
  if (file.type.startsWith('video')) return 'video'
  if (file.type.startsWith('audio')) return 'audio'
  if (file.type === 'application/pdf') return 'pdf'
  return 'image' // デフォルト
}

/**
 * ファイルをファイルアップロードステータスに変換する
 */
const createFileStatus = (file: File): FileUploadStatus => ({
  file,
  progress: 0,
  status: 'pending',
  type: determineMediaType(file),
})

/**
 * 完了したファイルをUploadedFile形式に変換する
 */
const mapToUploadedFiles = (
  fileStatuses: FileUploadStatus[],
  prefix: string,
): UploadedFile[] => {
  return fileStatuses
    .filter((f) => f.status === 'completed' && f.key)
    .map((f) => ({
      prefix,
      key: f.key!,
      name: f.file.name,
      type: f.type,
    }))
}

/**
 * Reducer関数：アップロードの状態管理
 */
const uploadReducer = (
  state: UploadState,
  action: UploadAction,
): UploadState => {
  switch (action.type) {
    case 'ADD_FILES':
      return {
        ...state,
        fileStatuses: [...state.fileStatuses, ...action.payload.files],
      }
    case 'UPDATE_STATUS':
      return {
        ...state,
        fileStatuses: state.fileStatuses.map((status) =>
          status.file === action.payload.file
            ? { ...status, ...action.payload.updates }
            : status,
        ),
      }
    case 'REMOVE_FILE':
      return {
        ...state,
        fileStatuses: state.fileStatuses.filter(
          (_, i) => i !== action.payload.index,
        ),
      }
    case 'CLEAR_ALL':
      return {
        fileStatuses: [],
        isAllUploaded: false,
      }
    case 'CHECK_ALL_UPLOADED':
      return {
        ...state,
        isAllUploaded:
          state.fileStatuses.length > 0 &&
          state.fileStatuses.every((f) => f.status === 'completed'),
      }
    default:
      return state
  }
}

/**
 * ファイルアップロード機能を提供するカスタムフック
 */
export const useFileUploader = (
  prefix = 'uploads',
  onChange?: (files: UploadedFile[]) => void,
) => {
  // Reducerを使用した状態管理
  const [state, dispatch] = useReducer(uploadReducer, {
    fileStatuses: [],
    isAllUploaded: false,
  })

  const { fileStatuses, isAllUploaded } = state

  // アップロード状態が変わったらコールバックを呼び出す
  useEffect(() => {
    dispatch({ type: 'CHECK_ALL_UPLOADED' })

    const completedFiles = fileStatuses.filter((f) => f.status === 'completed')
    if (onChange && completedFiles.length > 0) {
      const uploadedFiles = mapToUploadedFiles(completedFiles, prefix)
      onChange(uploadedFiles)
    }
  }, [fileStatuses, onChange, prefix])

  // ファイルのアップロード処理
  const uploadFile = async (file: File, uploadUrl: string, key: string) => {
    dispatch({
      type: 'UPDATE_STATUS',
      payload: { file, updates: { status: 'uploading', key } },
    })

    try {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          dispatch({
            type: 'UPDATE_STATUS',
            payload: { file, updates: { progress } },
          })
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

      dispatch({
        type: 'UPDATE_STATUS',
        payload: { file, updates: { status: 'completed', progress: 100 } },
      })
    } catch (error) {
      console.error(`Upload failed for ${file.name}:`, error)
      dispatch({
        type: 'UPDATE_STATUS',
        payload: { file, updates: { status: 'error', error: 'Upload failed' } },
      })
    }
  }

  // ファイル選択処理
  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return

    const newFileStatuses = files.map((file) => createFileStatus(file))
    dispatch({ type: 'ADD_FILES', payload: { files: newFileStatuses } })

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
        throw new Error('Failed to get upload URLs')
      }

      const { uploadUrls } = await response.json<ReturnType<typeof action>>()

      // アップロードURLを使ってファイルをアップロード
      await Promise.all(
        files.map(async (file) => {
          const uploadInfo = uploadUrls.find((u) => u.name === file.name)
          if (!uploadInfo) return
          await uploadFile(file, uploadInfo.uploadUrl, uploadInfo.key)
        }),
      )
    } catch (error) {
      console.error('Upload preparation failed:', error)

      // すべてのファイルをエラー状態に更新
      for (const file of files) {
        dispatch({
          type: 'UPDATE_STATUS',
          payload: {
            file,
            updates: { status: 'error', error: 'Failed to get upload URL' },
          },
        })
      }
    }
  }

  // ファイルの削除
  const removeFile = (index: number) => {
    dispatch({ type: 'REMOVE_FILE', payload: { index } })
  }

  // すべてのファイルをクリア
  const clearAllFiles = () => {
    dispatch({ type: 'CLEAR_ALL' })
  }

  // アップロード中のファイルがあるかチェック
  const hasUploadingFiles = () => {
    return fileStatuses.some((status) => status.status === 'uploading')
  }

  return {
    fileStatuses,
    isAllUploaded,
    handleFilesSelected,
    removeFile,
    clearAllFiles,
    hasUploadingFiles,
  }
}

// コンポーネント ==========================================================

export const MediaFileUploader = ({
  mediaType,
  maxSize = null,
  name,
  id,
  prefix = 'uploads',
  onChange,
}: {
  mediaType: MediaType | MediaType[]
  maxSize?: number | null
  name?: string
  id?: string
  prefix?: string
  onChange?: (files: UploadedFile[]) => void
}) => {
  // カスタムフックを使用
  const {
    fileStatuses,
    isAllUploaded,
    handleFilesSelected,
    removeFile,
    clearAllFiles,
    hasUploadingFiles,
  } = useFileUploader(prefix, onChange)

  // ファイルステータス表示
  const FileStatusItem = ({
    fileStatus,
    index,
  }: {
    fileStatus: FileUploadStatus
    index: number
  }) => (
    <div className="rounded border p-2">
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
          <span className="text-muted-foreground text-xs">準備中</span>
        )}
      </div>
    </div>
  )

  // 隠しフィールド生成
  const HiddenFields = () => {
    if (!isAllUploaded) return null

    return (
      <>
        {fileStatuses
          .filter((status) => status.status === 'completed')
          .map((status, index) => (
            <React.Fragment key={status.key}>
              <input
                type="hidden"
                name={`${name}[${index}].prefix`}
                value={prefix}
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
          ))}
      </>
    )
  }

  const accepts = Array.isArray(mediaType)
    ? mediaType.flatMap((t) => ACCEPT_MAPS[t])
    : ACCEPT_MAPS[mediaType]

  // メインレンダリング
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
              disabled={hasUploadingFiles()}
            >
              すべてクリア
            </Button>
          </HStack>

          <Stack>
            {fileStatuses.map((fileStatus, index) => (
              <FileStatusItem
                key={`${fileStatus.file.name}-${index}`}
                fileStatus={fileStatus}
                index={index}
              />
            ))}

            <HiddenFields />
          </Stack>
        </div>
      )}
    </Stack>
  )
}
