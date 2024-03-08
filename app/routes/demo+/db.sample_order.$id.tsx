import { HeadersFunction, LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { ArrowLeftIcon } from 'lucide-react'
import {
  Badge,
  Button,
  HStack,
  Input,
  Label,
  Stack,
  Textarea,
} from '~/components/ui'
import { prisma } from '~/services/prisma.server'

const defaultCacheControl = 's-maxage=60, stale-while-revalidate=120'

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return loaderHeaders
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const region = process.env.FLY_REGION ?? 'N/A'
  const machineId = process.env.FLY_MACHINE_ID ?? 'N/A'

  const timeStart = Date.now()
  const order = await prisma.sampleOrder.findUnique({
    where: { id: String(params.id) },
  })
  if (!order) {
    throw json({ order: null, message: 'Order not found' }, { status: 404 })
  }
  const timeEnd = Date.now()

  return json(
    { order, region, machineId, duration: timeEnd - timeStart },
    { headers: { 'Cache-Control': defaultCacheControl } },
  )
}

export default function OrderDetailPage() {
  const { order, region, machineId, duration } = useLoaderData<typeof loader>()

  return (
    <Stack>
      <HStack className="text-sm text-foreground/50">
        <div>
          Region:{' '}
          <Badge variant="secondary" className="text-foreground/50">
            {region}
          </Badge>
        </div>
        <div>
          Machine ID:{' '}
          <Badge variant="secondary" className="text-foreground/50">
            {machineId}
          </Badge>
        </div>
        <div>
          Loader: <Badge>{duration}ms</Badge>
        </div>
      </HStack>

      <HStack>
        <Button variant="ghost" className="rounded-full px-0" size="xs" asChild>
          <Link to="..?tab=list" relative="path">
            <ArrowLeftIcon className="text-slate-500 hover:text-foreground" />
          </Link>
        </Button>
        <h3 className="font-bold">Order Details</h3>
      </HStack>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>ID</Label>
          <Input disabled value={order.id} />
        </div>
        <div>
          <Label>Created At</Label>
          <Input disabled value={order.createdAt} />
        </div>
        <div>
          <Label>Name</Label>
          <Input disabled value={order.name} />
        </div>
        <div>
          <Label>Phone</Label>
          <Input disabled value={order.phone} />
        </div>
        <div>
          <Label>Email</Label>
          <Input disabled value={order.email} />
        </div>
        <div>
          <Label>Zip</Label>
          <Input disabled value={order.zip} />
        </div>
        <div>
          <Label>Country</Label>
          <Input disabled value={order.country} />
        </div>
        <div>
          <Label>Prefecture</Label>
          <Input disabled value={order.prefecture} />
        </div>
        <div>
          <Label>City</Label>
          <Input disabled value={order.city} />
        </div>
        <div>
          <Label>Address</Label>
          <Input disabled value={order.address} />
        </div>
        <div className="col-span-2">
          <Label>Note</Label>
          <Textarea disabled defaultValue={order.note ?? ''} />
        </div>
      </div>
    </Stack>
  )
}
