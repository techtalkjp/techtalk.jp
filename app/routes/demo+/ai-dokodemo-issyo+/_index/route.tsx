import { useChat } from '@ai-sdk/react'
import {
  DefaultChatTransport,
  type InferUITools,
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
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import type { GameState } from '../_shared/game-state'
import type { tools } from '../_shared/tools'
import { renderToolOutput } from './tool-renderers'

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
                      {message.parts.map((part, index) => {
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
                      })}
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
