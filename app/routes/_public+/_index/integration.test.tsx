import { createRemixStub } from '@remix-run/testing'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { action } from '~/routes/_public+/api.contact/route'
import Component from './route'

test('test', async () => {
  // arrange
  const RemixStub = createRemixStub([
    { path: '/', Component },
    {
      path: '/api/contact',
      action,
    },
  ])

  // act
  render(<RemixStub />)
  await waitFor(() => {
    expect(screen.getByText("Let's talk")).toBeInTheDocument()
  })

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

  // assert
  await waitFor(() => {
    expect(
      screen.getByText('以下のメッセージを受付けました。', { exact: false }),
    ).toBeInTheDocument()
  })
})
