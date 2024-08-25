import { parseWithZod } from '@conform-to/zod'
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from '@remix-run/node'
import { Link, useActionData, useLoaderData } from '@remix-run/react'
import { jsonWithSuccess, redirectWithSuccess } from 'remix-toast'
import {
  Stack,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui'
import { DeleteOrderDialog, NewOrderForm, OrderList } from './components'
import { Header } from './components/header'
import { createSampleOrder, deleteSampleOrder } from './mutations'
import { listSampleOrders } from './queries'
import { schema } from './schema'
import { buildDummyData } from './utils.server'

export const headers: HeadersFunction = () => {
  // キャッシュさせない
  return {
    'Cache-Control': 'public, max-age=0, no-cache',
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const tab = url.searchParams.get('tab') ?? 'new'

  const region = process.env.VERCEL_REGION ?? 'N/A'
  const timeStart = Date.now()
  const sampleOrders = await listSampleOrders()

  const dummyData = buildDummyData()
  const timeEnd = Date.now()

  const del = url.searchParams.get('del')
  const deletingOrder = sampleOrders.find((order) => order.id === del)

  return {
    tab,
    deletingOrder,
    region,
    dummyData,
    sampleOrders,
    duration: timeEnd - timeStart,
    now: new Date().toISOString(),
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { result: submission.reply(), duration: null }
  }

  if (submission.value.intent === 'new') {
    const timeStart = Date.now()
    const { intent, ...rest } = submission.value
    await createSampleOrder({
      region: process.env.VERCEL_REGION ?? '',
      ...rest,
    })
    const timeEnd = Date.now()
    return await jsonWithSuccess(
      {
        result: submission.reply({ resetForm: true }),
        duration: timeEnd - timeStart,
      },
      {
        message: `${submission.value.name}@${submission.value.country} has been successfully submitted.`,
        description: `It took ${timeEnd - timeStart}ms to process the request.`,
      },
    )
  }

  if (submission.value.intent === 'del') {
    await deleteSampleOrder(submission.value.id)

    // delete order
    return await redirectWithSuccess('/demo/db/sample_order?tab=list', {
      message: 'Order has been successfully deleted.',
    })
  }
}

export default function RequestLogsPage() {
  const {
    tab,
    deletingOrder,
    region,
    dummyData,
    sampleOrders,
    duration: selectDuration,
    now,
  } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  return (
    <Stack>
      <Header
        region={region}
        selectDuration={selectDuration}
        insertDuration={actionData?.duration ?? undefined}
      />

      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="new" asChild>
            <Link to="?tab=new">New</Link>
          </TabsTrigger>
          <TabsTrigger value="list" asChild>
            <Link to="?tab=list">List</Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="new">
          <NewOrderForm dummyData={dummyData} now={now} />
        </TabsContent>
        <TabsContent value="list">
          <OrderList sampleOrders={sampleOrders} />
        </TabsContent>
      </Tabs>

      {deletingOrder && <DeleteOrderDialog order={deletingOrder} />}
    </Stack>
  )
}
