import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { prisma } from '~/services/prisma.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const ret = await prisma.$queryRaw<
    {
      now: string
    }[]
  >`SELECT CURRENT_TIMESTAMP as now`

  return json({ status: 'ok', now: ret[0]?.now })
}
