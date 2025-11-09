import { useCallback, useState } from 'react'

type UploadedFile = {
  id: string
  url: string
  filename: string
  mediaType: string
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const uploadToR2 = useCallback(async (file: File): Promise<UploadedFile> => {
    // 1. Get pre-signed URL
    const response = await fetch('/resources/upload-urls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files: [
          {
            name: file.name,
            type: file.type,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get upload URL')
    }

    const data = (await response.json()) as {
      uploadUrls: Array<{ uploadUrl: string; publicUrl: string }>
    }
    const uploadUrl = data.uploadUrls[0]?.uploadUrl
    const publicUrl = data.uploadUrls[0]?.publicUrl

    if (!uploadUrl || !publicUrl) {
      throw new Error('Invalid upload URL response')
    }

    // 2. Upload to R2
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file to R2')
    }

    return {
      id: crypto.randomUUID(),
      url: publicUrl,
      filename: file.name,
      mediaType: file.type,
    }
  }, [])

  const uploadFiles = useCallback(
    async (files: File[]): Promise<UploadedFile[]> => {
      setUploading(true)
      try {
        const uploaded = await Promise.all(
          files.map((file) => uploadToR2(file)),
        )
        setUploadedFiles((prev) => [...prev, ...uploaded])
        return uploaded
      } finally {
        setUploading(false)
      }
    },
    [uploadToR2],
  )

  const removeFile = useCallback((id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const clearFiles = useCallback(() => {
    setUploadedFiles([])
  }, [])

  return {
    uploading,
    uploadedFiles,
    uploadFiles,
    removeFile,
    clearFiles,
  }
}
