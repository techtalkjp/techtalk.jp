import { ResultAsync } from 'neverthrow'
import type { AppLoadContext } from 'react-router'
import type { ContactFormData } from '../types'

type EnqueueError = { type: 'EnqueueError'; message: string }
export const enqueueImpl = async (
  context: AppLoadContext,
  data: ContactFormData,
) => {
  await context.cloudflare.env.CONTACT_QUEUE.send(data, { contentType: 'json' })
}

export const enqueue = ({
  context,
  data,
}: {
  context: AppLoadContext
  data: ContactFormData
}): ResultAsync<void, EnqueueError> => {
  return ResultAsync.fromPromise(enqueueImpl(context, data), (e) => ({
    type: 'EnqueueError',
    message: String(e),
  }))
}
