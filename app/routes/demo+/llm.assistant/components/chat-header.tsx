import { Bot, MoreVertical } from 'lucide-react'
import { Button, Card, CardHeader } from '~/components/ui'

interface ChatHeaderProps {
  isLoading: boolean
}
export const ChatHeader = ({ isLoading }: ChatHeaderProps) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full">
            <Bot className="text-primary-foreground h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">AIアシスタント</h1>
            <p className="text-muted-foreground text-sm">
              {isLoading ? 'タイピング中...' : 'オンライン'}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </CardHeader>
  </Card>
)
