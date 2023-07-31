/* eslint-disable @typescript-eslint/unbound-method */
import sgMail from '@sendgrid/mail'
import { expect, test, vi } from 'vitest'
import { sendEmail } from './sendEmail'

vi.mock('@sendgrid/mail')

test('sendEmail', async () => {
  await sendEmail({
    email: 'coji@techtalk.jp',
    name: 'coji',
    company: 'techtalk',
    phone: '000-0000-0000',
    message: 'Hello!',
    locale: 'ja',
  })

  expect(sgMail.setApiKey).toHaveBeenCalledOnce()
  expect(sgMail.send).toHaveBeenCalledOnce()
  expect(sgMail.send).toHaveBeenCalledWith({
    to: 'coji@techtalk.jp',
    from: {
      email: 'info@techtalk.jp',
      name: 'TechTalk',
    },
    bcc: 'info@techtalk.jp',
    replyTo: 'info@techtalk.jp',
    dynamicTemplateData: {
      email: 'coji@techtalk.jp',
      name: 'coji',
      message: 'hello!',
    },
    templateId: 'd-fc1f4a74b71644c0930a8df488956323',
  })
})
