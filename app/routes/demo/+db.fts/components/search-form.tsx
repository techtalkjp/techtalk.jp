import { SearchIcon } from 'lucide-react'
import { Form, useSearchParams } from 'react-router'
import { Button, Input } from '~/components/ui'

export function SearchForm() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  return (
    <Form method="GET" className="flex gap-2">
      <Input
        name="q"
        type="search"
        placeholder="検索キーワードを入力..."
        defaultValue={query}
        className="flex-1"
      />
      <Button type="submit" variant="outline">
        <SearchIcon className="mr-1 size-4" />
        検索
      </Button>
    </Form>
  )
}
