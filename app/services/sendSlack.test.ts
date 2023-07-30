/* eslint-disable @typescript-eslint/unbound-method */
import { test, expect, vi } from 'vitest'
import { IncomingWebhook } from 'typed-slack'
import { sendSlack } from './sendSlack'

vi.mock('typed-slack')

test('sendSlack', async () => {
  const incommingWebhook = new IncomingWebhook('test')

  const form = {
    email: 'coji@techtalk.jp',
    name: 'coji',
    message: 'Hello!'
  }
  await sendSlack(form)

  expect(incommingWebhook.send).toHaveBeenCalledWith({
    text: JSON.stringify(form)
  })
})
