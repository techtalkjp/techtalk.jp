import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { createTranslate } from '../app/i18n/index.ts'

describe('createTranslate', () => {
  it('returns Japanese as-is and translates to English', () => {
    assert.equal(createTranslate('ja')('会社概要'), '会社概要')
    assert.equal(createTranslate('en')('会社概要'), 'Company')
  })
})
