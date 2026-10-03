import { clientEntry, css, on, type Handle } from 'remix/component'

import { primaryButton } from '../ui/styles.ts'
import { FRAME_SUBMIT_ERROR } from './events.ts'

export interface SubmitButtonProps {
  label: string
  pendingLabel: string
  /** 通信エラーなどで送信できなかったときの文言 */
  errorLabel: string
  /** 所属する Frame の名前 */
  frame: string
}

/**
 * 送信中は押せなくし、送信できなかったらその場でエラーを出す。
 * 状態は所属する Frame の再読み込みイベントと、client/entry.ts の失敗通知で切り替える。
 */
export const SubmitButton = clientEntry(
  '/js/entry.js#SubmitButton',
  function SubmitButton(handle: Handle<SubmitButtonProps>) {
    let pending = false
    let failed = false
    // このボタンで送信を始めたか。Frame の再読み込みはページ遷移でも起きるので、
    // 自分の送信のときだけ「送信中」にする
    let submitting = false

    // サーバー描画時は購読しない（workerd では handle.signal を addEventListener に渡せない）
    if (typeof document !== 'undefined') {
      let { signal } = handle
      handle.frame.addEventListener(
        'reloadStart',
        () => {
          if (!submitting) return
          pending = true
          failed = false
          void handle.update()
        },
        { signal },
      )
      handle.frame.addEventListener(
        'reloadComplete',
        () => {
          submitting = false
          pending = false
          void handle.update()
        },
        { signal },
      )
      document.addEventListener(
        FRAME_SUBMIT_ERROR,
        (event) => {
          if ((event as CustomEvent).detail !== handle.props.frame) return
          submitting = false
          pending = false
          failed = true
          void handle.update()
        },
        { signal },
      )
    }

    return () => (
      <div
        mix={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
        })}
      >
        <button
          type="submit"
          // ここで disabled にすると送信そのものが止まるので、印を付けるだけにして
          // 実際の表示は Frame の reloadStart で切り替える
          mix={[
            primaryButton,
            on('click', (event) => {
              // ブラウザの入力チェックで止まる送信は数えない
              let form = (event.currentTarget as HTMLButtonElement).form
              submitting = form?.checkValidity() ?? false
            }),
          ]}
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? handle.props.pendingLabel : handle.props.label}
        </button>
        {failed ? (
          <p
            role="alert"
            mix={css({ fontSize: '0.875rem', color: 'var(--danger)' })}
          >
            {handle.props.errorLabel}
          </p>
        ) : null}
      </div>
    )
  },
)
