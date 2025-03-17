import { task } from '@trigger.dev/sdk/v3'
import { calculateCost } from './pdf-extract-text/calculate-cost'
import { extractTextWithLLM } from './pdf-extract-text/extract-text-with-llm'
import { prepareFileContents } from './pdf-extract-text/prepare-file-content'

export const pdfExtractTextTask = task({
  id: 'pdf-extract-text',
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (
    payload: {
      files: { key: string; name: string; type: 'image' | 'pdf' }[]
      prompt?: string
    },
    { ctx },
  ) => {
    // Prepare the contents of the files
    const contents = await prepareFileContents(payload.files)

    // Extract text from the files
    const result = await extractTextWithLLM(contents, payload.prompt)

    // Calculate the cost of the extraction
    const cost = calculateCost(result.usage)

    return {
      text: result.text,
      cost,
    }
  },
})
