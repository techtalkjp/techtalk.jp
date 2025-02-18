import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { createRoutesStub } from 'react-router'
import { expect, test } from 'vitest'
import { action } from '~/routes/_public+/api.contact/route'
import Component from './route'

test('test', async () => {
  // arrange
  // mock serverの 設定
  const mockServer = setupServer(
    http.post('https://api.sendgrid.com/v3/mail/send', () =>
      HttpResponse.text('ok', { status: 200 }),
    ),
    http.post('https://hooks.slack.com/services/TEST_SLACK_WEBHOOK', () =>
      HttpResponse.text('ok', { status: 200 }),
    ),
  )
  mockServer.listen()

  const Stub = createRoutesStub(
    [
      { path: '/', Component },
      { path: '/api/contact', action },
    ],
    {
      cloudflare: {
        env: {
          SENDGRID_API_KEY: 'TEST_SENDGRID_API_KEY',
          SLACK_WEBHOOK: 'https://hooks.slack.com/services/TEST_SLACK_WEBHOOK',
        },
      },
    },
  )

  // act
  render(<Stub />)

  expect(await screen.findByText("Let's talk")).toBeInTheDocument()

  await userEvent.type(
    screen.getByRole('textbox', { name: 'お名前' }),
    'john doe',
  )
  await userEvent.type(
    screen.getByRole('textbox', { name: '会社名' }),
    'company',
  )
  await userEvent.type(
    screen.getByRole('textbox', { name: '電話番号' }),
    '09012345678',
  )
  await userEvent.type(
    screen.getByRole('textbox', { name: 'メール' }),
    'test@example.com',
  )
  await userEvent.type(
    screen.getByRole('textbox', { name: 'メッセージ' }),
    'こんにちは\nテストです。',
  )
  await userEvent.click(screen.getByRole('checkbox', { name: 'privacy' }))
  await userEvent.click(screen.getByRole('button', { name: "Let's talk" }))

  expect(
    await screen.findByText('以下のメッセージを受付けました。', {
      exact: false,
    }),
  ).toBeInTheDocument()
})
