import { TrashIcon } from 'lucide-react'
import { Form, useNavigation } from 'react-router'
import { Badge, Button } from '~/components/ui'

interface SearchResult {
  id: number
  title: string
  body: string
  createdAt: string
  rank?: number
}

export function SearchResults({
  results,
  query,
}: {
  results: SearchResult[]
  query: string
}) {
  const navigation = useNavigation()

  if (query && results.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        「{query}」に一致する結果が見つかりませんでした
      </p>
    )
  }

  if (results.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        コンテンツがありません。サンプルデータを登録するか、新しいコンテンツを追加してください。
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {results.map((item) => (
        <div
          key={item.id}
          className="bg-card flex items-start gap-3 rounded-lg border p-4"
        >
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="font-medium">{item.title}</h3>
              {item.rank != null && (
                <Badge variant="secondary">
                  score: {Math.abs(item.rank).toFixed(2)}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {item.body}
            </p>
          </div>
          <Form method="POST">
            <input type="hidden" name="intent" value="delete" />
            <input type="hidden" name="id" value={item.id} />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive shrink-0"
              isLoading={
                navigation.formData?.get('intent') === 'delete' &&
                navigation.formData?.get('id') === String(item.id)
              }
            >
              <TrashIcon className="size-4" />
            </Button>
          </Form>
        </div>
      ))}
    </div>
  )
}
