import type { MetaFunction } from '@remix-run/node'
import { Link, Outlet, useLocation } from '@remix-run/react'
import { ExternalLinkIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  Spacer,
} from '~/components/ui'
import { cn } from '~/libs/utils'

export const meta: MetaFunction = () => {
  return [{ title: 'TechTalk Demos' }]
}

const demoPages: {
  [demoPage: string]: { path: string; title: string; ext?: string }[]
} = {
  conform: [
    { path: '/demo/conform/update', title: '外部から値を変更する - update' },
    {
      path: '/demo/conform/value',
      title: '郵便番号から住所を補完する - value / update',
    },
    {
      path: '/demo/conform/confirm',
      title: '実行確認ダイアログ付きの削除フォーム',
    },
    {
      path: '/demo/conform/image-upload',
      title: '画像アップロード',
    },
  ],
  db: [
    {
      path: '/demo/db/sample_order',
      ext: '._index.tsx',
      title: 'DB - Sample Order',
    },
  ],
  cache: [
    {
      path: '/demo/cache/swr',
      title: 'Cache Control - stale-while-revalidate',
    },
  ],
  about: [{ path: '/demo/about', title: 'これは何?', ext: '.mdx' }],
}

export default function DemoPage() {
  const location = useLocation()
  const menu = location.pathname.split('/')[2]
  const menuItems = menu ? demoPages[menu] ?? [] : []
  const currentMenuItem = menuItems.find((item) =>
    location.pathname.includes(item.path),
  )
  const demoPath = `${location.pathname.replace('/demo/', '').replaceAll('/', '.')}${currentMenuItem?.ext ?? '.tsx'}`
  const codeURL =
    currentMenuItem &&
    `https://github.com/techtalkjp/techtalk.jp/blob/main/app/routes/demo+/${demoPath}`

  return (
    <div className="grid min-h-screen grid-cols-1 grid-rows-[auto_1fr_auto] gap-2 bg-slate-200 md:gap-4">
      <header className="bg-card">
        <h1 className="mx-4 my-2 text-2xl font-bold">TechTalk demos</h1>
        <Menubar className="rounded-none border-b border-l-0 border-r-0 border-t shadow-none">
          {Object.keys(demoPages).map((demoMenu) => (
            <MenubarMenu key={demoMenu}>
              <MenubarTrigger
                className={cn(
                  'capitalize',
                  demoMenu === menu &&
                    'relative after:absolute after:bottom-0 after:left-2 after:right-2 after:block after:h-1 after:rounded-md after:bg-primary',
                )}
              >
                {demoMenu}
              </MenubarTrigger>
              <MenubarContent>
                {demoPages[demoMenu]?.map(({ path, title }) => (
                  <MenubarItem key={path} asChild>
                    <Link to={path}>{title}</Link>
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          ))}
        </Menubar>
      </header>

      <main className="mx-2 md:container md:mx-auto">
        {currentMenuItem ? (
          <Card className="mx-auto max-w-2xl">
            <CardHeader className="flex-row justify-start space-y-0">
              <CardTitle>{currentMenuItem?.title}</CardTitle>
              <Spacer />
              {codeURL && (
                <a
                  className="block text-sm hover:text-primary hover:underline"
                  target="_blank"
                  rel="noreferrer noopener"
                  href={codeURL}
                >
                  <span className="text-xs">Code</span>
                  <ExternalLinkIcon className="mb-1 ml-1 inline h-4 w-4" />
                </a>
              )}
            </CardHeader>
            <CardContent>
              <Outlet />
            </CardContent>
          </Card>
        ) : (
          <div className="mx-auto text-center">
            <Outlet />
          </div>
        )}
      </main>

      <footer className="px-4 py-2 text-center">
        Copyright&copy; TechTalk inc.
      </footer>
    </div>
  )
}
