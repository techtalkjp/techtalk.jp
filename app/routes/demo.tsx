import { Link, Outlet, useLocation } from '@remix-run/react'
import { MetaFunction } from '@vercel/remix'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '~/components/ui'
import { cn } from '~/libs/utils'

export const meta: MetaFunction = () => {
  return [{ title: 'Demos' }, { charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width,initial-scale=1' }]
}

const demoPages: { [demoPage: string]: { path: string; title: string }[] } = {
  conform: [{ path: '/demo/conform/update', title: '外部から値を変更する' }],
  about: [{ path: '/demo/about', title: 'これは何?' }],
}

export default function TestPage() {
  const location = useLocation()
  const menu = location.pathname.split('/')[2]

  return (
    <div className="grid h-screen grid-cols-1 grid-rows-[auto_1fr_auto] gap-4">
      <header>
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

      <main className="m-4">
        <Outlet />
      </main>

      <footer className="px-4 py-2 text-center">Copyright&copy; TechTalk inc.</footer>
    </div>
  )
}
