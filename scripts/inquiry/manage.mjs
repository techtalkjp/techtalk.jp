import { spawnSync } from 'node:child_process'
import { chmodSync, mkdirSync, writeFileSync } from 'node:fs'
import { textModel } from '../../workers/workflow/services/text-model.ts'
import { summarize } from './metrics.mjs'

// pnpm 12 は run の区切り記号もスクリプトへ渡す。
const [command, ...args] = process.argv.slice(2).filter((arg) => arg !== '--')
const local = args.includes('--local')
const parameters = args.filter((arg) => arg !== '--local')
const execute = (sql) => {
  // --file はremoteでアップロード進捗がstdoutに混ざるため、単一SQLを渡す。
  // SQLには検証済みID/ラベルのみを補間し、本文・秘密値は含めない。
  const processResult = spawnSync(
    'pnpm',
    [
      'exec',
      'wrangler',
      'd1',
      'execute',
      'techtalkjp',
      local ? '--local' : '--remote',
      '--command',
      sql,
      '--json',
    ],
    { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
  )
  if (processResult.status !== 0)
    throw new Error(
      'D1 command failed; check Wrangler authentication and migrations',
    )
  const result = JSON.parse(processResult.stdout)
  if (result.some((item) => !item.success)) throw new Error('D1 query failed')
  return result
}

if (command === 'label') {
  const [id, label] = parameters
  if (
    !/^[1-9]\d*$/.test(id ?? '') ||
    !Number.isSafeInteger(Number(id)) ||
    !['sales', 'gray', 'normal'].includes(label)
  ) {
    throw new Error(
      'Usage: inquiry:manage label <id> <sales|gray|normal> [--local]',
    )
  }
  const [result] = execute(
    `UPDATE inquiry_evaluations SET human_verdict='${label}', human_labeled_at=CURRENT_TIMESTAMP WHERE id=${id} RETURNING id;`,
  )
  if (result.results.length !== 1 || result.results[0].id !== Number(id))
    throw new Error('Inquiry id not found; label was not saved')
  console.log(JSON.stringify({ id: Number(id), label, saved: true }))
} else if (command === 'report') {
  const [result] = execute(
    'SELECT id, ml_model, ml_verdict, ml_error, llm_verdict, llm_succeeded, human_verdict FROM inquiry_evaluations WHERE ml_model IS NOT NULL ORDER BY id;',
  )
  console.log(
    JSON.stringify(
      {
        note: 'LLM agreement is not accuracy. Accuracy requires human labels; null means insufficient data. Confusion rows=human, columns=prediction.',
        modelSource: textModel.source,
        reports: summarize(result.results, textModel),
      },
      null,
      2,
    ),
  )
} else if (command === 'export' || command === 'training') {
  mkdirSync('.tmp', { recursive: true })
  const output =
    parameters[0] ??
    (command === 'training'
      ? '.tmp/inquiry-training.private.json'
      : '.tmp/inquiry-review.private.json')
  const query =
    command === 'training'
      ? "SELECT id, message_excerpt AS message, human_verdict AS label, 'human' AS source FROM inquiry_evaluations WHERE human_verdict IS NOT NULL ORDER BY id;"
      : 'SELECT id, message_excerpt AS message, llm_verdict, llm_confidence, llm_succeeded, ml_verdict, ml_score, ml_model, human_verdict AS label, created_at FROM inquiry_evaluations ORDER BY human_verdict IS NOT NULL, id;'
  const [result] = execute(query)
  writeFileSync(output, JSON.stringify(result.results, null, 2) + '\n', {
    mode: 0o600,
  })
  chmodSync(output, 0o600)
  console.log(
    JSON.stringify({
      output,
      count: result.results.length,
      note: 'Private message excerpts saved locally; do not commit this file.',
    }),
  )
} else {
  throw new Error(
    'Usage: inquiry:manage <report|export [file]|training [file]|label id verdict> [--local]',
  )
}
