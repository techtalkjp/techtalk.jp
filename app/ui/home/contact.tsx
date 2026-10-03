import { css, Frame, type Handle } from 'remix/component'

import type {
  ContactErrors,
  ContactFieldName,
  ContactValues,
} from '../../contact/schema.ts'
import { getI18n } from '../../i18n/provider.tsx'
import { SubmitButton } from '../../islands/submit-button.tsx'
import { paths } from '../../paths.ts'
import { fadeUpOnLoad, narrowContainer, reveal } from '../styles.ts'

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'invalid'; values: ContactValues; errors: ContactErrors }
  | { status: 'failed'; values: ContactValues }
  | { status: 'sent' }

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
      <section
        id="contact"
        mix={css({
          borderTop: '1px solid var(--border)',
          paddingBlock: '6rem',
        })}
      >
        <div mix={[narrowContainer, reveal, css({ textAlign: 'center' })]}>
          <h2
            mix={css({
              marginBottom: '1.5rem',
              fontSize: '1.875rem',
              fontWeight: 700,
              color: 'var(--text-strong)',
            })}
          >
            {t('お問い合わせ')}
          </h2>
          <p
            mix={css({
              marginBottom: '3rem',
              lineHeight: 1.625,
              color: 'var(--text-muted)',
            })}
          >
            {t(
              '技術実装、プロジェクト推進、技術顧問など、どのような形でのご相談も受け付けています。',
            )}
            <br />
            {t('抱えている課題と期待する成果をお聞かせください。')}
          </p>

          <div
            mix={css({
              maxWidth: '32rem',
              marginInline: 'auto',
              textAlign: 'left',
            })}
          >
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
      </section>
    )
  }
}

const fieldStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
})

const labelStyle = css({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--text-strong)',
})

const inputStyle = css({
  width: '100%',
  borderRadius: '0.375rem',
  border: '1px solid var(--border-strong)',
  background: 'var(--surface)',
  padding: '0.5rem 0.75rem',
  fontSize: '1rem',
  color: 'var(--text-strong)',
  '&:focus-visible': {
    outline: '2px solid var(--accent)',
    outlineOffset: '1px',
  },
  '&[aria-invalid="true"]': { borderColor: 'var(--danger)' },
})

const errorStyle = css({ fontSize: '0.875rem', color: 'var(--danger)' })

const fields: {
  name: Exclude<ContactFieldName, 'privacyPolicy'>
  label: string
  type?: 'text' | 'email' | 'tel'
  autoComplete: string
  required?: boolean
  maxLength: number
}[] = [
  {
    name: 'name',
    label: 'お名前',
    autoComplete: 'name',
    required: true,
    maxLength: 100,
  },
  {
    name: 'company',
    label: '会社名（任意）',
    autoComplete: 'organization',
    maxLength: 100,
  },
  {
    name: 'phone',
    label: '電話番号（任意）',
    type: 'tel',
    autoComplete: 'tel',
    maxLength: 20,
  },
  {
    name: 'email',
    label: 'メールアドレス',
    type: 'email',
    autoComplete: 'email',
    required: true,
    maxLength: 100,
  },
]

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
              borderRadius: '1rem',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              padding: '2rem',
              textAlign: 'center',
            }),
          ]}
        >
          <p
            mix={css({
              marginBottom: '0.75rem',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text-strong)',
            })}
          >
            {t('お問い合わせありがとうございます')}
          </p>
          <p mix={css({ lineHeight: 1.625, color: 'var(--text-muted)' })}>
            {t('内容を確認のうえ、担当者からご連絡します。')}
          </p>
        </div>
      )
    }

    let values = state.status === 'idle' ? {} : state.values
    let errors: ContactErrors = state.status === 'invalid' ? state.errors : {}
    let id = (name: string) => `contact-${name}`
    let describedBy = (name: ContactFieldName) =>
      errors[name] ? `${id(name)}-error` : undefined

    return (
      <form
        method="post"
        action={paths.contactAction(locale)}
        data-rmx-target={CONTACT_FRAME}
        data-rmx-history="replace"
        data-rmx-reset-scroll="false"
        mix={css({ display: 'flex', flexDirection: 'column', gap: '1rem' })}
      >
        {state.status === 'invalid' ? (
          <p role="alert" mix={errorStyle}>
            {t('入力内容を確認してください')}
          </p>
        ) : null}
        {state.status === 'failed' ? (
          <p
            role="alert"
            mix={[
              errorStyle,
              css({
                borderRadius: '0.375rem',
                background: 'var(--danger-surface)',
                padding: '0.75rem 1rem',
              }),
            ]}
          >
            {t('送信できませんでした。時間をおいて再度お試しください')}
          </p>
        ) : null}

        {fields.map((field) => (
          <div key={field.name} mix={fieldStyle}>
            <label for={id(field.name)} mix={labelStyle}>
              {t(field.label)}
            </label>
            <input
              id={id(field.name)}
              name={field.name}
              // 型の上では input の type ごとに props が分かれるので、テキスト系として渡す
              type={(field.type ?? 'text') as 'text'}
              autoComplete={field.autoComplete}
              required={field.required}
              maxLength={field.maxLength}
              value={values[field.name] ?? ''}
              aria-invalid={errors[field.name] ? 'true' : undefined}
              aria-describedby={describedBy(field.name)}
              mix={inputStyle}
            />
            {errors[field.name] ? (
              <p id={`${id(field.name)}-error`} mix={errorStyle}>
                {errors[field.name]}
              </p>
            ) : null}
          </div>
        ))}

        <div mix={fieldStyle}>
          <label for={id('message')} mix={labelStyle}>
            {t('メッセージ')}
          </label>
          <textarea
            id={id('message')}
            name="message"
            required
            maxLength={10000}
            rows={6}
            aria-invalid={errors.message ? 'true' : undefined}
            aria-describedby={describedBy('message')}
            value={values.message ?? ''}
            mix={[inputStyle, css({ resize: 'vertical' })]}
          />
          {errors.message ? (
            <p id={`${id('message')}-error`} mix={errorStyle}>
              {errors.message}
            </p>
          ) : null}
        </div>

        {/* honeypot: 人には見えない欄。ボットが埋めたら送信したことにして捨てる。
            画面外に置くだけだと自動入力で埋まることがあるので display: none にする */}
        <div hidden mix={css({ display: 'none' })}>
          <input
            type="text"
            name="companyPhone"
            tabIndex={-1}
            autoComplete="off"
            value=""
          />
        </div>

        <div mix={fieldStyle}>
          <label
            mix={css({
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
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
                width: '1rem',
                height: '1rem',
                accentColor: 'var(--accent)',
              })}
            />
            <span>
              {locale === 'ja' ? null : 'I agree to the '}
              <a
                href={paths.privacy()}
                target="_blank"
                rel="noopener"
                mix={css({
                  color: 'var(--accent)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                })}
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

        <div
          mix={css({
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '0.5rem',
          })}
        >
          <SubmitButton
            label={t('送信する')}
            pendingLabel={t('送信中…')}
            errorLabel={t(
              '送信できませんでした。時間をおいて再度お試しください',
            )}
            frame={CONTACT_FRAME}
          />
        </div>
      </form>
    )
  }
}
