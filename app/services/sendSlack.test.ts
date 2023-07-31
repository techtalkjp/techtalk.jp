/* eslint-disable @typescript-eslint/unbound-method */
import { IncomingWebhook } from 'typed-slack'
import { expect, test, vi } from 'vitest'
import { sendSlack } from './sendSlack'

vi.mock('typed-slack')

test('sendSlack', async () => {
  const incomingWebhook = new IncomingWebhook('test')

  const form = {
    email: 'coji@techtalk.jp',
    name: 'coji',
    company: 'techtalk',
    phone: '000-0000-0000',
    message: 'Hello!',
    locale: 'ja',
  }
  await sendSlack(form)

  expect(incomingWebhook.send).toHaveBeenCalledWith({
    text: JSON.stringify(form),
  })
})
