import { Outlet } from '@remix-run/react'
import ScrollAnimation from '~/components/ScrollAnimation'

export default function PublicLayout() {
  return (
    <div>
      <ScrollAnimation />
      <Outlet />
    </div>
  )
}
