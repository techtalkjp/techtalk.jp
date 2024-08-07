import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { fakerJA as faker } from '@faker-js/faker'
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from '@remix-run/react'
import { jsonWithSuccess } from 'remix-toast'
import { z } from 'zod'
import {
  Badge,
  Button,
  HStack,
  Input,
  Label,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '~/components/ui'
import { createSampleOrder } from './mutations'
import { listSampleOrders } from './queries'

const schema = z.object({
  name: z.string().max(255),
  email: z.string().email().max(255),
  zip: z.string().max(20),
  country: z.string().max(50),
  prefecture: z.string().max(50),
  city: z.string().max(50),
  address: z.string().max(255),
  phone: z.string().max(15),
  note: z.string().max(1000),
})

const buildDummyData = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  zip: faker.location.zipCode(),
  country: faker.location.country(),
  prefecture: faker.location.state(),
  city: faker.location.city(),
  address: faker.location.streetAddress(),
  phone: faker.phone.number(),
  note: faker.lorem.paragraph(),
})

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

  return {
    tab,
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

  const timeStart = Date.now()
  await createSampleOrder({
    region: process.env.VERCEL_REGION ?? '',
    ...submission.value,
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

export default function RequestLogsPage() {
  const {
    tab,
    region,
    dummyData,
    sampleOrders,
    duration: selectDuration,
    now,
  } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()

  const [form, fields] = useForm({
    id: now, // submit 後に revalidated された dummyData を反映するためにIDを毎回変える
    lastResult: actionData?.result,
    defaultValue: dummyData,
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  })

  return (
    <Stack>
      <HStack className="text-sm text-foreground/50">
        <div>
          Region{' '}
          <Badge variant="secondary" className="text-foreground/50">
            {region}
          </Badge>
        </div>
        <div>
          SELECT <Badge>{selectDuration}ms</Badge>
        </div>
        {actionData?.duration && (
          <div>
            INSERT <Badge variant="destructive">{actionData.duration}ms</Badge>
          </div>
        )}
      </HStack>

      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        <TabsContent value="new">
          <Form
            className="grid grid-cols-2 gap-4"
            method="POST"
            key={form.key}
            {...getFormProps(form)}
          >
            <div>
              <Label htmlFor={fields.name.id}>Name</Label>
              <Input {...getInputProps(fields.name, { type: 'text' })} />
              <div className="text-destructive">{fields.name.errors}</div>
            </div>
            <div>
              <Label htmlFor={fields.phone.id}>Phone</Label>
              <Input {...getInputProps(fields.phone, { type: 'text' })} />
              <div className="text-destructive">{fields.phone.errors}</div>
            </div>
            <div>
              <Label htmlFor={fields.email.id}>Email</Label>
              <Input {...getInputProps(fields.email, { type: 'text' })} />
              <div className="text-destructive">{fields.email.errors}</div>
            </div>
            <div>
              <Label htmlFor={fields.zip.id}>Zip</Label>
              <Input {...getInputProps(fields.zip, { type: 'text' })} />
              <div className="text-destructive">{fields.zip.errors}</div>
            </div>
            <div>
              <Label htmlFor={fields.country.id}>Country</Label>
              <Input {...getInputProps(fields.country, { type: 'text' })} />
              <div className="text-destructive">{fields.country.errors}</div>
            </div>
            <div>
              <Label htmlFor={fields.prefecture.id}>Prefecture</Label>
              <Input {...getInputProps(fields.prefecture, { type: 'text' })} />
              <div className="text-destructive">{fields.prefecture.errors}</div>
            </div>
            <div>
              <Label htmlFor={fields.city.id}>City</Label>
              <Input {...getInputProps(fields.city, { type: 'text' })} />
              <div className="text-destructive">{fields.city.errors}</div>
            </div>
            <div>
              <Label htmlFor={fields.address.id}>Address</Label>
              <Input {...getInputProps(fields.address, { type: 'text' })} />
              <div className="text-destructive">{fields.address.errors}</div>
            </div>
            <div className="col-span-2">
              <Label htmlFor={fields.note.id}>Note</Label>
              <Textarea {...getTextareaProps(fields.note)} />
              <div className="text-destructive">{fields.note.errors}</div>
            </div>

            {form.errors && (
              <div className="text-destructive">{form.errors}</div>
            )}

            <div className="col-span-2">
              <Button
                className="w-full"
                isLoading={
                  navigation.state === 'submitting' &&
                  navigation.location.pathname === '/demo/db/sample_order'
                }
              >
                Submit
              </Button>
            </div>
          </Form>
        </TabsContent>
        <TabsContent value="list">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Created At</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="whitespace-nowrap">
                    {order.createdAt}
                  </TableCell>
                  <TableCell>{order.region}</TableCell>
                  <TableCell>{order.name}</TableCell>
                  <TableCell>{order.country}</TableCell>
                  <TableCell>
                    <Button size="xs" variant="link" asChild>
                      <Link to={`${order.id}`}>Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </Stack>
  )
}
