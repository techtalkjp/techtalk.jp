import { parseWithZod } from '@conform-to/zod/v4'
import { DatabaseIcon } from 'lucide-react'
import { Form, useNavigation, useSearchParams } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { Badge, Button, Stack } from '~/components/ui'
import { AddContentForm, SearchForm, SearchResults } from './+db.fts/components'
import { addContent, deleteContent, seedSampleData } from './+db.fts/mutations'
import { listContents, searchContents } from './+db.fts/queries'
import { schema } from './+db.fts/schema'
import { tokenize } from './+db.fts/tokenize'
import type { Route } from './+types/db.fts'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url)
  const query = url.searchParams.get('q') ?? ''

  const timeStart = Date.now()
  const results = query ? await searchContents(query) : await listContents()
  const duration = Date.now() - timeStart
  const tokenized = query ? tokenize(query) : ''

  return { query, results, duration, tokenized }
}

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  if (submission.value.intent === 'add') {
    await addContent(submission.value.title, submission.value.body)
    return dataWithSuccess(
      { lastResult: submission.reply({ resetForm: true }) },
      { message: 'コンテンツを追加しました' },
    )
  }

  if (submission.value.intent === 'delete') {
    await deleteContent(submission.value.id)
    return dataWithSuccess(
      { lastResult: submission.reply() },
      { message: 'コンテンツを削除しました' },
    )
  }

  if (submission.value.intent === 'seed') {
    const count = await seedSampleData()
    return dataWithSuccess(
      { lastResult: submission.reply() },
      { message: `サンプルデータ ${count} 件を登録しました` },
    )
  }
}

const searchExamples = {
  works: [
    { query: 'データベース', desc: '一般的なカタカナ語' },
    { query: 'TypeScript', desc: '英単語' },
    {
      query: 'ベストプラクティス',
      desc: 'バラバラに分割されるが格納側も同じなのでヒット',
    },
    { query: 'プロパティ', desc: '格納テキストと同じ表記ならヒット' },
    { query: '推し活', desc: '1文字ずつに分解されるがAND検索でヒット' },
  ],
  fails: [
    {
      query: 'サーバレス',
      desc: '長音なし「サーバ」≠ 格納側「サーバー」で不一致',
    },
    {
      query: 'プロパティー',
      desc: '長音あり「プロパティー」≠ 格納側「プロパティ」',
    },
    {
      query: 'セキュリティー',
      desc: '長音あり「セキュリティー」≠ 格納側「セキュリティ」',
    },
    {
      query: 'インタフェース',
      desc: '長音なし「インタフェース」≠ 格納側「インターフェース」',
    },
  ],
}

export default function FtsDemoPage({
  loaderData: { query, results, duration, tokenized },
}: Route.ComponentProps) {
  const navigation = useNavigation()
  const [searchParams] = useSearchParams()

  return (
    <Stack align="stretch" className="gap-6">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <DatabaseIcon className="size-5" />
          Cloudflare D1 FTS5 日本語全文検索
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          SQLite FTS5 仮想テーブル + Intl.Segmenter
          によるトークン化で日本語全文検索を実現するデモです。
        </p>
      </div>

      <section className="space-y-2">
        <SearchForm />
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span>{results.length} 件</span>
          <span>({duration}ms)</span>
          {searchParams.has('q') && (
            <Badge variant="outline">「{query}」で検索中</Badge>
          )}
        </div>
        {tokenized && (
          <div className="bg-muted rounded-md p-3 text-xs">
            <span className="text-muted-foreground">トークン化結果: </span>
            <code className="text-foreground">
              {tokenized.split(' ').map((t, i) => (
                <span key={`${t}-${i}`}>
                  {i > 0 && (
                    <span className="text-muted-foreground"> | </span>
                  )}
                  <span className="text-primary font-medium">{t}</span>
                </span>
              ))}
            </code>
          </div>
        )}
      </section>

      <SearchResults results={results} query={query} />

      <hr />

      <section className="space-y-3">
        <h3 className="font-medium">検索してみよう</h3>
        <p className="text-muted-foreground text-xs">
          Intl.Segmenter
          のトークン分割は格納時と検索時で同じ結果になるため、複合語が分割されても検索は成功します。しかし、カタカナの長音（ー）の有無など表記揺れがあると、トークンが一致せず検索に失敗します。
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-green-600">
              ヒットする例
            </h4>
            <div className="space-y-1">
              {searchExamples.works.map((ex) => (
                <a
                  key={ex.query}
                  href={`?q=${encodeURIComponent(ex.query)}`}
                  className="hover:bg-muted flex items-baseline gap-2 rounded px-2 py-1 text-sm"
                >
                  <Badge variant="outline" className="shrink-0 font-mono">
                    {ex.query}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {ex.desc}
                  </span>
                </a>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-red-600">
              ヒットしない例（表記揺れ）
            </h4>
            <div className="space-y-1">
              {searchExamples.fails.map((ex) => (
                <a
                  key={ex.query}
                  href={`?q=${encodeURIComponent(ex.query)}`}
                  className="hover:bg-muted flex items-baseline gap-2 rounded px-2 py-1 text-sm"
                >
                  <Badge
                    variant="outline"
                    className="border-destructive/30 shrink-0 font-mono"
                  >
                    {ex.query}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {ex.desc}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr />

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-3">
          <h3 className="font-medium">コンテンツを追加</h3>
          <AddContentForm />
        </section>

        <section className="space-y-3">
          <h3 className="font-medium">サンプルデータ</h3>
          <p className="text-muted-foreground text-sm">
            テック系ブログ風のサンプルデータを一括登録します（10件）。
          </p>
          <Form method="POST">
            <Button
              type="submit"
              name="intent"
              value="seed"
              variant="secondary"
              isLoading={
                navigation.formData?.get('intent') === 'seed' &&
                navigation.state === 'submitting'
              }
            >
              サンプルデータを登録
            </Button>
          </Form>
        </section>
      </div>
    </Stack>
  )
}
