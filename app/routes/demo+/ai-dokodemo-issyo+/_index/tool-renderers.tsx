import type { InferUITools, ToolUIPart } from 'ai'
import { Tool } from '~/components/ai-elements/tool'
import type { tools } from '../_shared/tools'

type ToolPart = ToolUIPart<InferUITools<typeof tools>>

interface BaseToolRendererProps {
  part: ToolPart
  messageId: string
  index: number
}

function ToolWrapper({
  children,
  messageId,
  index,
}: {
  children: React.ReactNode
  messageId: string
  index: number
}) {
  return <Tool key={`${messageId}-${index}`}>{children}</Tool>
}

function InputStreamingDisplay({
  label,
  data,
}: {
  label: string
  data?: unknown
}) {
  return (
    <>
      <div className="text-sm text-yellow-600">📝 {label}</div>
      {data && (
        <pre className="mt-1 overflow-auto rounded bg-yellow-50 p-2 text-xs text-gray-700">
          {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
        </pre>
      )}
    </>
  )
}

function InputAvailableDisplay({
  label,
  data,
}: {
  label: string
  data?: unknown
}) {
  return (
    <>
      <div className="text-sm text-green-600">✓ {label}</div>
      {data && (
        <pre className="mt-1 overflow-auto rounded bg-green-50 p-2 text-xs text-gray-700">
          {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
        </pre>
      )}
    </>
  )
}

function OutputErrorDisplay({
  errorText,
  defaultMessage,
}: {
  errorText?: string
  defaultMessage: string
}) {
  return (
    <div className="text-sm text-red-600">
      エラー: {errorText || defaultMessage}
    </div>
  )
}

export function AnalyzeIntentTool({
  part,
  messageId,
  index,
}: BaseToolRendererProps) {
  if (part.type !== 'tool-analyzeIntent') return null

  return (
    <ToolWrapper messageId={messageId} index={index}>
      <div className="mb-1 text-xs font-medium">🧠 意図解析 (LLM)</div>

      {part.state === 'input-streaming' && (
        <InputStreamingDisplay label="入力中..." data={part.input?.text} />
      )}

      {part.state === 'input-available' && (
        <InputAvailableDisplay label="入力完了" data={part.input?.text} />
      )}

      {part.state === 'output-available' && (
        <div className="space-y-1 text-sm">
          {part.output.intent && <div>意図: {part.output.intent}</div>}
          {part.output.taughtWord && (
            <div>教えられた言葉: 「{part.output.taughtWord}」</div>
          )}
          {part.output.sentiment && <div>感情: {part.output.sentiment}</div>}
          {part.output.topics && part.output.topics.length > 0 && (
            <div>トピック: {part.output.topics.join('、')}</div>
          )}
          {part.output.needsResponse !== undefined && (
            <div>返答必要: {part.output.needsResponse ? 'はい' : 'いいえ'}</div>
          )}
        </div>
      )}

      {part.state === 'output-error' && (
        <OutputErrorDisplay
          errorText={part.errorText}
          defaultMessage="不明なエラーが発生しました"
        />
      )}
    </ToolWrapper>
  )
}

export function UpdateGameStateTool({
  part,
  messageId,
  index,
}: BaseToolRendererProps) {
  if (part.type !== 'tool-updateGameState') return null

  return (
    <ToolWrapper messageId={messageId} index={index}>
      <div className="mb-1 text-xs font-medium">💾 状態更新</div>

      {part.state === 'input-streaming' && (
        <InputStreamingDisplay label="更新中..." data={part.input} />
      )}

      {part.state === 'input-available' && (
        <InputAvailableDisplay label="更新準備完了" data={part.input} />
      )}

      {part.state === 'output-available' && (
        <div className="space-y-1 text-sm">
          {part.output.affinity !== undefined && (
            <div>親密度: {part.output.affinity}</div>
          )}
          {part.output.mood && <div>ムード: {part.output.mood}</div>}
          {part.output.lexicon && (
            <div>覚えた言葉: {Object.keys(part.output.lexicon).length}個</div>
          )}
        </div>
      )}

      {part.state === 'output-error' && (
        <OutputErrorDisplay
          errorText={part.errorText}
          defaultMessage="状態の更新に失敗しました"
        />
      )}
    </ToolWrapper>
  )
}

export function CheckEventsTool({
  part,
  messageId,
  index,
}: BaseToolRendererProps) {
  if (part.type !== 'tool-checkEvents') return null

  return (
    <ToolWrapper messageId={messageId} index={index}>
      <div className="mb-1 text-xs font-medium">🎉 イベント判定 (LLM)</div>

      {part.state === 'input-streaming' && (
        <InputStreamingDisplay label="確認中..." data={part.input} />
      )}

      {part.state === 'input-available' && (
        <InputAvailableDisplay label="判定準備完了" data={part.input} />
      )}

      {part.state === 'output-available' && (
        <div className="space-y-2 text-sm">
          {part.output.unlocks && part.output.unlocks.length > 0 && (
            <div className="space-y-1">
              <div className="font-semibold text-green-600">
                新しいイベント:
              </div>
              {part.output.unlocks.map((unlock: string) => (
                <div key={unlock} className="pl-2">
                  🎊 {unlock}
                </div>
              ))}
            </div>
          )}

          {part.output.milestoneMessage && (
            <div className="rounded bg-yellow-50 p-2 text-yellow-800">
              🏆 {part.output.milestoneMessage}
            </div>
          )}

          {part.output.suggestions && part.output.suggestions.length > 0 && (
            <div className="space-y-1">
              <div className="font-medium">遊び方の提案:</div>
              {part.output.suggestions.map((suggestion: string, i: number) => (
                <div key={i} className="pl-2 text-xs">
                  💡 {suggestion}
                </div>
              ))}
            </div>
          )}

          {part.output.nextGoal && (
            <div className="rounded bg-blue-50 p-2 text-blue-800">
              <div className="font-medium">次の目標:</div>
              <div className="text-xs">
                {part.output.nextGoal.type}: {part.output.nextGoal.current} /{' '}
                {part.output.nextGoal.target}
              </div>
              <div className="text-xs">報酬: {part.output.nextGoal.reward}</div>
            </div>
          )}

          {!part.output.unlocks?.length &&
            !part.output.milestoneMessage &&
            !part.output.suggestions?.length &&
            !part.output.nextGoal && (
              <div className="text-gray-500">特別なイベントはありません</div>
            )}
        </div>
      )}

      {part.state === 'output-error' && (
        <OutputErrorDisplay
          errorText={part.errorText}
          defaultMessage="イベントの判定に失敗しました"
        />
      )}
    </ToolWrapper>
  )
}

export function GenerateResponseTool({
  part,
  messageId,
  index,
}: BaseToolRendererProps) {
  if (part.type !== 'tool-generateResponse') return null

  return (
    <ToolWrapper messageId={messageId} index={index}>
      <div className="mb-1 text-xs font-medium">
        💬 応答生成 (LLM){' '}
        {part.state === 'output-available' && part.output.emotion}
      </div>

      {part.state === 'input-streaming' && (
        <InputStreamingDisplay label="考え中..." data={part.input} />
      )}

      {part.state === 'input-available' && (
        <InputAvailableDisplay label="生成準備完了" data={part.input} />
      )}

      {part.state === 'output-available' && (
        <div className="space-y-2 text-sm">
          {part.output.message && (
            <div className="font-medium text-gray-800">
              {part.output.message}
            </div>
          )}

          {part.output.useWords && part.output.useWords.length > 0 && (
            <div className="text-xs text-gray-500">
              使用した言葉: {part.output.useWords.join('、')}
            </div>
          )}

          {part.output.actions && part.output.actions.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-medium">提案アクション:</div>
              {part.output.actions.map(
                (action: { type: string; description: string }, i: number) => (
                  <div key={i} className="pl-2 text-xs text-blue-600">
                    [{action.type}] {action.description}
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      )}

      {part.state === 'output-error' && (
        <OutputErrorDisplay
          errorText={part.errorText}
          defaultMessage="応答の生成に失敗しました"
        />
      )}
    </ToolWrapper>
  )
}

export function renderToolOutput(
  part: ToolPart,
  messageId: string,
  index: number,
) {
  const props = { part, messageId, index }

  switch (part.type) {
    case 'tool-analyzeIntent':
      return <AnalyzeIntentTool {...props} />
    case 'tool-updateGameState':
      return <UpdateGameStateTool {...props} />
    case 'tool-checkEvents':
      return <CheckEventsTool {...props} />
    case 'tool-generateResponse':
      return <GenerateResponseTool {...props} />
    default:
      return null
  }
}
