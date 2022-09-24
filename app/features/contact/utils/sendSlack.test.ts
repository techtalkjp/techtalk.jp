import { test, expect, vi } from 'vitest'
import { IncomingWebhook } from 'typed-slack'
import { sendSlack } from './sendSlack'

vi.mock('typed-slack')

test('sendSlack', async () => {
  const incommingWebhook = new IncomingWebhook('test')

  await sendSlack({
    email: 'coji@techtalk.jp',
    name: 'coji',
    message: 'Hello!'
  })

  expect(incommingWebhook.send).toHaveBeenCalledOnce()
})
