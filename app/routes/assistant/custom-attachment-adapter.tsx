import {
  CompositeAttachmentAdapter,
  SimpleTextAttachmentAdapter,
  type Attachment,
  type AttachmentAdapter,
  type AttachmentStatus,
} from '@assistant-ui/react'

class CustomAttachmentAdapter implements AttachmentAdapter {
  accept = 'image/*, .pdf'

  // biome-ignore lint/suspicious/useAwait: <explanation>
  async add({ file }: { file: File }) {
    // Custom logic for adding an attachment
    // ...
    return {
      id: file.name,
      name: file.name,
      size: file.size,
      type: file.type as 'file',
      contentType: file.type,
      file,
      status: {
        type: 'running',
        reason: 'uploading',
        progress: 0,
      } satisfies AttachmentStatus,
    }
  }

  // biome-ignore lint/suspicious/useAwait: <explanation>
  async send(attachment: Attachment) {
    // Custom logic for sending an attachment
    // ...
    return {
      ...attachment,
      status: {
        type: 'complete',
      } satisfies AttachmentStatus,
      content: [],
    }
  }

  async remove() {
    // Custom logic for removing an attachment
    // ...
  }
}

// Use it in your CompositeAttachmentAdapter
const compositeAdapter = new CompositeAttachmentAdapter([
  new CustomAttachmentAdapter(),
  new SimpleTextAttachmentAdapter(),
])
