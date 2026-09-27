import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import test from 'node:test'
import { classifyShadow } from '../workers/workflow/services/classify-shadow.ts'
import {
  textFeatures,
  predictText,
} from '../workers/workflow/services/text-features.ts'
import { textModel } from '../workers/workflow/services/text-model.ts'
import { logEvaluation } from '../workers/workflow/services/evaluations.ts'
import { summarize } from '../scripts/inquiry/metrics.mjs'
import { train } from '../scripts/inquiry/train.mjs'

const fixtureModel = {
  version: 'fixture',
  source: 'synthetic-bootstrap',
  trainingCount: 3,
  trainingIds: [],
  weights: { 営業: [2, -1, -1], 発注: [-1, -1, 2], 相談: [-1, 2, -1] },
  bias: [0, 0, 0],
}

test('shared preprocessing normalizes Japanese text and bounds raw input before normalization', () => {
  assert.deepEqual(textFeatures(' ＡＢＣ\n　発注 '), textFeatures('abc 発注'))
  assert.deepEqual(
    textFeatures('発注'.repeat(250) + '営業'),
    textFeatures('発注'.repeat(250)),
  )
  assert(textFeatures('😀営業').has('😀営'))
})

test('linear inference distinguishes direction and does not let unknown text use the class prior', () => {
  for (const [message, verdict] of [
    ['営業', 'sales'],
    ['発注', 'normal'],
    ['相談', 'gray'],
  ]) {
    const result = predictText(fixtureModel, message)
    assert.equal(result.verdict, verdict)
    assert(
      Math.abs(result.probabilities.reduce((sum, p) => sum + p, 0) - 1) < 1e-12,
    )
  }
  assert.equal(
    predictText({ ...fixtureModel, bias: [100, 0, 0] }, '未知').verdict,
    'gray',
  )
  assert.equal(classifyShadow('').verdict, 'gray')
})

test('training reproduces the shipped bootstrap artifact without using holdout examples', () => {
  const samples = JSON.parse(
    readFileSync('scripts/inquiry/bootstrap.json', 'utf8'),
  ).map(({ id, message, label }) => ({ id, message, label }))
  const trained = train(samples, 'synthetic-bootstrap')
  assert.deepEqual(trained, train(samples, 'synthetic-bootstrap'))
  if (textModel.source === 'synthetic-bootstrap') {
    assert.deepEqual(trained, textModel)
  }
  assert.throws(
    () => train([{ message: 'test', label: 'sales' }], 'human-labeled'),
    /all three classes/,
  )
})

test('additive migration preserves old records and logs LLM and shadow results together', async () => {
  const sqlite = new DatabaseSync(':memory:')
  try {
    sqlite.exec(readFileSync('migrations/0004_inquiry_evaluations.sql', 'utf8'))
    sqlite.exec(
      "INSERT INTO inquiry_evaluations(name,email,message_excerpt,rule_score,rule_tier,llm_verdict,routed_as) VALUES('old','old@example.invalid','old',0,'low','sales','sales')",
    )
    sqlite.exec(readFileSync('migrations/0005_inquiry_ml_shadow.sql', 'utf8'))
    assert.equal(
      sqlite
        .prepare('SELECT ml_verdict FROM inquiry_evaluations WHERE id=1')
        .get().ml_verdict,
      null,
    )
    const db = {
      prepare: (sql) => ({
        bind: (...values) => ({
          run: () => Promise.resolve(sqlite.prepare(sql).run(...values)),
        }),
      }),
    }
    const inquiry = {
      name: 'test',
      email: 'test@example.invalid',
      company: '',
      message: '発注'.repeat(400),
      rule: { score: 0, tier: 'low', reasons: [] },
    }
    const llm = {
      verdict: 'normal',
      confidence: 90,
      reason: 'test',
      model: 'llm-test',
      succeeded: true,
    }
    const shadow = {
      verdict: 'sales',
      score: 0.8,
      model: 'local-test',
      error: null,
    }
    await logEvaluation(db, inquiry, llm, 'normal', shadow)
    const row = sqlite
      .prepare('SELECT * FROM inquiry_evaluations WHERE id=2')
      .get()
    assert.equal(row.routed_as, 'normal')
    assert.equal(row.llm_verdict, 'normal')
    assert.equal(row.llm_succeeded, 1)
    assert.equal(row.ml_verdict, 'sales')
    assert.equal(row.ml_score, 0.8)
    assert.equal(row.message_excerpt.length, 500)
    assert.equal(row.human_verdict, null)
    await logEvaluation(db, inquiry, llm, 'normal', {
      verdict: null,
      score: null,
      model: 'local-test',
      error: 'prediction-failed',
    })
    assert.equal(
      sqlite
        .prepare('SELECT ml_error FROM inquiry_evaluations WHERE id=3')
        .get().ml_error,
      'prediction-failed',
    )
  } finally {
    sqlite.close()
  }
})

test('metrics separate agreement from human accuracy and exclude model training rows and failed LLM responses', () => {
  const row = (id, ml, llm, human, extra = {}) => ({
    id,
    ml_model: 'fixture',
    ml_verdict: ml,
    llm_verdict: llm,
    llm_confidence: 90,
    llm_succeeded: 1,
    human_verdict: human,
    ml_error: null,
    ...extra,
  })
  const rows = [
    row(1, 'sales', 'normal', 'normal'),
    row(2, 'sales', 'sales', 'sales'),
    row(3, 'gray', 'normal', null),
    row(4, 'normal', 'normal', 'normal', {
      llm_confidence: 0,
      llm_succeeded: 0,
    }),
    row(5, 'sales', 'sales', 'sales'),
    row(6, null, 'normal', 'normal', { ml_error: 'prediction-failed' }),
  ]
  const [report] = summarize(rows, { version: 'fixture', trainingIds: [5] })
  assert.equal(report.agreementWithLlm, 0.5)
  assert.equal(report.excludedTrainingRows, 1)
  assert.equal(report.failures, 1)
  assert.equal(report.ml.count, 3)
  assert.equal(report.ml.accuracy, 2 / 3)
  assert.equal(report.ml.salesPrecision, 0.5)
  assert.equal(report.ml.salesRecall, 1)
  assert.equal(report.ml.legitimateBlockedRate, 0.5)
  assert.equal(report.pairedComparison.ml.count, 2)
  assert.equal(report.pairedComparison.llm.accuracy, 1)
  const [zero] = summarize(
    [row(8, 'gray', 'gray', 'gray', { llm_confidence: 0 })],
    { version: 'fixture', trainingIds: [] },
  )
  assert.equal(zero.llmComparable, 1)
  assert.equal(zero.pairedComparison.llm.count, 1)
  const [empty] = summarize([row(7, 'normal', 'normal', null)], {
    version: 'fixture',
    trainingIds: [],
  })
  assert.equal(empty.ml.accuracy, null)
  assert.equal(empty.ml.salesRecall, null)
})
