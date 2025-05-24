import { Send } from 'lucide-react'
import { Button, Card, CardContent, Textarea } from '~/components/ui'

interface MessageInputProps {
  input: string
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}
export const MessageInput = ({
  input,
  onInputChange,
  onSubmit,
  isLoading,
}: MessageInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log('Enter pressed, submitting message:', input)
      e.preventDefault()
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  return (
    <Card className="rounded-none border-x-0 border-b-0">
      <CardContent className="p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            console.log('Submitting message:', input)
            onSubmit(e)
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Textarea
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyPress}
              placeholder="メッセージを入力..."
              className="max-h-[120px] min-h-[44px] resize-none pr-12"
              disabled={isLoading}
              rows={1}
              onInput={(e) => {
                e.currentTarget.style.height = 'auto'
                e.currentTarget.style.height = `${Math.min(e.currentTarget.scrollHeight, 120)}px`
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 transform"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
        <p className="text-muted-foreground mt-2 text-center text-xs">
          Enter で送信、Shift + Enter で改行
        </p>
      </CardContent>
    </Card>
  )
}
