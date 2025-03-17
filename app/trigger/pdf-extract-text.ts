import { google } from '@ai-sdk/google'
import { logger, task, wait } from '@trigger.dev/sdk/v3'
import { generateText, type FilePart, type ImagePart } from 'ai'
import { match } from 'ts-pattern'
import { createMinioService } from '~/services/minio.server'

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
    logger.log('Hello, world!', { payload, ctx })
    await wait.for({ seconds: 5 })

    const minio = createMinioService(process.env.TECHTALK_S3_URL)

    const content: Array<ImagePart | FilePart> = []
    for (const file of payload.files) {
      const url = await minio.generatePresignedUrl(file.key, 'GET')
      const c = match(file.type)
        .when(
          (t) => t === 'pdf',
          () =>
            ({
              type: 'file',
              data: url,
              mimeType: 'application/pdf',
            }) satisfies FilePart,
        )
        .when(
          (t) => t === 'image',
          () =>
            ({
              type: 'image',
              image: url,
            }) satisfies ImagePart,
        )
        .otherwise((t) => {
          logger.error('Unsupported file type', { t })
          return null
        })
      if (c !== null) {
        content.push(c)
      }
    }

    if (content.length === 0) {
      logger.error('Unsupported file type', { files: payload.files })
      throw new Error('Unsupported file type')
    }

    const result = await generateText({
      model: google('gemini-2.0-flash-lite-preview-02-05', {
        structuredOutputs: false,
      }),
      messages: [
        {
          role: 'system',
          content:
            'Analyze the file’s content and output text in Markdown without triple backticks or page numbers.',
        },
        {
          role: 'user',
          content,
        },
        {
          role: 'user',
          content: payload.prompt ?? '',
        },
      ],
    })

    const ret = await fetch(
      'https://api.excelapi.org/currency/rate?pair=usd-jpy',
    )
    const usdToJpy = Number(await ret.text())

    const cost = {
      prompt: {
        tokens: result.usage.promptTokens,
        usd: (result.usage.promptTokens / 1000000) * 0.1,
        jpy: (result.usage.promptTokens / 1000000) * 0.1 * usdToJpy,
      },
      completion: {
        tokens: result.usage.completionTokens,
        usd: (result.usage.completionTokens / 1000000) * 0.4,
        jpy: (result.usage.completionTokens / 1000000) * 0.4 * usdToJpy,
      },
      total: {
        tokens: result.usage.promptTokens + result.usage.completionTokens,
        usd:
          (result.usage.promptTokens / 1000000) * 0.075 +
          (result.usage.completionTokens / 1000000) * 0.3,
        jpy:
          ((result.usage.promptTokens / 1000000) * 0.075 +
            (result.usage.completionTokens / 1000000) * 0.3) *
          usdToJpy,
      },
    }

    return {
      text: result.text,
      cost,
    }
  },
})
