import { env } from 'cloudflare:workers'
import { ResultAsync } from 'neverthrow'
import type { ContactInquiry } from '../types'

type EnqueueError = { type: 'EnqueueError'; message: string }
export const enqueueImpl = async (data: ContactInquiry) => {
  await env.CONTACT_WORKFLOW.create({ params: data })
}

export const enqueue = ({
  data,
}: {
  data: ContactInquiry
}): ResultAsync<void, EnqueueError> => {
  return ResultAsync.fromPromise(enqueueImpl(data), (e) => ({
    type: 'EnqueueError',
    message: String(e),
  }))
}
