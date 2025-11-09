import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { PaperclipIcon } from 'lucide-react'
import * as React from 'react'
import { href } from 'react-router'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '~/components/ai-elements/conversation'
import {
  Message,
  MessageBranch,
  MessageBranchContent,
  MessageContent,
  MessageResponse,
} from '~/components/ai-elements/message'
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '~/components/ai-elements/prompt-input'
import { Suggestion, Suggestions } from '~/components/ai-elements/suggestion'
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '~/components/ai-elements/tool'
import type { ChatUIMessage } from '../_shared/chat-tools'

export { meta } from './meta'

const suggestions = [
  'PDF からテキストを抽出する方法を教えて',
  'React の useEffect について教えて',
  'TypeScript の型安全性について説明して',
  'Next.js と React Router の違いは？',
]

/**
 * 型安全な AI チャット機能のデモページ
 *
 * Vercel AI SDK v5 + TypeScript の型安全パターンを実装
 * - 中央管理された型定義（~/types/chat-tools.ts）
 * - InferUITools による自動型推論
 * - Extract によるツール固有の型抽出
 * - 型アサーション不要の実装
 */
export default function ChatRoute() {
  const { messages, sendMessage } = useChat<ChatUIMessage>({
    transport: new DefaultChatTransport({
      api: href('/demo/llm/chat/api/chat'),
    }),
  })

  const [text, setText] = React.useState('')
  const [uploading, setUploading] = React.useState(false)

  // Upload file to R2 and get public URL
  const uploadFileToR2 = React.useCallback(async (file: File) => {
    // 1. Get pre-signed URL
    const response = await fetch(href('/demo/llm/chat/api/upload-urls'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        names: [file.name],
        prefix: 'chat-uploads',
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get upload URL')
    }

    const data = (await response.json()) as {
      uploadUrls: Array<{ uploadUrl: string; key: string }>
    }
    const uploadUrl = data.uploadUrls[0]?.uploadUrl
    const key = data.uploadUrls[0]?.key

    if (!uploadUrl || !key) {
      throw new Error('Invalid upload URL response')
    }

    // 2. Upload to R2
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file to R2')
    }

    // 3. Construct public URL
    const publicUrl = `/demo/llm/chat/api/r2/chat-uploads/${key}`

    return publicUrl
  }, [])

  const handleSubmit = async (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    const hasFiles = Boolean(message.files?.length)

    if (!hasText && !hasFiles) {
      return
    }

    const parts: ChatUIMessage['parts'] = []

    // テキストパーツを追加
    if (message.text) {
      parts.push({ type: 'text', text: message.text })
    }

    // ファイルがある場合は、R2にアップロードしてからURLを追加
    if (message.files && message.files.length > 0) {
      setUploading(true)
      try {
        // Convert FileUIPart to File objects
        const fileObjects = await Promise.all(
          message.files.map(async (filePart) => {
            if (filePart.url) {
              const response = await fetch(filePart.url)
              const blob = await response.blob()
              return new File([blob], filePart.filename || 'file', {
                type: filePart.mediaType || 'application/octet-stream',
              })
            }
            return null
          }),
        )

        // Upload to R2 and get public URLs
        const uploadedUrls = await Promise.all(
          fileObjects
            .filter((file): file is File => file !== null)
            .map((file) => uploadFileToR2(file)),
        )

        // Add file parts with R2 URLs
        for (let i = 0; i < message.files.length; i++) {
          const filePart = message.files[i]
          const publicUrl = uploadedUrls[i]

          if (filePart && publicUrl) {
            parts.push({
              type: 'file',
              url: publicUrl,
              filename: filePart.filename,
              mediaType: filePart.mediaType,
            })
          }
        }
      } catch (error) {
        console.error('Failed to upload files:', error)
        alert('ファイルのアップロードに失敗しました')
        return
      } finally {
        setUploading(false)
      }
    }

    sendMessage({
      role: 'user',
      parts,
    })
    setText('')
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: suggestion }],
    })
  }

  return (
    <div className="relative flex size-full flex-col divide-y">
      <Conversation>
        <ConversationContent>
          {messages.map((message) => (
            <MessageBranch defaultBranch={0} key={message.id}>
              <MessageBranchContent>
                <Message from={message.role}>
                  <MessageContent>
                    {/* メッセージパーツを表示 */}
                    {message.parts?.map((part, index: number) => {
                      // テキストパーツ
                      if (part.type === 'text') {
                        return (
                          <MessageResponse key={index}>
                            {part.text}
                          </MessageResponse>
                        )
                      }

                      // ファイルパーツ（画像）
                      if (
                        part.type === 'file' &&
                        part.mediaType?.startsWith('image/')
                      ) {
                        return (
                          <div key={index} className="my-2">
                            <img
                              src={part.url}
                              alt={part.filename || 'Uploaded image'}
                              className="max-w-md rounded-lg border"
                            />
                            {part.filename && (
                              <p className="text-muted-foreground mt-1 text-sm">
                                {part.filename}
                              </p>
                            )}
                          </div>
                        )
                      }

                      // ファイルパーツ（その他）
                      if (part.type === 'file') {
                        return (
                          <div
                            key={index}
                            className="my-2 flex items-center gap-2 rounded-lg border p-3"
                          >
                            <PaperclipIcon className="size-4" />
                            <span className="text-sm">
                              {part.filename || 'File'}
                            </span>
                          </div>
                        )
                      }

                      // ツール関連のパーツ
                      if (
                        part.type.startsWith('tool-') &&
                        'state' in part &&
                        part.state &&
                        ('input' in part ||
                          'output' in part ||
                          'errorText' in part)
                      ) {
                        const toolType = part.type as `tool-${string}`
                        // Map state to ToolUIPart state
                        const toolState =
                          part.state === 'done' || part.state === 'streaming'
                            ? 'output-available'
                            : part.state
                        return (
                          <Tool key={index}>
                            <ToolHeader
                              state={toolState}
                              title={
                                'toolName' in part
                                  ? (part.toolName as string)
                                  : part.type.split('-').slice(1).join('-')
                              }
                              type={toolType}
                            />
                            <ToolContent>
                              {'input' in part && part.input !== undefined && (
                                <ToolInput
                                  input={part.input as Record<string, unknown>}
                                />
                              )}
                              {('output' in part || 'errorText' in part) && (
                                <ToolOutput
                                  errorText={
                                    'errorText' in part
                                      ? (part.errorText as string | undefined)
                                      : undefined
                                  }
                                  output={
                                    'output' in part ? part.output : undefined
                                  }
                                />
                              )}
                            </ToolContent>
                          </Tool>
                        )
                      }

                      return null
                    })}
                  </MessageContent>
                </Message>
              </MessageBranchContent>
            </MessageBranch>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="grid shrink-0 gap-6 overflow-visible px-6 py-4">
        <Suggestions className="overflow-y-visible">
          {suggestions.map((suggestion) => (
            <Suggestion
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              suggestion={suggestion}
            />
          ))}
        </Suggestions>
        <div className="w-full [&_.group\/input-group]:has-[[data-slot=input-group-control]:focus-visible]:ring-2 [&_.group\/input-group]:has-[[data-slot=input-group-control]:focus-visible]:ring-offset-2">
          <PromptInput
            accept="image/*,application/pdf"
            multiple
            onSubmit={handleSubmit}
          >
            <PromptInputBody>
              <PromptInputAttachments>
                {(attachment) => <PromptInputAttachment data={attachment} />}
              </PromptInputAttachments>
              <PromptInputTextarea
                className="rounded-md"
                onChange={(event) => setText(event.target.value)}
                value={text}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments label="画像またはPDFを追加" />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
              </PromptInputTools>
              <PromptInputSubmit
                disabled={!text.trim() || uploading}
                status={uploading ? 'submitted' : 'ready'}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  )
}
