import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  CLASSIFY_MODEL,
  classifyInquiry,
} from '../workers/workflow/services/classify.ts'

const inquiry = {
  name: '評価用送信者',
  company: '',
  email: 'test@example.invalid',
  message: '御社に開発を依頼したいので見積をお願いします。',
  rule: { score: 0, tier: 'normal', reasons: [] },
}

test('preserves a valid LLM verdict, including zero confidence', async () => {
  for (const verdict of ['sales', 'gray', 'normal']) {
    const result = await classifyInquiry(
      {
        run: () =>
          Promise.resolve({
            response: JSON.stringify({
              verdict,
              confidence: 0,
              reason: 'fixture',
            }),
          }),
      },
      inquiry,
    )
    assert.equal(result.verdict, verdict)
    assert.equal(result.confidence, 0)
    assert.equal(result.succeeded, true)
    assert.equal(result.model, CLASSIFY_MODEL)
  }
})

test('bounds the input passed to the current AI binding', async () => {
  let request
  await classifyInquiry(
    {
      run: (...args) => {
        request = args
        return Promise.resolve({
          response: '{"verdict":"normal","confidence":90}',
        })
      },
    },
    { ...inquiry, message: 'あ'.repeat(1100) },
  )
  assert.equal(request[0], CLASSIFY_MODEL)
  assert.match(
    request[1].messages[1].content,
    new RegExp(`本文:\\n${'あ'.repeat(1000)}$`),
  )
})

test('failed and malformed responses fail open and record failure', async () => {
  for (const run of [
    () => Promise.resolve({ response: '{"verdict":"spam"}' }),
    () => Promise.resolve(null),
    () => Promise.reject(new Error('provider unavailable')),
  ]) {
    const result = await classifyInquiry({ run }, inquiry)
    assert.equal(result.verdict, 'normal')
    assert.equal(result.succeeded, false)
  }
})
