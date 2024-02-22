import { Link, Outlet, useLocation } from '@remix-run/react'
import { MetaFunction } from '@vercel/remix'
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
  return [{ title: 'Demos' }, { charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width,initial-scale=1' }]
}

const demoPages: { [demoPage: string]: { path: string; title: string; ext?: 'mdx' }[] } = {
  conform: [
    { path: '/demo/conform/update', title: '外部から値を変更する' },
    { path: '/demo/conform/value', title: '入力値を参照する' },
  ],
  about: [{ path: '/demo/about', title: 'これは何?', ext: 'mdx' }],
}

export default function TestPage() {
  const location = useLocation()
  const menu = location.pathname.split('/')[2]
  const menuItems = demoPages[menu]
  const currentMenuItem = menuItems.find((item) => item.path === location.pathname)
  const codeURL = `https://github.com/techtalkjp/techtalk.jp/blob/main/app/routes/${currentMenuItem?.path.replace(/^\//, '').replaceAll('/', '.')}.${currentMenuItem?.ext ?? 'tsx'}`

  return (
    <div className="grid h-screen grid-cols-1 grid-rows-[auto_1fr_auto] gap-2 bg-slate-200 md:gap-4">
      <header className="bg-card">
        <h1 className="mx-4 text-2xl font-bold md:my-2">TechTalk demos</h1>
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
                {demoPages[demoMenu].map(({ path, title }) => (
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
        <Card>
          <CardHeader className="flex-row justify-start space-y-0">
            <CardTitle>{currentMenuItem?.title}</CardTitle>
            <Spacer />
            <a className="block text-sm" target="_blank" rel="noreferrer noopener" href={codeURL}>
              <span>Source</span>
              <ExternalLinkIcon className="mb-1 ml-1 inline h-4 w-4" />
            </a>
          </CardHeader>
          <CardContent>
            <Outlet />
          </CardContent>
        </Card>
      </main>

      <footer className="px-4 py-2 text-center">Copyright&copy; TechTalk inc.</footer>
    </div>
  )
}
