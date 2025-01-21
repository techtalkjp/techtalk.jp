import {
  CloudUploadIcon,
  FileAudio,
  FileIcon,
  FileImage,
  FileVideo,
  XIcon,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '~/libs/utils'
import { FileDrop } from './file-drop'
import { Button, Stack } from './ui'

const acceptMaps = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  video: ['.mp4', '.webm'],
  audio: ['.mp3', '.ogg', '.wav', '.m4a', '.aac', '.flac'],
}

const MediaIcon = ({
  type,
  className,
}: {
  type: string
  className?: string
}) => {
  const base = cn('inline-block h-4 w-4', className)
  if (type.startsWith('image')) return <FileImage className={base} />
  if (type.startsWith('video')) return <FileVideo className={base} />
  if (type.startsWith('audio')) return <FileAudio className={base} />
  return <FileIcon className={base} />
}

export const MediaFileDropInput = ({
  id,
  name,
  mediaType,
  maxSize = null,
  onMetadataReady,
}: {
  id?: string
  name?: string
  mediaType: 'image' | 'video' | 'audio' | Array<'image' | 'video' | 'audio'>
  maxSize?: number | null
  onMetadataReady?: (args: {
    file: File
    mediaType: 'image' | 'video' | 'audio'
    metadata: { width?: number; height?: number; duration?: number }
  }) => void
}) => {
  const [metadataMap, setMetadataMap] = useState<
    Record<string, { width?: number; height?: number; duration?: number }>
  >({})
  const accepts = Array.isArray(mediaType)
    ? mediaType.flatMap((t) => acceptMaps[t])
    : acceptMaps[mediaType]

  return (
    <FileDrop
      id={id}
      name={name}
      accepts={accepts}
      maxSize={maxSize}
      className={({ fileData, isDragging }) =>
        cn(
          'w-full cursor-pointer rounded-md border-2 p-4 transition-colors hover:bg-accent',
          isDragging && 'bg-accent',
          fileData.length > 0 && 'bg-accent',
        )
      }
      onError={(error) => {
        console.log(error)
      }}
    >
      {({ isDragging, fileData, removeFile }) => (
        <div className="flex flex-col items-center gap-2 text-center">
          <CloudUploadIcon className="size-6 stroke-muted-foreground" />
          {isDragging ? (
            <p>ファイルをここにドロップ</p>
          ) : (
            <>
              {fileData.map((data, index) => (
                <div
                  key={`${data.file.name}_${index}`}
                  className="grid w-full grid-cols-1 place-items-center gap-4 p-4 italic text-muted-foreground"
                >
                  <Stack align="center">
                    <strong>
                      <MediaIcon type={data.file.type} className="mr-2" />
                      {data.file.name}
                    </strong>
                    <div>
                      {data.file.type.startsWith('image') && (
                        <img
                          src={data.url}
                          alt={data.file.name}
                          className="object-contain"
                          onLoad={(e) => {
                            if (!metadataMap[data.file.name]?.width) {
                              const width = e.currentTarget.naturalWidth
                              const height = e.currentTarget.naturalHeight
                              setMetadataMap((prev) => ({
                                ...prev,
                                [data.file.name]: { width, height },
                              }))
                              onMetadataReady?.({
                                file: data.file,
                                mediaType: 'image',
                                metadata: {
                                  width,
                                  height,
                                },
                              })
                            }
                          }}
                        />
                      )}
                      {metadataMap[data.file.name]?.width &&
                        metadataMap[data.file.name]?.height && (
                          <p className="text-sm">
                            {metadataMap[data.file.name]?.width} x{' '}
                            {metadataMap[data.file.name]?.height}
                          </p>
                        )}
                      {data.file.type.startsWith('audio') && (
                        <audio
                          controls
                          onLoadedMetadata={(e) => {
                            const duration = e.currentTarget.duration
                            setMetadataMap((prev) => ({
                              ...prev,
                              [data.file.name]: { duration },
                            }))
                            onMetadataReady?.({
                              file: data.file,
                              mediaType: 'audio',
                              metadata: { duration },
                            })
                          }}
                        >
                          <source src={data.url} type={data.file.type} />
                        </audio>
                      )}
                      {data.file.type.startsWith('video') && (
                        <video
                          controls
                          onLoadedMetadata={(e) => {
                            const duration = e.currentTarget.duration
                            const width = e.currentTarget.videoWidth
                            const height = e.currentTarget.videoHeight
                            setMetadataMap((prev) => ({
                              ...prev,
                              [data.file.name]: { duration, width, height },
                            }))
                            onMetadataReady?.({
                              file: data.file,
                              mediaType: 'video',
                              metadata: {
                                duration,
                                width,
                                height,
                              },
                            })
                          }}
                        >
                          <source src={data.url} type={data.file.type} />
                        </video>
                      )}
                    </div>
                  </Stack>
                </div>
              ))}
              {fileData.length > 0 && (
                <Button
                  type="button"
                  variant="link"
                  className="text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(0)
                  }}
                >
                  <XIcon />
                  クリア
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </FileDrop>
  )
}
