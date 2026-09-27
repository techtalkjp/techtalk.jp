import { readFileSync } from 'node:fs'
import { classifyShadow } from '../../workers/workflow/services/classify-shadow.ts'
const rows = JSON.parse(readFileSync('scripts/inquiry/holdout.json', 'utf8'))
const results = rows.map(({ id, label, message }) => ({
  id,
  expected: label,
  ...classifyShadow(message),
}))
console.log(
  JSON.stringify(
    {
      note: 'Synthetic holdout only; not production accuracy.',
      total: rows.length,
      correct: results.filter((row) => row.expected === row.verdict).length,
      results,
    },
    null,
    2,
  ),
)
