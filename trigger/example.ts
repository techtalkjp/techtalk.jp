import { logger, task, wait } from '@trigger.dev/sdk/v3'

export const pdfExtractTextTask = task({
  id: 'pdf-extract-text',
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (
    payload: {
      files: { key: string; name: string; type: string }[]
      prompt: 'image' | 'pdf'
    },
    { ctx },
  ) => {
    logger.log('Hello, world!', { payload, ctx })

    await wait.for({ seconds: 5 })

    // const content: Array<ImagePart | FilePart> = []
    // for (const file of payload.files) {
    //   const c: ImagePart | FilePart | null = await match(file.type)
    //     .when(
    //       (t) => t === 'image'
    //       async (f) =>
    //         ({
    //           type: 'file',
    //           data: await f.arrayBuffer(),
    //           mimeType: 'application/pdf',
    //         }) satisfies FilePart,
    //     )
    //     .when(
    //       (f) => f.type.startsWith('image/'),
    //       async (f) =>
    //         ({
    //           type: 'image',
    //           image: await f.arrayBuffer(),
    //         }) satisfies ImagePart,
    //     )
    //     .otherwise(() => null)
    //   if (c !== null) {
    //     content.push(c)
    //   }
    // }

    // if (content.length === 0) {
    //   return {
    //     lastResult: submission.reply({
    //       formErrors: ['Unsupported file type'],
    //     }),
    //   }
    // }

    // const result = await generateText({
    //   model: google('gemini-2.0-flash-lite-preview-02-05', {
    //     structuredOutputs: false,
    //   }),
    //   messages: [
    //     {
    //       role: 'system',
    //       content:
    //         'Analyze the file’s content and output text in Markdown without triple backticks or page numbers.',
    //     },
    //     {
    //       role: 'user',
    //       content: submission.value.prompt ?? '',
    //     },
    //     {
    //       role: 'user',
    //       content,
    //     },
    //   ],
    // })

    // const ret = await fetch(
    //   'https://api.excelapi.org/currency/rate?pair=usd-jpy',
    // )
    // const usdToJpy = Number(await ret.text())

    // const cost = {
    //   prompt: {
    //     tokens: result.usage.promptTokens,
    //     usd: (result.usage.promptTokens / 1000000) * 0.1,
    //     jpy: (result.usage.promptTokens / 1000000) * 0.1 * usdToJpy,
    //   },
    //   completion: {
    //     tokens: result.usage.completionTokens,
    //     usd: (result.usage.completionTokens / 1000000) * 0.4,
    //     jpy: (result.usage.completionTokens / 1000000) * 0.4 * usdToJpy,
    //   },
    //   total: {
    //     tokens: result.usage.promptTokens + result.usage.completionTokens,
    //     usd:
    //       (result.usage.promptTokens / 1000000) * 0.075 +
    //       (result.usage.completionTokens / 1000000) * 0.3,
    //     jpy:
    //       ((result.usage.promptTokens / 1000000) * 0.075 +
    //         (result.usage.completionTokens / 1000000) * 0.3) *
    //       usdToJpy,
    //   },
    // }

    return {
      message: 'Hello, world!',
    }
  },
})
