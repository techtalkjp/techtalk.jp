import { createRemixStub } from '@remix-run/testing'
import { render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { expect, test } from 'vitest'
import { ContactForm, action } from './route'

test('お問い合わせフォーム_メール送信成功', async () => {
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

  // コンタクトフォームの action を useFetch で使うコンポーネント
  const RemixStub = createRemixStub([
    { path: '/api/contact', Component: () => <ContactForm />, action },
  ])
  const { getByRole, getByText } = render(
    <RemixStub initialEntries={['/api/contact']} />,
  )

  // フォーム入力
  await userEvent.type(getByRole('textbox', { name: 'お名前' }), 'テスト太郎')
  await userEvent.type(
    getByRole('textbox', { name: '会社名' }),
    'テスト株式会社',
  )
  await userEvent.type(
    getByRole('textbox', { name: '電話番号' }),
    '09012345678',
  )
  await userEvent.type(
    getByRole('textbox', { name: 'メール' }),
    'coji@techtalk.jp',
  )
  await userEvent.type(
    getByRole('textbox', { name: 'メッセージ' }),
    'こんにちは！',
  )
  await userEvent.click(getByRole('checkbox', { name: 'privacy' }))

  // 送信
  await userEvent.click(getByRole('button', { name: "Let's talk" }))

  // 送信完了の確認
  await waitFor(() =>
    expect(
      getByText('以下のメッセージを受付けました。', { exact: false }),
    ).toBeInTheDocument(),
  )

  // mock server のクリーンアップ
  mockServer.close()
})

test('お問い合わせフォーム_メール送信エラー', async () => {
  // mock serverの 設定
  const mockServer = setupServer(
    http.post('https://api.sendgrid.com/v3/mail/send', () =>
      HttpResponse.text('NG', { status: 500 }),
    ),
    http.post('https://hooks.slack.com/services/TEST_SLACK_WEBHOOK', () =>
      HttpResponse.text('NG', { status: 500 }),
    ),
  )
  mockServer.listen()

  // コンタクトフォームの action を useFetch で使うコンポーネント
  const RemixStub = createRemixStub([
    { path: '/api/contact', Component: () => <ContactForm />, action },
  ])
  const { getByRole, getByText } = render(
    <RemixStub initialEntries={['/api/contact']} />,
  )

  // フォーム入力
  await userEvent.type(getByRole('textbox', { name: 'お名前' }), 'テスト太郎')
  await userEvent.type(
    getByRole('textbox', { name: '会社名' }),
    'テスト株式会社',
  )
  await userEvent.type(
    getByRole('textbox', { name: '電話番号' }),
    '09012345678',
  )
  await userEvent.type(
    getByRole('textbox', { name: 'メール' }),
    'coji@techtalk.jp',
  )
  await userEvent.type(
    getByRole('textbox', { name: 'メッセージ' }),
    'こんにちは！',
  )
  await userEvent.click(getByRole('checkbox', { name: 'privacy' }))

  // 送信
  await userEvent.click(getByRole('button', { name: "Let's talk" }))

  // 送信完了の確認
  await waitFor(() =>
    expect(
      getByText('500 Internal Server Error: NG', { exact: false }),
    ).toBeInTheDocument(),
  )

  mockServer.close()
})
