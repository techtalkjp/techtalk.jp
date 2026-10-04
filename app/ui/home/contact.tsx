import { css, Frame, type Handle } from 'remix/component'

import {
  contactLimits,
  type ContactErrors,
  type ContactFieldName,
} from '../../contact/schema.ts'
import type { ContactSubmitResult } from '../../contact/submit.ts'
import { getI18n } from '../../i18n/provider.tsx'
import { SubmitButton } from '../../islands/submit-button.tsx'
import { paths } from '../../paths.ts'
import { fadeUpOnLoad, phrase, textLink } from '../styles.ts'
import { Section, sectionHeading } from '../section.tsx'

export type ContactFormState = ContactSubmitResult | { status: 'idle' }

export const CONTACT_FRAME = 'contact'

/**
 * トップの問い合わせセクション。フォームは Frame で埋め込み、送信するとフォーム部分だけが
 * サーバーから描き直される。JS なしで送信してエラーになった場合だけ、form を直接描く。
 */
export function ContactSection(
  handle: Handle<{ fallbackState?: ContactFormState; sent?: boolean }>,
) {
  return () => {
    let { t, locale } = getI18n(handle)
    let { fallbackState, sent } = handle.props

    return (
      <Section id="contact" name={t('お問い合わせ')}>
        <div
          mix={css({
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '48px',
            '@media (min-width: 960px)': {
              gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)',
              gap: '64px',
            },
          })}
        >
          <div>
            <h2 mix={sectionHeading}>
              <span mix={phrase}>{t('事業の話を、')}</span>
              <span mix={phrase}>{t('そのまま聞かせてください。')}</span>
            </h2>
            <p mix={noteStyle}>
              {t(
                '新しい事業の構想、技術でできるかどうか、進め方など、どんなご相談でもかまいません。',
              )}
            </p>
            <p mix={noteStyle}>
              {t('いただいた内容は代表の溝口が直接読み、返信します。')}
            </p>
          </div>
          <div>
            {fallbackState ? (
              <ContactForm state={fallbackState} />
            ) : (
              <Frame
                name={CONTACT_FRAME}
                src={paths.contactForm(locale) + (sent ? '?sent=1' : '')}
              />
            )}
          </div>
        </div>
      </Section>
    )
  }
}

// 続く段落の間隔は同じクラスの中で決める。別の css() で上書きすると、
// どちらが勝つかがページ内で先に使われた順で変わる
const noteStyle = css({
  marginTop: '20px',
  maxWidth: '30em',
  color: 'var(--text-muted)',
  '& + &': { marginTop: '12px' },
})

const fieldStyle = css({ display: 'grid', gap: '8px' })

const labelStyle = css({
  fontSize: 'var(--t-14)',
  fontWeight: 700,
  lineHeight: 1.5,
})

const optionalStyle = css({
  marginLeft: '8px',
  fontWeight: 400,
  color: 'var(--text-subtle)',
})

const inputStyle = css({
  width: '100%',
  padding: '10px 12px',
  border: 0,
  borderRadius: 'var(--r-control)',
  background: 'var(--surface)',
  boxShadow: 'inset 0 0 0 1px var(--border-strong)',
  fontSize: 'var(--t-16)',
  color: 'var(--text-strong)',
  transition: 'box-shadow 150ms ease-out',
  '&:focus-visible': {
    outline: 'none',
    boxShadow: 'inset 0 0 0 1.5px var(--accent), 0 0 0 4px var(--accent-soft)',
  },
  '&::placeholder': { color: 'var(--text-subtle)' },
  '&[aria-invalid="true"]': {
    boxShadow: 'inset 0 0 0 1.5px var(--danger)',
  },
  '&[aria-invalid="true"]:focus-visible': {
    boxShadow: 'inset 0 0 0 1.5px var(--danger), 0 0 0 4px var(--accent-soft)',
  },
  // 強制カラーモードでは box-shadow が消えるので、枠とフォーカスを実線で描く
  '@media (forced-colors: active)': {
    border: '1px solid CanvasText',
    '&:focus-visible': { outline: '2px solid Highlight' },
  },
})

const errorStyle = css({ fontSize: 'var(--t-14)', color: 'var(--danger)' })

interface Field {
  name: 'name' | 'company' | 'email'
  label: string
  type?: 'text' | 'email'
  autoComplete: string
  required?: boolean
}

const fields: Record<Field['name'], Field> = {
  name: { name: 'name', label: 'お名前', autoComplete: 'name', required: true },
  company: { name: 'company', label: '会社名', autoComplete: 'organization' },
  email: {
    name: 'email',
    label: 'メールアドレス',
    type: 'email',
    autoComplete: 'email',
    required: true,
  },
}

/** 問い合わせフォーム本体（Frame の中身） */
export function ContactForm(handle: Handle<{ state: ContactFormState }>) {
  return () => {
    let { t, locale } = getI18n(handle)
    let { state } = handle.props

    if (state.status === 'sent') {
      return (
        <div
          role="status"
          mix={[
            fadeUpOnLoad,
            css({
              padding: '32px',
              borderRadius: 'var(--r-image)',
              background: 'var(--surface)',
              boxShadow: 'inset 0 0 0 1px var(--border)',
            }),
          ]}
        >
          <p mix={css({ fontSize: 'var(--t-20)', fontWeight: 700 })}>
            {t('お問い合わせありがとうございます')}
          </p>
          <p mix={css({ marginTop: '8px', color: 'var(--text-muted)' })}>
            {t('内容を確認のうえ、溝口からご連絡します。')}
          </p>
        </div>
      )
    }

    let values = state.status === 'idle' ? {} : state.values
    let errors: ContactErrors = state.status === 'invalid' ? state.errors : {}
    let id = (name: string) => `contact-${name}`
    let describedBy = (name: ContactFieldName) =>
      errors[name] ? `${id(name)}-error` : undefined

    let field = (f: Field) => (
      <div key={f.name} data-rmx-key={f.name} mix={fieldStyle}>
        <label for={id(f.name)} mix={labelStyle}>
          {t(f.label)}
          {f.required ? null : <span mix={optionalStyle}>{t('任意')}</span>}
        </label>
        <input
          id={id(f.name)}
          name={f.name}
          // 型の上では input の type ごとに props が分かれるので、テキスト系として渡す
          type={(f.type ?? 'text') as 'text'}
          autoComplete={f.autoComplete}
          required={f.required}
          maxLength={contactLimits[f.name]}
          value={values[f.name] ?? ''}
          aria-invalid={errors[f.name] ? 'true' : undefined}
          aria-describedby={describedBy(f.name)}
          mix={inputStyle}
        />
        {errors[f.name] ? (
          <p id={`${id(f.name)}-error`} mix={errorStyle}>
            {errors[f.name]}
          </p>
        ) : null}
      </div>
    )

    return (
      // JS なし: action を省いているので今のページ URL（クエリ込み）に送られ、トップが受ける。
      // JS あり: data-rmx-src の contact-form に送り、返ってきた断片で Frame だけを差し替える。
      // ページと同じ URL へのナビゲーションなので、履歴とアドレスバーは変わらない
      <form
        method="post"
        data-rmx-target={CONTACT_FRAME}
        data-rmx-src={paths.contactForm(locale)}
        data-rmx-reset-scroll="false"
        mix={css({ display: 'grid', gap: '20px' })}
      >
        {state.status === 'invalid' ? (
          <p role="alert" data-rmx-key="invalid" mix={errorStyle}>
            {t('入力内容を確認してください')}
          </p>
        ) : null}
        {state.status === 'failed' ? (
          <p
            role="alert"
            data-rmx-key="failed"
            mix={[
              errorStyle,
              css({
                padding: '12px 16px',
                borderRadius: 'var(--r-control)',
                background: 'var(--danger-surface)',
              }),
            ]}
          >
            {t('送信できませんでした。時間をおいて再度お試しください')}
          </p>
        ) : null}

        {/* 送信後の差し替えで入力欄の取り違えが起きないよう、並びの要素には data-rmx-key を付ける */}
        <div
          data-rmx-key="who"
          mix={css({
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '20px',
            '@media (min-width: 560px)': {
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            },
          })}
        >
          {field(fields.name)}
          {field(fields.company)}
        </div>
        {field(fields.email)}

        <div data-rmx-key="message" mix={fieldStyle}>
          <label for={id('message')} mix={labelStyle}>
            {t('相談内容')}
          </label>
          <textarea
            id={id('message')}
            name="message"
            required
            maxLength={contactLimits.message}
            rows={6}
            placeholder={t(
              '考えている事業と、いま困っていることを、思いつくままで',
            )}
            aria-invalid={errors.message ? 'true' : undefined}
            aria-describedby={describedBy('message')}
            value={values.message ?? ''}
            mix={[
              inputStyle,
              css({ minHeight: '168px', resize: 'vertical', lineHeight: 1.7 }),
            ]}
          />
          {errors.message ? (
            <p id={`${id('message')}-error`} mix={errorStyle}>
              {errors.message}
            </p>
          ) : null}
        </div>

        {/* honeypot: 人には見えない欄。ボットが埋めたら送信したことにして捨てる。
            画面外に置くだけだと自動入力で埋まることがあるので display: none にする */}
        <div hidden data-rmx-key="companyPhone" mix={css({ display: 'none' })}>
          <input
            type="text"
            name="companyPhone"
            tabIndex={-1}
            autoComplete="off"
            value=""
          />
        </div>

        <div data-rmx-key="privacyPolicy" mix={fieldStyle}>
          <label
            mix={css({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minHeight: '44px',
              fontSize: 'var(--t-14)',
              color: 'var(--text-muted)',
            })}
          >
            <input
              type="checkbox"
              name="privacyPolicy"
              required
              checked={values.privacyPolicy === 'on'}
              aria-invalid={errors.privacyPolicy ? 'true' : undefined}
              aria-describedby={describedBy('privacyPolicy')}
              mix={css({
                flex: 'none',
                width: '18px',
                height: '18px',
                accentColor: 'var(--accent)',
              })}
            />
            <span>
              {locale === 'ja' ? null : 'I agree to the '}
              <a
                href={paths.privacy()}
                target="_blank"
                rel="noopener"
                mix={textLink}
              >
                {t('プライバシーポリシー')}
              </a>
              {locale === 'ja' ? 'に同意する' : null}
            </span>
          </label>
          {errors.privacyPolicy ? (
            <p id={`${id('privacyPolicy')}-error`} mix={errorStyle}>
              {errors.privacyPolicy}
            </p>
          ) : null}
        </div>

        <SubmitButton
          label={t('相談を送る')}
          pendingLabel={t('送信中…')}
          errorLabel={t('送信できませんでした。時間をおいて再度お試しください')}
          frame={CONTACT_FRAME}
        />
      </form>
    )
  }
}
