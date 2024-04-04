import { expect, test } from 'vitest'
import { detectLocale } from './detectLocale'

test('detectLocale default is japanese', () => {
  const locale = detectLocale('/index')
  expect(locale).toBe('ja')
})

test('detectLocale en', () => {
  const locale = detectLocale('/en')
  expect(locale).toBe('en')
})

test('detectLocale en index', () => {
  const locale = detectLocale('/en/index')
  expect(locale).toBe('en')
})
