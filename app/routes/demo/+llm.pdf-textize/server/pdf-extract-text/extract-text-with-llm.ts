import { generateText, type FilePart, type ImagePart } from 'ai'

export const extractTextWithLLM = async (
  contents: Array<ImagePart | FilePart>,
  prompt?: string,
) => {
  return await generateText({
    model: 'google/gemini-2.0-flash',
    messages: [
      {
        role: 'system',
        content:
          'Analyze the file’s content and output text in Markdown without triple backticks or page numbers.',
      },
      {
        role: 'user',
        content: contents,
      },
      {
        role: 'user',
        content: prompt ?? '',
      },
    ],
  })
}
