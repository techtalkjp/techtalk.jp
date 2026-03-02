import { listContents, searchContents } from './+db.fts/queries'
import type { Route } from './+types/api.fts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q') ?? ''
  const limit = Number(url.searchParams.get('limit') ?? '20')

  const results = q
    ? await searchContents(q)
    : await listContents(Math.min(limit, 100))

  return Response.json({ results }, { headers: corsHeaders })
}
