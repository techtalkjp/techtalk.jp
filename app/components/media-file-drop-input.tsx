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
  audio: ['.mp3', '.ogg', '.wav', '.m4a'],
}

const MediaIcon = ({
  type,
  className,
}: React.ComponentProps<'svg'> & { type: string }) => {
  const c = cn('inline-block h-4 w-4', className)
  if (type.startsWith('image')) {
    return <FileImage className={c} />
  }
  if (type.startsWith('video')) {
    return <FileVideo className={c} />
  }
  if (type.startsWith('audio')) {
    return <FileAudio className={c} />
  }
  return <FileIcon className={c} />
}

export const MediaFileDropInput = ({
  id,
  name,
  type,
  onMetadataReady,
}: {
  id?: string
  name?: string
  type: 'image' | 'video' | 'audio' | Array<'image' | 'video' | 'audio'>
  onMetadataReady?: (args: {
    file: File
    type: 'image' | 'video' | 'audio'
    metadata: { width?: number; height?: number; duration?: number }
  }) => void
}) => {
  const [metadataMap, setMetadataMap] = useState<{
    [key: string]: { width?: number; height?: number; duration?: number }
  }>({})

  const accepts = Array.isArray(type)
    ? type.reduce((acc, t) => acc.concat(acceptMaps[t]), [] as string[])
    : acceptMaps[type]

  return (
    <FileDrop
      id={id}
      name={name}
      accepts={accepts}
      className={({ files, isDragging }) =>
        cn(
          'w-full cursor-pointer rounded-md border-2 p-4 transition-colors hover:bg-accent',
          isDragging && 'bg-accent',
          files && files.length > 0 && 'bg-accent',
        )
      }
    >
      {({ isDragging, files, removeFile }) => (
        <div className="flex flex-col items-center gap-2 text-center">
          <CloudUploadIcon className="size-6 stroke-muted-foreground" />

          {isDragging ? (
            <p>ファイルをここにドロップ</p>
          ) : (
            <>
              {files.map((f, index) => (
                <div
                  key={`${f.name}_${index}`}
                  className="grid w-full grid-cols-1 place-items-center gap-4 p-4 italic text-muted-foreground"
                >
                  <Stack align="center">
                    <strong>
                      <MediaIcon type={f.type} className="mr-2" />
                      {f.name}
                    </strong>
                    <div>
                      {f.type.startsWith('image') && (
                        <img
                          src={URL.createObjectURL(f)}
                          alt={f.name}
                          className="object-contain"
                          onLoad={(e) => {
                            if (!metadataMap[f.name]?.width) {
                              setMetadataMap((prev) => ({
                                ...prev,
                                [f.name]: {
                                  width: e.currentTarget?.naturalWidth,
                                  height: e.currentTarget?.naturalHeight,
                                },
                              }))
                              onMetadataReady?.({
                                file: f,
                                type: 'image',
                                metadata: {
                                  width: e.currentTarget.naturalWidth,
                                  height: e.currentTarget.naturalHeight,
                                },
                              })
                            }
                          }}
                        />
                      )}
                      {metadataMap[f.name]?.width &&
                        metadataMap[f.name]?.height && (
                          <p className="text-sm">
                            {metadataMap[f.name]?.width} x{' '}
                            {metadataMap[f.name]?.height}
                          </p>
                        )}
                      {f.type.startsWith('audio') && (
                        <audio
                          controls
                          onLoadedMetadata={(e) => {
                            setMetadataMap((prev) => ({
                              ...prev,
                              [f.name]: { duration: e.currentTarget?.duration },
                            }))
                            onMetadataReady?.({
                              file: f,
                              type: 'audio',
                              metadata: {
                                duration: e.currentTarget.duration,
                              },
                            })
                          }}
                        >
                          <source src={URL.createObjectURL(f)} type={f.type} />
                          <track
                            kind="captions"
                            srcLang="en"
                            label="English captions"
                          />
                        </audio>
                      )}
                      {f.type.startsWith('video') && (
                        <video
                          controls
                          onLoadedMetadata={(e) => {
                            setMetadataMap((prev) => ({
                              ...prev,
                              [f.name]: {
                                duration: e.currentTarget?.duration,
                                width: e.currentTarget?.videoWidth,
                                height: e.currentTarget?.videoHeight,
                              },
                            }))
                            onMetadataReady?.({
                              file: f,
                              type: 'video',
                              metadata: {
                                duration: e.currentTarget.duration,
                                width: e.currentTarget.videoWidth,
                                height: e.currentTarget.videoHeight,
                              },
                            })
                          }}
                        >
                          <source src={URL.createObjectURL(f)} type={f.type} />
                          <track
                            kind="captions"
                            srcLang="en"
                            label="English captions"
                          />
                        </video>
                      )}
                    </div>
                  </Stack>
                </div>
              ))}

              {files.length >= 1 && (
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
