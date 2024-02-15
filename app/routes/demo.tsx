import { Link, Outlet, useLocation } from '@remix-run/react'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '~/components/ui'
import { cn } from '~/libs/utils'

const demoPages: { [demoPage: string]: { path: string; title: string }[] } = {
  conform: [{ path: '/demo/conform/update', title: '外部から値を変更する' }],
  test: [{ path: '/demo/test', title: 'test' }],
}

export default function TestPage() {
  const location = useLocation()
  const menu = location.pathname.split('/')[2]

  return (
    <div className="m-4 grid grid-cols-1 gap-4">
      <Menubar className="shadow-none">
        {Object.keys(demoPages).map((demoMenu) => (
          <MenubarMenu key={demoMenu}>
            <MenubarTrigger
              className={cn(
                'capitalize',
                demoMenu === menu && 'underline decoration-primary decoration-2 underline-offset-4',
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

      <Outlet />
    </div>
  )
}
