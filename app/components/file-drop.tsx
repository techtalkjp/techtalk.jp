import { useEffect, useRef, useState } from 'react'

interface UseFileDropProps {
  accepts: string[]
  maxSize?: number | null
  multiple?: boolean
  onError: (error: { code: string; message: string }) => void
  onSelect: (files: File[]) => void
}

export interface FileWithURL {
  file: File
  url: string
}

export const useFileDrop = ({
  accepts,
  maxSize = null,
  multiple = false,
  onError,
  onSelect,
}: UseFileDropProps) => {
  const [fileData, setFileData] = useState<FileWithURL[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const validateFile = (file: File) => {
    if (maxSize && file.size > maxSize) {
      onError({
        code: 'size',
        message: `File size too large. Max size is ${maxSize} bytes`,
      })
      return false
    }
    const valid = accepts.some((acc) => file.name.endsWith(acc))
    if (!valid) {
      onError({ code: 'type', message: `${file.type} is not accepted` })
    }
    return valid
  }

  const handleFileChange = (fileList: FileList) => {
    setIsDragging(false)
    // 既存の URL を解放
    for (const data of fileData) {
      URL.revokeObjectURL(data.url)
    }

    if (!multiple && fileList.length > 1) {
      onError({ code: 'multiple', message: 'Only one file allowed' })
      return
    }

    const validFiles = Array.from(fileList).filter(validateFile)
    const dt = new DataTransfer()
    const newFileData: FileWithURL[] = []

    for (const file of validFiles) {
      dt.items.add(file)
      newFileData.push({ file, url: URL.createObjectURL(file) })
    }

    if (fileInputRef.current) fileInputRef.current.files = dt.files
    setFileData(newFileData)
    onSelect(validFiles)
  }

  const removeFile = (index: number) => {
    if (fileData[index]) {
      URL.revokeObjectURL(fileData[index].url)
    }
    const newFileData = fileData.filter((_, i) => i !== index)
    const dt = new DataTransfer()
    for (const file of newFileData) {
      dt.items.add(file.file)
    }

    if (fileInputRef.current) fileInputRef.current.files = dt.files
    setFileData(newFileData)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return () => {
      for (const data of fileData) {
        URL.revokeObjectURL(data.url)
      }
    }
  }, [])

  return {
    fileData,
    isDragging,
    setIsDragging,
    fileInputRef,
    handleFileChange,
    removeFile,
  }
}

interface FileDropProps
  extends Omit<
    React.ComponentProps<'div'>,
    'children' | 'className' | 'onError' | 'onSelect'
  > {
  children:
    | React.ReactNode
    | ((props: {
        fileData: FileWithURL[]
        isDragging: boolean
        removeFile: (i: number) => void
      }) => React.ReactNode)
  className:
    | string
    | ((props: { fileData: FileWithURL[]; isDragging: boolean }) => string)
  accepts: string[]
  onError?: (error: { code: string; message: string }) => void
  onSelect?: (files: File[]) => void
  maxSize?: number | null
  multiple?: boolean
  disabled?: boolean
  id?: string
  name?: string
}

export const FileDrop = ({
  children,
  className,
  onError = () => {},
  onSelect = () => {},
  maxSize = null,
  multiple = false,
  disabled = false,
  accepts,
  id,
  name,
  ...props
}: FileDropProps) => {
  const {
    fileData,
    isDragging,
    setIsDragging,
    fileInputRef,
    handleFileChange,
    removeFile,
  } = useFileDrop({
    accepts,
    maxSize,
    multiple,
    onError,
    onSelect,
  })

  const computedClassName =
    typeof className === 'function'
      ? className({ fileData, isDragging })
      : className
  const content =
    typeof children === 'function'
      ? children({ fileData, isDragging, removeFile })
      : children
  const acceptAttr = accepts.length > 0 ? accepts.join(',') : undefined

  return (
    <div
      className={computedClassName}
      onClick={() => {
        if (fileData.length === 0) fileInputRef.current?.click()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (fileData.length === 0) fileInputRef.current?.click()
        }
      }}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDrop={(e) => {
        e.preventDefault()
        if (!disabled) handleFileChange(e.dataTransfer.files)
      }}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
      tabIndex={0}
      aria-label="Choose file or drag and drop"
      {...props}
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
      {content}
    </div>
  )
}
