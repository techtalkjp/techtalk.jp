import { Outlet } from 'react-router'
import ScrollAnimation from '~/components/ScrollAnimation'

export default function PublicLayout() {
  return (
    <div>
      <ScrollAnimation />
      <Outlet />
    </div>
  )
}
