import { expect, test, vi } from 'vitest'
import { sendEmail } from './sendEmail'
import sgMail from '@sendgrid/mail'

vi.mock('@sendgrid/mail')

test('sendEmail', async () => {
  await sendEmail({
    email: 'coji@techtalk.jp',
    name: 'coji',
    message: 'hello!'
  })

  expect(sgMail.setApiKey).toHaveBeenCalledOnce()
  expect(sgMail.send).toHaveBeenCalledOnce()
  expect(sgMail.send).toHaveBeenCalledWith({
    to: 'coji@techtalk.jp',
    from: {
      email: 'info@techtalk.jp',
      name: 'TechTalk'
    },
    bcc: 'info@techtalk.jp',
    replyTo: 'info@techtalk.jp',
    dynamicTemplateData: {
      email: 'coji@techtalk.jp',
      name: 'coji',
      message: 'hello!'
    },
    templateId: 'd-fc1f4a74b71644c0930a8df488956323',
    mailSettings: { sandboxMode: { enable: true } }
  })
})
