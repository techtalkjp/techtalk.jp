import { clientEntry, css, ref, type Handle } from 'remix/component'

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
 * 送信中にするのはフォームの submit イベント（ブラウザの入力チェックを通ったとき）、
 * 解くのは所属する Frame の reloadComplete、client/entry.ts の失敗通知、bfcache からの復帰
 */
export const SubmitButton = clientEntry(
  '/js/entry.js#SubmitButton',
  function SubmitButton(handle: Handle<SubmitButtonProps>) {
    let pending = false
    let failed = false

    // フォームの submit（ブラウザの入力チェックを通って送信が決まったとき）で送信中にする。
    // その場で disabled にすると送信が止まることがあるので、次のタスクで切り替える。
    // Navigation API がなく通常の POST になる場合も、二度押しはこれで防ぐ
    // 完了やエラーが先に届いたら、遅れて動くタイマーは止める
    let timer: ReturnType<typeof setTimeout> | undefined
    function onSubmit() {
      failed = false
      clearTimeout(timer)
      timer = setTimeout(() => {
        pending = true
        void handle.update()
      }, 0)
    }
    function settle(next: { failed: boolean }) {
      clearTimeout(timer)
      pending = false
      failed = next.failed
      void handle.update()
    }

    // サーバー描画時は購読しない（workerd では handle.signal を addEventListener に渡せない）
    if (typeof document !== 'undefined') {
      let { signal } = handle
      handle.frame.addEventListener(
        'reloadComplete',
        () => settle({ failed }),
        { signal },
      )
      // 通常の POST で離れたページに「戻る」で戻ると、送信中のまま残るので解く
      window.addEventListener(
        'pageshow',
        (event) => {
          if (event.persisted) settle({ failed: false })
        },
        { signal },
      )
      document.addEventListener(
        FRAME_SUBMIT_ERROR,
        (event) => {
          if ((event as CustomEvent).detail !== handle.props.frame) return
          settle({ failed: true })
        },
        { signal },
      )
    }

    return () => (
      <div mix={css({ display: 'grid', justifyItems: 'start', gap: '12px' })}>
        <button
          type="submit"
          mix={[
            primaryButton,
            ref((node, signal) => {
              ;(node as HTMLButtonElement).form?.addEventListener(
                'submit',
                onSubmit,
                { signal },
              )
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
            mix={css({ fontSize: 'var(--t-14)', color: 'var(--danger)' })}
          >
            {handle.props.errorLabel}
          </p>
        ) : null}
      </div>
    )
  },
)
