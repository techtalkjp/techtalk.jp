const segmenter = new Intl.Segmenter('ja', { granularity: 'word' })

export function tokenize(text: string): string {
  return [...segmenter.segment(text)]
    .filter((s) => s.isWordLike)
    .map((s) => s.segment)
    .join(' ')
}
