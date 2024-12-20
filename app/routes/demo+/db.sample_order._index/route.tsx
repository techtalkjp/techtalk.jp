import { parseWithZod } from '@conform-to/zod'
import {
  type ActionFunctionArgs,
  type HeadersFunction,
  Link,
  type LoaderFunctionArgs,
} from 'react-router'
import { dataWithSuccess, redirectWithSuccess } from 'remix-toast'
import {
  Stack,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui'
import type { Route } from './+types/route'
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

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const tab = url.searchParams.get('tab') ?? 'new'

  const region = context?.cloudflare.cf.region ?? 'N/A'
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

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply(), duration: null }
  }

  if (submission.value.intent === 'new') {
    const timeStart = Date.now()
    const { intent, ...rest } = submission.value
    await createSampleOrder({
      region: context.cloudflare.cf.region ?? '',
      ...rest,
    })
    const timeEnd = Date.now()
    return dataWithSuccess(
      {
        lastResult: submission.reply({ resetForm: true }),
        duration: timeEnd - timeStart,
      },
      {
        message: 'Order created',
        description: JSON.stringify(submission.value),
      },
    )
  }

  if (submission.value.intent === 'del') {
    await deleteSampleOrder(submission.value.id)

    // delete order
    throw await redirectWithSuccess('/demo/db/sample_order?tab=list', {
      message: 'Order deleted',
    })
  }
}

export default function RequestLogsPage({
  loaderData: {
    tab,
    deletingOrder,
    region,
    dummyData,
    sampleOrders,
    duration: selectDuration,
    now,
  },
  actionData,
}: Route.ComponentProps) {
  return (
    <Stack align="stretch">
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
