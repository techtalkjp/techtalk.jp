import { clientEntry, type Handle } from 'remix/component'

import { primaryButton } from '../ui/styles.ts'

export interface SubmitButtonProps {
  label: string
  pendingLabel: string
}

/** 送信中は押せなくする。所属する Frame の再読み込みイベントで状態を切り替える */
export const SubmitButton = clientEntry(
  '/js/islands.js#SubmitButton',
  function SubmitButton(handle: Handle<SubmitButtonProps>) {
    let pending = false

    // サーバー描画時は Frame のイベントが来ないので、ブラウザでだけ購読する
    // （workerd では handle.signal を addEventListener に渡せない）
    if (typeof document !== 'undefined') {
      handle.frame.addEventListener(
        'reloadStart',
        () => {
          pending = true
          void handle.update()
        },
        { signal: handle.signal },
      )
      handle.frame.addEventListener(
        'reloadComplete',
        () => {
          pending = false
          void handle.update()
        },
        { signal: handle.signal },
      )
    }

    return () => (
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        mix={primaryButton}
      >
        {pending ? handle.props.pendingLabel : handle.props.label}
      </button>
    )
  },
)
