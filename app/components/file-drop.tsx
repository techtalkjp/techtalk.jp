import mime from 'mime'
import { useRef, useState } from 'react'

interface FileDropProps
  extends Omit<
    React.ComponentProps<'div'>,
    'children' | 'className' | 'onError' | 'onSelect' | 'maxSize' | 'multiple'
  > {
  children:
    | React.ReactNode
    | ((props: {
        files: File[]
        isDragging: boolean
        removeFile: (index: number) => void
      }) => React.ReactNode)
  className:
    | string
    | ((props: { files: File[]; isDragging: boolean }) => string)
  onError?: (error: { code: string; message: string }) => void
  onSelect?: (files: File[]) => void
  maxSize?: number | null
  multiple?: boolean
  disabled?: boolean
  accepts: string[]
  name?: string
}

export const FileDrop = ({
  children,
  className,
  onSelect = (files) => {},
  onError = (error) => {},
  maxSize = null,
  multiple = false,
  disabled = false,
  accepts,
  id,
  name,
}: FileDropProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const classNameAttr =
    typeof className === 'function'
      ? className({ files, isDragging })
      : className
  const childrenNode =
    typeof children === 'function'
      ? children({ files, isDragging, removeFile })
      : children
  const acceptAttr =
    accepts.length > 0
      ? accepts.map((accept) => mime.getType(accept) || accept).join(',')
      : undefined

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function validateFile(file: File) {
    if (maxSize) {
      if (file.size > maxSize) {
        onError({
          code: 'size',
          message: `File size too large. Max size is ${maxSize} bytes`,
        })
        return false
      }
    }
    const valid = accepts.some((accept) => {
      return file.type === mime.getType(accept) || file.name.endsWith(accept)
    })
    if (!valid) {
      onError({
        code: 'type',
        message: `${file.type} is not in ${accepts.join(', ')}`,
      })
    }
    return valid
  }

  function handleFileChange(selectedFiles: FileList) {
    setIsDragging(false)

    if (!multiple && selectedFiles.length > 1)
      return onError({ code: 'multiple', message: 'Only one file allowed' })

    const newFiles = Array.from(selectedFiles).filter(validateFile)

    // For drag and drop, sync files to input tag
    const fileList = new DataTransfer()
    for (const file of newFiles) {
      fileList.items.add(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.files = fileList.files
    }

    setFiles(newFiles)
    onSelect(newFiles)
  }

  function removeFile(index: number) {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    if (fileInputRef.current) {
      const fileList = new DataTransfer()
      for (const file of newFiles) {
        fileList.items.add(file)
      }
      fileInputRef.current.files = fileList.files
    }
  }

  return (
    <div
      className={classNameAttr}
      onClick={() => {
        if (files.length === 0) fileInputRef.current?.click()
      }}
      onKeyUp={() => fileInputRef.current?.click()}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={(e) => {
        e.preventDefault() // Necessary. Allows us to drop.
        setIsDragging(true)
      }}
      onDrop={(e) => {
        e.preventDefault() // Necessary. Allows us to drop.
        if (!disabled) {
          handleFileChange(e.dataTransfer.files)
        }
      }}
      aria-hidden="true"
    >
      <input
        id={id}
        ref={fileInputRef}
        type="file"
        name={name}
        hidden
        onChange={(e) =>
          handleFileChange(e.target.files || new DataTransfer().files)
        }
        accept={acceptAttr}
        multiple={multiple}
        disabled={disabled}
      />
      {childrenNode}
    </div>
  )
}
