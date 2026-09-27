const labels = ['sales', 'gray', 'normal']
const ratio = (numerator, denominator) =>
  denominator ? numerator / denominator : null

export const summarize = (rows, currentModel) => {
  const models = [...new Set(rows.map((row) => row.ml_model).filter(Boolean))]
  return models.map((model) => {
    const subset = rows.filter((row) => row.ml_model === model)
    const valid = subset.filter(
      (row) => labels.includes(row.ml_verdict) && !row.ml_error,
    )
    const comparable = valid.filter(
      (row) => labels.includes(row.llm_verdict) && row.llm_succeeded === 1,
    )
    const trainingIds = new Set(
      model === currentModel.version ? currentModel.trainingIds : [],
    )
    const labeled = valid.filter(
      (row) => labels.includes(row.human_verdict) && !trainingIds.has(row.id),
    )
    const evaluate = (verdictKey, candidates) => {
      const confusion = Object.fromEntries(
        labels.map((actual) => [
          actual,
          Object.fromEntries(labels.map((predicted) => [predicted, 0])),
        ]),
      )
      for (const row of candidates)
        confusion[row.human_verdict][row[verdictKey]]++
      const trueSales = candidates.filter(
        (row) => row.human_verdict === 'sales',
      )
      const predictedSales = candidates.filter(
        (row) => row[verdictKey] === 'sales',
      )
      const correctSales = candidates.filter(
        (row) => row.human_verdict === 'sales' && row[verdictKey] === 'sales',
      ).length
      const normal = candidates.filter((row) => row.human_verdict === 'normal')
      return {
        count: candidates.length,
        accuracy: ratio(
          candidates.filter((row) => row.human_verdict === row[verdictKey])
            .length,
          candidates.length,
        ),
        salesPrecision: ratio(correctSales, predictedSales.length),
        salesRecall: ratio(correctSales, trueSales.length),
        legitimateBlockedRate: ratio(
          normal.filter((row) => row[verdictKey] === 'sales').length,
          normal.length,
        ),
        confusion,
      }
    }
    const paired = labeled.filter(
      (row) => labels.includes(row.llm_verdict) && row.llm_succeeded === 1,
    )
    return {
      model,
      received: subset.length,
      failures: subset.length - valid.length,
      llmComparable: comparable.length,
      agreementWithLlm: ratio(
        comparable.filter((row) => row.ml_verdict === row.llm_verdict).length,
        comparable.length,
      ),
      disagreements: comparable
        .filter((row) => row.ml_verdict !== row.llm_verdict)
        .map((row) => row.id),
      excludedTrainingRows: valid.filter(
        (row) => labels.includes(row.human_verdict) && trainingIds.has(row.id),
      ).length,
      humanLabeled: labeled.length,
      ml: evaluate('ml_verdict', labeled),
      // 公平な比較は両方の判定が成功した同じ集合で行う。
      pairedComparison: {
        ml: evaluate('ml_verdict', paired),
        llm: evaluate('llm_verdict', paired),
      },
    }
  })
}
