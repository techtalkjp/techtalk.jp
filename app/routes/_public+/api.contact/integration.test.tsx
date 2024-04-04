import { createRemixStub } from '@remix-run/testing'
import { render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { expect, test } from 'vitest'
import { ContactForm, action } from './route'

test('お問い合わせフォーム_メール送信成功', async () => {
  const mockServer = setupServer(
    http.post('https://api.sendgrid.com/v3/mail/send', () =>
      HttpResponse.text('ok', { status: 200 }),
    ),
    http.post('https://hooks.slack.com/services/TEST_SLACK_WEBHOOK', () =>
      HttpResponse.text('ok', { status: 200 }),
    ),
  )
  mockServer.listen()

  const RemixStub = createRemixStub([
    {
      path: '/api/contact',
      Component: () => <ContactForm />,
      action,
    },
  ])

  const { getByRole, getByText } = render(
    <RemixStub initialEntries={['/api/contact']} />,
  )

  // 名前
  const nameInput = getByRole('textbox', { name: 'お名前' })
  expect(nameInput).toBeInTheDocument()
  await userEvent.type(nameInput, 'テスト太郎')

  // 会社名
  const companyInput = getByRole('textbox', { name: '会社名' })
  expect(companyInput).toBeInTheDocument()
  await userEvent.type(companyInput, 'テスト株式会社')

  // 電話番号
  const phoneInput = getByRole('textbox', { name: '電話番号' })
  expect(phoneInput).toBeInTheDocument()
  await userEvent.type(phoneInput, '09012345678')

  // メール
  const emailInput = getByRole('textbox', { name: 'メール' })
  expect(emailInput).toBeInTheDocument()
  await userEvent.type(emailInput, 'coji@techtalk.jp')

  // メッセージ
  const messageInput = getByRole('textbox', { name: 'メッセージ' })
  expect(messageInput).toBeInTheDocument()
  await userEvent.type(messageInput, 'テストです')

  // プライバシー
  const privacyCheckbox = getByRole('checkbox', { name: 'privacy' })
  expect(privacyCheckbox).toBeInTheDocument()
  await userEvent.click(privacyCheckbox)

  // 送信
  const submitButton = getByRole('button', { name: "Let's talk" })
  await userEvent.click(submitButton)

  // 送信完了の確認
  await waitFor(() =>
    expect(
      getByText('以下のメッセージを受付けました。', { exact: false }),
    ).toBeInTheDocument(),
  )

  mockServer.close()
})

test('お問い合わせフォーム_メール送信エラー', async () => {
  const mockServer = setupServer(
    http.post('https://api.sendgrid.com/v3/mail/send', () =>
      HttpResponse.text('NG', { status: 500 }),
    ),
    http.post('https://hooks.slack.com/services/TEST_SLACK_WEBHOOK', () =>
      HttpResponse.text('NG', { status: 500 }),
    ),
  )
  mockServer.listen()

  const RemixStub = createRemixStub([
    {
      path: '/api/contact',
      Component: () => <ContactForm />,
      action,
    },
  ])

  const { getByRole, getByText } = render(
    <RemixStub initialEntries={['/api/contact']} />,
  )

  // 名前
  const nameInput = getByRole('textbox', { name: 'お名前' })
  expect(nameInput).toBeInTheDocument()
  await userEvent.type(nameInput, 'テスト太郎')

  // 会社名
  const companyInput = getByRole('textbox', { name: '会社名' })
  expect(companyInput).toBeInTheDocument()
  await userEvent.type(companyInput, 'テスト株式会社')

  // 電話番号
  const phoneInput = getByRole('textbox', { name: '電話番号' })
  expect(phoneInput).toBeInTheDocument()
  await userEvent.type(phoneInput, '09012345678')

  // メール
  const emailInput = getByRole('textbox', { name: 'メール' })
  expect(emailInput).toBeInTheDocument()
  await userEvent.type(emailInput, 'coji@techtalk.jp')

  // メッセージ
  const messageInput = getByRole('textbox', { name: 'メッセージ' })
  expect(messageInput).toBeInTheDocument()
  await userEvent.type(messageInput, 'テストです')

  // プライバシー
  const privacyCheckbox = getByRole('checkbox', { name: 'privacy' })
  expect(privacyCheckbox).toBeInTheDocument()
  await userEvent.click(privacyCheckbox)

  // 送信
  const submitButton = getByRole('button', { name: "Let's talk" })
  await userEvent.click(submitButton)

  // 送信完了の確認
  await waitFor(() =>
    expect(
      getByText('500 Internal Server Error: NG', { exact: false }),
    ).toBeInTheDocument(),
  )

  mockServer.close()
})
