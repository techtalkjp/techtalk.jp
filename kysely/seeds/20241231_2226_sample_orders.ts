import type { Kysely } from 'kysely'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function seed(db: Kysely<any>): Promise<void> {
  await db
    .insertInto('sample_orders')
    .values({
      region: 'nrt',
      name: 'John Doe',
      email: 'john_doe@example.com',
      zip: '1234567',
      country: 'Japan',
      prefecture: 'Tokyo',
      city: 'Shinjuku',
      address: '1-2-3 Nishi-Shinjuku',
      phone: '090-1234-5678',
      note: 'Please handle with care',
    })
    .execute()
}
