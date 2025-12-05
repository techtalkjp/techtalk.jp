import { z } from 'zod'
import type { listSampleOrders } from './queries'
import type { buildDummyData } from './utils.server'

export type SampleOrder = Awaited<ReturnType<typeof listSampleOrders>>[number]
export type DummyData = ReturnType<typeof buildDummyData>

export const schema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('new'),
    name: z.string().max(255),
    email: z.email().pipe(z.string().max(255)),
    zip: z.string().max(20),
    country: z.string().max(50),
    prefecture: z.string().max(50),
    city: z.string().max(50),
    address: z.string().max(255),
    phone: z.string().max(15),
    note: z.string().max(1000),
  }),
  z.object({
    intent: z.literal('del'),
    id: z.string(),
  }),
])
