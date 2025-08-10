import { useChat } from '@ai-sdk/react'
import {
  DefaultChatTransport,
  type InferUITools,
  type ToolUIPart,
  type UIDataTypes,
  type UIMessage,
} from 'ai'
import { useState } from 'react'
import { href } from 'react-router'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '~/components/ai-elements/conversation'
import { Loader } from '~/components/ai-elements/loader'
import { Message, MessageContent } from '~/components/ai-elements/message'
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from '~/components/ai-elements/prompt-input'
import { Response } from '~/components/ai-elements/response'
import { Tool } from '~/components/ai-elements/tool'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import type { tools } from '../tools'
import type { GameState } from './game-state'

type UseChatToolsMessage = UIMessage<
  never,
  UIDataTypes,
  InferUITools<typeof tools>
>

export default function DokodemoIssyoDemo() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status } = useChat<UseChatToolsMessage>({
    transport: new DefaultChatTransport({
      api: href('/demo/ai-dokodemo-issyo/api'),
    }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage({ text: input })
      setInput('')
    }
  }

  // 最新のゲーム状態を取得
  const gameState = messages
    .filter((m) => m.role === 'assistant')
    .flatMap((m) => m.parts)
    .filter((p) => {
      if (p.type.startsWith('tool-') && 'toolCallId' in p) {
        const toolPart = p as {
          type: `tool-${string}`
          toolCallId: string
          state?: string
          output?: unknown
        }
        return (
          toolPart.state === 'output' &&
          toolPart.type === 'tool-updateGameState'
        )
      }
      return false
    })
    .map((p) => {
      const toolPart = p as {
        type: `tool-${string}`
        state: string
        output?: unknown
      }
      return toolPart.output
    })
    .pop() as GameState | undefined

  const currentState = gameState || {
    affinity: 0,
    mood: 'neutral',
    lexicon: {},
    characterName: 'トロ',
  }

  // 最新のgenerateResponseから絵文字を取得
  const latestEmotion = messages
    .filter((m) => m.role === 'assistant')
    .flatMap((m) => m.parts)
    .filter((p) => {
      if (p.type.startsWith('tool-') && p.type.includes('generateResponse')) {
        const toolPart = p as {
          type: `tool-${string}`
          state?: string
          output?: unknown
        }
        return toolPart.state === 'output'
      }
      return false
    })
    .map((p) => {
      const toolPart = p as {
        type: `tool-${string}`
        output?: unknown
      }
      const result = toolPart.output as { emotion?: string }
      return result?.emotion
    })
    .filter(Boolean)
    .pop()

  const petImage =
    latestEmotion ||
    (currentState.mood === 'happy'
      ? '😺'
      : currentState.mood === 'sad'
        ? '😿'
        : currentState.mood === 'excited'
          ? '🤩'
          : currentState.mood === 'curious'
            ? '🧐'
            : '😸')

  const getAffinityLevel = (affinity: number) => {
    if (affinity < 5) return '初対面'
    if (affinity < 10) return '知り合い'
    if (affinity < 20) return '友達'
    if (affinity < 30) return '親友'
    return '大親友'
  }

  const getMoodEmoji = (mood: string) => {
    const moodMap: Record<string, string> = {
      neutral: '😐',
      happy: '😊',
      curious: '🤔',
      sad: '😢',
      excited: '🤩',
    }
    return moodMap[mood] || '😐'
  }

  const renderToolOutput = (
    part: ToolUIPart<InferUITools<typeof tools>>,
    messageId: string,
    index: number,
  ) => {
    console.log('Rendering tool output:', part)
    if (part.state !== 'output-available' || !part.output) {
      return null
    }

    if (part.type === 'tool-analyzeIntent') {
      const result = part.output
      return (
        <Tool key={`${messageId}-${index}`}>
          <div className="mb-1 text-xs font-medium">🧠 意図解析 (LLM)</div>
          <div className="space-y-1 text-sm">
            {result.intent && <div>意図: {result.intent}</div>}
            {result.taughtWord && (
              <div>教えられた言葉: 「{result.taughtWord}」</div>
            )}
            {result.sentiment && <div>感情: {result.sentiment}</div>}
            {result.topics && result.topics.length > 0 && (
              <div>トピック: {result.topics.join('、')}</div>
            )}
            {result.needsResponse !== undefined && (
              <div>返答必要: {result.needsResponse ? 'はい' : 'いいえ'}</div>
            )}
          </div>
        </Tool>
      )
    }

    if (part.type === 'tool-updateGameState') {
      const result = part.output
      return (
        <Tool key={`${messageId}-${index}`}>
          <div className="mb-1 text-xs font-medium">💾 状態更新</div>
          <div className="space-y-1 text-sm">
            {result.affinity !== undefined && (
              <div>親密度: {result.affinity}</div>
            )}
            {result.mood && <div>ムード: {result.mood}</div>}
            {result.lexicon && (
              <div>覚えた言葉: {Object.keys(result.lexicon).length}個</div>
            )}
          </div>
        </Tool>
      )
    }

    if (part.type === 'tool-checkEvents') {
      const result = part.output
      return (
        <Tool key={`${messageId}-${index}`}>
          <div className="mb-1 text-xs font-medium">🎉 イベント判定 (LLM)</div>
          <div className="space-y-2 text-sm">
            {result.unlocks && result.unlocks.length > 0 && (
              <div className="space-y-1">
                <div className="font-semibold text-green-600">
                  新しいイベント:
                </div>
                {result.unlocks.map((unlock) => (
                  <div key={unlock} className="pl-2">
                    🎊 {unlock}
                  </div>
                ))}
              </div>
            )}

            {result.milestoneMessage && (
              <div className="rounded bg-yellow-50 p-2 text-yellow-800">
                🏆 {result.milestoneMessage}
              </div>
            )}

            {result.suggestions && result.suggestions.length > 0 && (
              <div className="space-y-1">
                <div className="font-medium">遊び方の提案:</div>
                {result.suggestions.map((suggestion, i) => (
                  <div key={i} className="pl-2 text-xs">
                    💡 {suggestion}
                  </div>
                ))}
              </div>
            )}

            {result.nextGoal && (
              <div className="rounded bg-blue-50 p-2 text-blue-800">
                <div className="font-medium">次の目標:</div>
                <div className="text-xs">
                  {result.nextGoal.type}: {result.nextGoal.current} /{' '}
                  {result.nextGoal.target}
                </div>
                <div className="text-xs">報酬: {result.nextGoal.reward}</div>
              </div>
            )}

            {!result.unlocks?.length &&
              !result.milestoneMessage &&
              !result.suggestions?.length &&
              !result.nextGoal && (
                <div className="text-gray-500">特別なイベントはありません</div>
              )}
          </div>
        </Tool>
      )
    }

    if (part.type === 'tool-generateResponse') {
      const result = part.output
      // 開発環境のみツールの詳細を表示
      return (
        <Tool key={`${messageId}-${index}`}>
          <div className="mb-1 text-xs font-medium">
            💬 応答生成 (LLM) {result.emotion}
          </div>
          <div className="space-y-2 text-sm">
            {result.message && (
              <div className="font-medium text-gray-800">{result.message}</div>
            )}

            {result.useWords && result.useWords.length > 0 && (
              <div className="text-xs text-gray-500">
                使用した言葉: {result.useWords.join('、')}
              </div>
            )}

            {result.actions && result.actions.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-medium">提案アクション:</div>
                {result.actions.map((action, i) => (
                  <div key={i} className="pl-2 text-xs text-blue-600">
                    [{action.type}] {action.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Tool>
      )
    }

    return null
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">どこでもいっしょ AI ペット</h1>
        <p className="text-gray-600">
          AIペットと会話しながら仲良くなっていくゲームです。ことばを教えたり、一緒に遊んだりしてペットとの親密度を上げましょう！
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-4xl">{petImage}</span>
                <div>
                  <div className="text-xl">{currentState.characterName}</div>
                  <div className="text-sm text-gray-500">
                    {currentState.nickname
                      ? `「${currentState.nickname}」と呼んでくれるよ`
                      : 'まだ呼び名はないよ'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-1">
                  {getAffinityLevel(currentState.affinity)}
                </Badge>
                <div className="text-sm text-gray-500">
                  ムード: {getMoodEmoji(currentState.mood)}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>親密度</span>
                <span>{currentState.affinity} / 100</span>
              </div>
              <Progress
                value={Math.min(currentState.affinity, 100)}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">
                覚えたことば ({Object.keys(currentState.lexicon).length}個)
              </div>
              <div className="flex flex-wrap gap-1">
                {Object.keys(currentState.lexicon)
                  .slice(0, 10)
                  .map((word) => (
                    <Badge key={word} variant="secondary" className="text-xs">
                      {word}
                    </Badge>
                  ))}
                {Object.keys(currentState.lexicon).length > 10 && (
                  <Badge variant="outline" className="text-xs">
                    +{Object.keys(currentState.lexicon).length - 10}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Conversation>
              <ConversationContent>
                {messages.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    トロと話してみよう！「こんにちは」から始めてみてね。
                  </div>
                )}
                {messages.map((message) => (
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      {(() => {
                        // generateResponseがない場合は、通常のメッセージ表示
                        return message.parts.map((part, index) => {
                          if (part.type === 'text') {
                            return (
                              <Response key={`${message.id}-${index}`}>
                                {part.text}
                              </Response>
                            )
                          }

                          if (
                            part.type === 'tool-analyzeIntent' ||
                            part.type === 'tool-updateGameState' ||
                            part.type === 'tool-checkEvents' ||
                            part.type === 'tool-generateResponse'
                          ) {
                            return renderToolOutput(part, message.id, index)
                          }
                          return null
                        })
                      })()}
                    </MessageContent>
                  </Message>
                ))}
                {status === 'submitted' && <Loader>考え中...</Loader>}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="メッセージを入力... (例: 「りんご」って覚えて！)"
                disabled={status !== 'ready'}
              />
              <PromptInputToolbar>
                <div className="text-xs text-gray-500">
                  ヒント: 「◯◯」って覚えて！と言うと、新しいことばを教えられます
                </div>
                <PromptInputSubmit disabled={!input} status={status} />
              </PromptInputToolbar>
            </PromptInput>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
