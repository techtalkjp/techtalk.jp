import { calculateCost } from './pdf-extract-text/calculate-cost'
import { extractTextWithLLM } from './pdf-extract-text/extract-text-with-llm'
import { prepareFileContents } from './pdf-extract-text/prepare-file-content'

export const pdfExtractTextTask = {
  id: 'pdf-extract-text',
  machine: 'micro',
  maxDuration: 300, // Stop executing after 5 mins of compute
  run: async (payload: {
    file: { prefix: string; key: string; name: string; type: 'image' | 'pdf' }
    prompt?: string
  }) => {
    // Prepare the contents of the files
    const content = await prepareFileContents(payload.file)
    if (content === null) {
      throw new Error('Unsupported file')
    }

    // Extract text from the files
    const result = await extractTextWithLLM([content], payload.prompt)

    // Calculate the cost of the extraction
    const cost = calculateCost(result.usage)

    return {
      text: result.text,
      cost,
    }
  },
}
