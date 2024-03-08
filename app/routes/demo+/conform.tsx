import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { useEffect } from 'react'
import { getToast } from 'remix-toast'
import { toast } from 'sonner'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request)
  return json({ toastData: toast }, { headers: toast ? headers : undefined })
}

export default function DemoConformLayout() {
  const { toastData } = useLoaderData<typeof loader>()

  useEffect(() => {
    if (!toastData) return
    let toastFn = toast.info
    switch (toastData?.type) {
      case 'success':
        toastFn = toast.success
        break
      case 'error':
        toastFn = toast.error
        break
    }
    toastFn(toastData.message, { description: toastData.description })
  }, [toastData])

  return <Outlet />
}
