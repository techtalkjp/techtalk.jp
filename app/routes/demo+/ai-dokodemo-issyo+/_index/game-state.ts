export type GameState = {
  affinity: number
  mood: 'neutral' | 'happy' | 'curious' | 'sad' | 'excited'
  lexicon: Record<string, { uses: number; taughtBy: 'player' | 'auto' }>
  nickname?: string
  characterName: string
  lastInteraction?: string
}
