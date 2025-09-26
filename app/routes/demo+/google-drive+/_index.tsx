import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FolderIcon,
  HomeIcon,
  ImageIcon,
  LogInIcon,
  LogOutIcon,
} from 'lucide-react'
import { Link, data, redirect, useFetcher, useSearchParams } from 'react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { fetchDriveFilesWithAuth } from '~/routes/demo+/google-drive+/_shared/services/google-drive.server'
import {
  commitSession,
  getSession,
} from '~/routes/demo+/google-drive+/_shared/services/session.server'
import type { Route } from './+types/_index'

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const pageToken = url.searchParams.get('pageToken') ?? ''
  const pageSize = Number(url.searchParams.get('pageSize') ?? 30)
  const folderId = url.searchParams.get('folderId') ?? ''

  // ユーザー情報をセッションから取得
  const session = await getSession(request.headers.get('Cookie'))
  const googleUser = session.get('google_user')
  const googleTokens = session.get('google_tokens')

  // 認証されていない場合
  if (!googleTokens) {
    return data(
      {
        files: [],
        nextPageToken: null,
        currentPageToken: pageToken,
        pageSize,
        isAuthenticated: false,
        googleUser: null,
        folderId,
      },
      {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      },
    )
  }

  // Google Drive APIを直接呼び出し
  const filesData = await fetchDriveFilesWithAuth(
    session,
    folderId !== '' ? folderId : null, // 空文字列をnullに変換
    pageToken,
    pageSize,
  )

  // 認証エラーの場合はリダイレクト
  if (!filesData) {
    return redirect(
      '/demo/google-drive/auth?returnTo=' +
        encodeURIComponent(url.pathname + url.search),
    )
  }

  // セッションが更新された可能性があるため、ヘッダーを設定
  return data(
    {
      ...filesData,
      currentPageToken: pageToken,
      pageSize,
      isAuthenticated: true,
      googleUser,
      folderId,
    },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  )
}

export default function Gallery({ loaderData }: Route.ComponentProps) {
  const {
    files,
    nextPageToken,
    currentPageToken,
    pageSize,
    isAuthenticated,
    googleUser,
    folderId,
  } = loaderData
  const [params] = useSearchParams()
  const prevStack = params.getAll('prev')
  const logoutFetcher = useFetcher()

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <Card className="mx-auto max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold">Google Drive Gallery</h2>
              <p className="mb-6 text-gray-600">
                Google
                Driveの画像を表示するには、Googleアカウントでログインしてください。
              </p>
              <Link to="/demo/google-drive/auth">
                <Button size="lg" className="w-full">
                  <LogInIcon className="mr-2 h-4 w-4" />
                  Googleでログイン
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Google Drive Gallery</h1>
          {googleUser && (
            <p className="mt-1 text-sm text-gray-600">
              {googleUser.email}でログイン中
            </p>
          )}
        </div>
        <logoutFetcher.Form method="post" action="/demo/google-drive/logout">
          <Button variant="outline" type="submit">
            <LogOutIcon className="mr-2 h-4 w-4" />
            ログアウト
          </Button>
        </logoutFetcher.Form>
      </div>

      {folderId && (
        <div className="mb-4">
          <Link
            to="/demo/google-drive"
            prefetch="intent"
            className="inline-flex items-center text-sm text-blue-600 hover:underline"
          >
            <HomeIcon className="mr-1 h-4 w-4" />
            ルートフォルダに戻る
          </Link>
        </div>
      )}

      {files.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">
              画像が見つかりませんでした。
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {files.map((file) => {
              const isFolder =
                file.mimeType === 'application/vnd.google-apps.folder'

              return (
                <Card
                  key={file.id}
                  className="overflow-hidden transition-shadow hover:shadow-lg"
                >
                  {isFolder ? (
                    <Link
                      to={{
                        pathname: '/demo/google-drive',
                        search: buildSearch({
                          folderId: file.id,
                          pageToken: '',
                          pageSize,
                        }),
                      }}
                      prefetch="intent"
                      className="block"
                    >
                      <div className="flex aspect-square items-center justify-center overflow-hidden bg-gray-100">
                        <FolderIcon className="h-24 w-24 text-blue-500" />
                      </div>
                      <CardContent className="p-3">
                        <p
                          className="truncate text-sm font-medium"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">フォルダ</p>
                      </CardContent>
                    </Link>
                  ) : (
                    <a
                      href={file.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        {file.thumbUrl ? (
                          <img
                            src={file.thumbUrl}
                            alt={file.name}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ImageIcon className="h-24 w-24 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <p
                          className="truncate text-sm font-medium"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        {file.size && (
                          <p className="mt-1 text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        )}
                        {file.modifiedTime && (
                          <p className="mt-1 text-xs text-gray-500">
                            {new Date(file.modifiedTime).toLocaleDateString(
                              'ja-JP',
                            )}
                          </p>
                        )}
                      </CardContent>
                    </a>
                  )}
                </Card>
              )
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <PrevLink
              prevStack={prevStack}
              pageSize={pageSize}
              folderId={folderId}
            />
            <div className="text-sm text-gray-600">
              {files.length}件のアイテムを表示中
            </div>
            {nextPageToken ? (
              <Link
                to={{
                  pathname: '/demo/google-drive',
                  search: buildSearch({
                    pageToken: nextPageToken,
                    prev: [...prevStack, currentPageToken].filter(Boolean),
                    pageSize,
                    folderId,
                  }),
                }}
                prefetch="intent"
              >
                <Button variant="outline">
                  次へ
                  <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </>
      )}
    </div>
  )
}

function PrevLink({
  prevStack,
  pageSize,
  folderId,
}: {
  prevStack: string[]
  pageSize: number
  folderId: string
}) {
  if (prevStack.length === 0) return <div />
  const newPrev = prevStack.slice(0, -1)
  const prevToken = prevStack[prevStack.length - 1]

  return (
    <Link
      to={{
        pathname: '/demo/google-drive',
        search: buildSearch({
          pageToken: prevToken,
          prev: newPrev,
          pageSize,
          folderId,
        }),
      }}
      prefetch="intent"
    >
      <Button variant="outline">
        <ChevronLeftIcon className="mr-2 h-4 w-4" />
        前へ
      </Button>
    </Link>
  )
}

function buildSearch({
  pageToken,
  prev,
  pageSize,
  folderId,
}: {
  pageToken?: string
  prev?: string[]
  pageSize?: number
  folderId?: string
}) {
  const sp = new URLSearchParams()
  if (pageToken) {
    sp.set('pageToken', pageToken)
  }
  if (prev) {
    for (const p of prev) {
      sp.append('prev', p)
    }
  }
  if (pageSize) {
    sp.set('pageSize', String(pageSize))
  }
  if (folderId) {
    sp.set('folderId', folderId)
  }
  return `?${sp.toString()}`
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`
}
