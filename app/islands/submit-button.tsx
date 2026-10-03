import { clientEntry, css, type Handle } from 'remix/component'

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

    // サーバー描画時は購読しない（workerd では handle.signal を addEventListener に渡せない）
    if (typeof document !== 'undefined') {
      let { signal } = handle
      handle.frame.addEventListener(
        'reloadStart',
        () => {
          pending = true
          failed = false
          void handle.update()
        },
        { signal },
      )
      handle.frame.addEventListener(
        'reloadComplete',
        () => {
          pending = false
          void handle.update()
        },
        { signal },
      )
      document.addEventListener(
        FRAME_SUBMIT_ERROR,
        (event) => {
          if ((event as CustomEvent).detail !== handle.props.frame) return
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
          disabled={pending}
          aria-busy={pending}
          mix={primaryButton}
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
