import { clientEntry, ref, type Handle } from 'remix/component'

import {
  contactFieldNames,
  parseContactForm,
  type ContactErrors,
  type ContactFieldName,
  type ContactMessages,
} from '../contact/schema.ts'

export interface ContactFormValidationProps {
  messages: ContactMessages
}

type Control = HTMLInputElement | HTMLTextAreaElement

/**
 * 問い合わせフォームを、サーバーと同じスキーマでブラウザでも検証する。
 * 動きは Conform の既定にならう。書き換えた欄から離れたら検証し、エラーを出した欄は入力のたびに
 * 検証し直す。送信時は全部の欄を検証し、エラーがあれば送信を止めて最初のエラーの欄にフォーカスする。
 * JS が動いたら novalidate を付けてブラウザ標準の吹き出しを止める。JS なしでは従来どおり
 * ブラウザ標準の検証とサーバーの検証で動く。
 * エラーの表示先は、サーバーが欄ごとに描いておく `<p id="{欄の id}-error">`（エラーがなければ hidden）
 */
export const ContactFormValidation = clientEntry(
  '/js/entry.js#ContactFormValidation',
  function ContactFormValidation(handle: Handle<ContactFormValidationProps>) {
    // 書き換えた欄と、エラーを出す対象になった欄
    let dirty = new Set<ContactFieldName>()
    let shown = new Set<ContactFieldName>()

    function fieldName(target: EventTarget | null): ContactFieldName | null {
      let name = (target as Control | null)?.name
      return (contactFieldNames as readonly string[]).includes(name ?? '')
        ? (name as ContactFieldName)
        : null
    }

    function validate(form: HTMLFormElement): ContactErrors {
      let result = parseContactForm(new FormData(form), handle.props.messages)
      return result.success ? {} : result.errors
    }

    function render(
      form: HTMLFormElement,
      names: Iterable<ContactFieldName>,
      errors: ContactErrors,
    ) {
      for (let name of names) {
        let control = form.elements.namedItem(name) as Control | null
        let message = shown.has(name) ? errors[name] : undefined
        let output = control && document.getElementById(`${control.id}-error`)
        if (!control || !output) continue
        if (message) {
          control.setAttribute('aria-invalid', 'true')
          control.setAttribute('aria-describedby', output.id)
        } else {
          control.removeAttribute('aria-invalid')
          control.removeAttribute('aria-describedby')
        }
        output.textContent = message ?? ''
        output.hidden = !message
      }
    }

    function attach(form: HTMLFormElement, signal: AbortSignal) {
      form.noValidate = true
      // サーバーが返したエラーは、直したらすぐ消えるように検証の対象にしておく
      for (let name of contactFieldNames) {
        let control = form.elements.namedItem(name) as Control | null
        if (control?.getAttribute('aria-invalid') === 'true') shown.add(name)
      }

      let onEdit = (event: Event) => {
        let name = fieldName(event.target)
        if (!name) return
        dirty.add(name)
        // チェックボックスは離れるのを待たずに、切り替えたときに検証する
        if ((event.target as Control).type === 'checkbox') shown.add(name)
        if (shown.has(name)) render(form, [name], validate(form))
      }
      form.addEventListener('input', onEdit, { signal })
      form.addEventListener('change', onEdit, { signal })

      // 欄を通り過ぎただけではエラーを出さない
      form.addEventListener(
        'focusout',
        (event) => {
          let name = fieldName(event.target)
          if (!name || !dirty.has(name)) return
          shown.add(name)
          render(form, [name], validate(form))
        },
        { signal },
      )

      // 送信ボタンや client/entry.ts の submit より先に動くよう、capture で受ける。
      // ここで止めると Remix の送信（Navigation API の navigate）も起きない
      form.addEventListener(
        'submit',
        (event) => {
          let errors = validate(form)
          for (let name of contactFieldNames) shown.add(name)
          render(form, contactFieldNames, errors)
          let first = contactFieldNames.find((name) => errors[name])
          if (!first) return
          event.preventDefault()
          ;(form.elements.namedItem(first) as Control | null)?.focus()
        },
        { signal, capture: true },
      )
    }

    return () => (
      <span
        hidden
        mix={ref((node, signal) => {
          let form = node.closest('form')
          if (form) attach(form, signal)
        })}
      />
    )
  },
)
