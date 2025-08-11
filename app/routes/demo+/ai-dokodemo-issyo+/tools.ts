import { generateObject, tool } from 'ai'
import { z } from 'zod'
import type { GameState } from './_index/game-state'

// ゲーム状態を保存（本番環境ではDBやKVストアを使用）
const gameStates = new Map<string, GameState>()

export const getGameState = (userId: string): GameState => {
  return (
    gameStates.get(userId) || {
      affinity: 0,
      mood: 'neutral',
      lexicon: {},
      characterName: 'トロ',
    }
  )
}

export const saveGameState = (userId: string, state: GameState) => {
  gameStates.set(userId, state)
  return state
}

// 意図解析のスキーマ
const intentAnalysisSchema = z.object({
  intent: z
    .enum(['chat', 'teach-word', 'greet', 'praise', 'question', 'goodbye'])
    .describe(
      'ユーザーの発話意図。teach-wordは「〇〇」って覚えて等の新しい言葉を教える時、greetは挨拶、praiseは褒める、questionは質問、goodbyeはさよなら、chatはそれ以外の会話',
    ),
  taughtWord: z
    .string()
    .nullable()
    .describe(
      '「」内の教えられた新しい言葉。「〇〇」って覚えて、のような文の場合のみ抽出',
    ),
  sentiment: z
    .enum(['positive', 'negative', 'neutral'])
    .describe(
      'ユーザーの感情分析。positiveは嬉しい・楽しい等、negativeは悲しい・つらい等',
    ),
  topics: z.array(z.string()).describe('会話のトピックやキーワード（最大3個）'),
  needsResponse: z
    .boolean()
    .describe('返答が必要な発話かどうか。質問や相談は必要'),
})

// ツール定義
export const analyzeIntent = tool({
  description: 'ユーザー発話の意図/新出語/感情をLLMで解析',
  inputSchema: z.object({
    text: z.string().describe('ユーザーの入力テキスト'),
  }),
  outputSchema: intentAnalysisSchema.extend({
    raw: z.string().describe('元のユーザー発話テキスト'),
  }),
  execute: async ({ text }) => {
    const result = await generateObject({
      model: 'google/gemini-2.5-flash',
      schema: intentAnalysisSchema,
      prompt: `以下のユーザーの発話を分析してください。

ユーザーの発話: "${text}"

特に以下の点に注意して分析してください：
1. 「〇〇」って覚えて、「〇〇」を教える、のような新しい言葉を教えているか
2. 挨拶、褒め言葉、質問などの意図は何か
3. ポジティブ・ネガティブ・ニュートラルのどの感情か
4. 会話の主要なトピックは何か
5. AIからの返答を期待しているか`,
    })

    return {
      ...result.object,
      raw: text,
    }
  },
})

export const updateGameState = tool({
  description: 'ゲーム状態を更新',
  inputSchema: z.object({
    userId: z.string(),
    delta: z.object({
      addAffinity: z.number().optional(),
      mood: z
        .enum(['neutral', 'happy', 'curious', 'sad', 'excited'])
        .optional(),
      taughtWord: z.string().optional(),
      nickname: z.string().optional(),
    }),
  }),
  execute: ({ userId, delta }) => {
    const state = getGameState(userId)

    if (delta.addAffinity) {
      state.affinity = Math.min(100, state.affinity + delta.addAffinity)
    }
    if (delta.mood) {
      state.mood = delta.mood
    }
    if (delta.taughtWord) {
      const word = delta.taughtWord.trim()
      state.lexicon[word] = state.lexicon[word] || {
        uses: 0,
        taughtBy: 'player',
      }
      state.lexicon[word].uses++
    }
    if (delta.nickname) {
      state.nickname = delta.nickname
    }

    state.lastInteraction = new Date().toISOString()
    return saveGameState(userId, state)
  },
})

// イベントチェックのスキーマ
const eventCheckSchema = z.object({
  unlocks: z.array(z.string()).describe('解放されるイベントのリスト'),
  suggestions: z
    .array(z.string())
    .describe('現在の状態に基づく遊び方の提案（最大3個）'),
  milestoneMessage: z
    .string()
    .nullable()
    .describe('マイルストーン達成時の特別なメッセージ'),
  nextGoal: z
    .object({
      type: z.string().describe('次の目標のタイプ（親密度、語彙数など）'),
      target: z.number().describe('目標値'),
      current: z.number().describe('現在値'),
      reward: z.string().describe('達成時の報酬'),
    })
    .nullable()
    .describe('次の目標'),
})

export const checkEvents = tool({
  description: '親密度や語彙に応じたイベントをLLMでチェック',
  inputSchema: z.object({
    affinity: z.number().describe('現在の親密度'),
    lexiconSize: z.number().describe('覚えた言葉の数'),
    recentWords: z.array(z.string()).optional().describe('最近覚えた言葉'),
    lastMood: z.string().optional().describe('最後のムード'),
  }),
  outputSchema: eventCheckSchema,
  execute: async ({ affinity, lexiconSize, recentWords, lastMood }) => {
    const result = await generateObject({
      model: 'google/gemini-2.5-flash',
      schema: eventCheckSchema,
      prompt: `AIペットゲームのイベントをチェックして、プレイヤーへのフィードバックを生成してください。

現在の状態:
- 親密度: ${affinity}/100
- 覚えた言葉の数: ${lexiconSize}個
${recentWords && recentWords.length > 0 ? `- 最近覚えた言葉: ${recentWords.join('、')}` : ''}
${lastMood ? `- 最後のムード: ${lastMood}` : ''}

以下の条件でイベントを解放してください：
- 親密度 5: 「呼び名提案」イベント
- 親密度 10: 「特別な挨拶」イベント  
- 親密度 20: 「親友の証」イベント
- 親密度 30: 「秘密の会話」イベント
- 親密度 50: 「永遠の友達」イベント
- 語彙数 3: 「ことばクイズ」イベント
- 語彙数 5: 「ことば辞典」イベント
- 語彙数 10: 「ことば博士」イベント
- 語彙数 20: 「ことばマスター」イベント

また、現在の状態に基づいて：
1. プレイヤーが次に試すべき遊び方の提案を3つまで
2. マイルストーン達成時は特別なメッセージ
3. 次の目標とその報酬

を含めてください。`,
    })

    return result.object
  },
})

// 応答生成のスキーマ
const responseGenerationSchema = z.object({
  message: z.string().describe('トロからユーザーへの返答メッセージ'),
  emotion: z
    .enum(['😸', '😺', '😿', '🤩', '🧐', '😹', '😻'])
    .describe('メッセージの感情を表す絵文字'),
  actions: z
    .array(
      z.object({
        type: z
          .enum(['play', 'teach', 'quiz', 'chat'])
          .describe('アクションタイプ'),
        description: z.string().describe('アクションの説明'),
      }),
    )
    .optional()
    .describe('提案するアクション（オプション）'),
  useWords: z.array(z.string()).optional().describe('返答に使用する覚えた言葉'),
})

export const generateResponse = tool({
  description: 'すべての分析結果を統合してユーザーへの返答を生成',
  inputSchema: z.object({
    userText: z.string().describe('ユーザーの元の発話'),
    intent: z.string().describe('分析された意図'),
    sentiment: z.string().describe('分析された感情'),
    currentMood: z.string().describe('現在のムード'),
    affinity: z.number().describe('現在の親密度'),
    lexicon: z.array(z.string()).describe('覚えている言葉のリスト'),
    nickname: z.string().optional().describe('ユーザーのニックネーム'),
    events: z
      .object({
        unlocks: z.array(z.string()).optional(),
        milestoneMessage: z.string().nullable().optional(),
        suggestions: z.array(z.string()).optional(),
      })
      .optional()
      .describe('イベント情報'),
  }),
  outputSchema: responseGenerationSchema,
  execute: async ({
    userText,
    intent,
    sentiment,
    currentMood,
    affinity,
    lexicon,
    nickname,
    events,
  }) => {
    const result = await generateObject({
      model: 'google/gemini-2.5-flash',
      schema: responseGenerationSchema,
      prompt: `あなたはゲーム内キャラクター「トロ」です。以下の情報を基に、ユーザーへの返答を生成してください。

キャラクター設定：
- 名前：トロ
- 一人称：「ボク」
- 性格：純粋で好奇心旺盛、やさしい
- 語尾：少しやわらかく、敬語は使いすぎない
- 特徴：新しい言葉を覚えるのが大好き

現在の状態：
- ユーザーの発話: "${userText}"
- 発話の意図: ${intent}
- ユーザーの感情: ${sentiment}
- 現在のムード: ${currentMood}
- 親密度: ${affinity}/100
- 覚えた言葉: ${lexicon.length > 0 ? lexicon.slice(0, 10).join('、') : 'まだない'}
${nickname ? `- ユーザーの呼び名: ${nickname}` : ''}

${
  events
    ? `イベント情報:
${events.unlocks?.length ? `- 新しいイベント: ${events.unlocks.join('、')}` : ''}
${events.milestoneMessage ? `- マイルストーン: ${events.milestoneMessage}` : ''}
${events.suggestions?.length ? `- 提案: ${events.suggestions.join('、')}` : ''}`
    : ''
}

返答のガイドライン：
1. 短く感情豊かに返事をする（1-2文程度）
2. 親密度に応じて距離感を調整（低い時は丁寧、高い時は親しみやすく）
3. 覚えた言葉があれば自然に会話に混ぜる
4. ユーザーの感情に共感的に応答
5. 意図に応じた適切な反応：
   - teach-word: 新しい言葉を覚えて喜ぶ
   - greet: 親密度に応じた挨拶を返す
   - praise: 照れたり喜んだりする
   - question: 好奇心を持って答える
   - goodbye: さよならの挨拶
6. イベント解放時は喜びを表現
7. たまに質問で会話を広げる

感情の絵文字選択：
- 😸: 通常
- 😺: 嬉しい
- 😿: 悲しい
- 🤩: とても興奮
- 🧐: 好奇心
- 😹: 楽しい
- 😻: 大好き`,
    })

    return result.object
  },
})

export const tools = {
  analyzeIntent,
  updateGameState,
  checkEvents,
  generateResponse,
}
