import type { UIMessage } from 'ai'
import {
  convertToModelMessages,
  hasToolCall,
  stepCountIs,
  streamText,
} from 'ai'
import {
  analyzeIntent,
  checkEvents,
  generateResponse,
  getGameState,
  updateGameState,
} from '../_shared/tools'
import type { Route } from './+types/route'

export async function action({ request }: Route.ActionArgs) {
  const { messages }: { messages: UIMessage[] } = await request.json()
  const userId = 'demo-user' // 本番環境ではセッションやJWTから取得

  const currentState = getGameState(userId)

  const result = streamText({
    model: 'google/gemini-2.5-flash',
    messages: convertToModelMessages(messages),
    system: [
      'あなたはゲーム内キャラクター「トロ」のAIシステムです。',
      'ユーザーとの対話を管理し、適切なツールを使用して応答を生成します。',
      '絶対に直接テキストで返答せず、必ずツールを使用してください。',
      `現在のムード: ${currentState.mood}`,
      `親密度: ${currentState.affinity}`,
      `覚えたことば数: ${Object.keys(currentState.lexicon).length}`,
      currentState.nickname
        ? `プレイヤーの呼び名: ${currentState.nickname}`
        : '',
      Object.keys(currentState.lexicon).length > 0
        ? `覚えたことば: ${Object.keys(currentState.lexicon).slice(0, 5).join('、')}`
        : '',
      '覚えたことばは会話に自然に混ぜてもよい。',
      '',
      '【重要】必ず以下の順番でツールを使用してください：',
      '1. まずanalyzeIntentでユーザーの意図を解析',
      '2. 次にupdateGameStateで状態を更新（親密度やムードの変更）',
      '3. checkEventsでイベントをチェック（親密度、語彙数、最近覚えた言葉、現在のムードを渡す）',
      '4. 最後にgenerateResponseですべての情報を統合してユーザーへの返答を生成',
    ]
      .filter(Boolean)
      .join('\n'),
    tools: {
      analyzeIntent,
      updateGameState,
      checkEvents,
      generateResponse,
    },
    toolChoice: 'required',
    stopWhen: [hasToolCall('generateResponse'), stepCountIs(5)],
    onStepFinish: ({ toolCalls, toolResults }) => {
      // 意図解析の結果に基づいて状態更新
      if (toolCalls && toolCalls.length > 0) {
        const analyzeTool = toolCalls.find(
          (t) => t.toolName === 'analyzeIntent',
        )
        if (analyzeTool && toolResults.length > 0) {
          const analysis = (toolResults[0] as { result?: unknown })?.result as
            | {
                intent: string
                sentiment: string
                taughtWord?: string | null
                topics?: string[]
                needsResponse?: boolean
              }
            | undefined
          if (analysis) {
            const delta: {
              addAffinity?: number
              mood?: 'neutral' | 'happy' | 'curious' | 'sad' | 'excited'
              taughtWord?: string
              nickname?: string
            } = {
              addAffinity:
                analysis.intent === 'teach-word'
                  ? 2
                  : analysis.intent === 'greet'
                    ? 1
                    : analysis.intent === 'praise'
                      ? 1.5
                      : analysis.intent === 'goodbye'
                        ? 0.3
                        : 0.5,
            }

            if (analysis.sentiment === 'positive') {
              delta.mood = 'happy'
              delta.addAffinity = (delta.addAffinity || 0) + 0.5
            } else if (analysis.sentiment === 'negative') {
              delta.mood = 'sad'
            } else if (analysis.intent === 'question') {
              delta.mood = 'curious'
            }

            if (analysis.taughtWord) {
              delta.taughtWord = analysis.taughtWord
              delta.mood = 'excited'
            }

            // Note: The updateGameState tool will be called automatically by the model
            // based on the system prompt instructions
          }
        }
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
