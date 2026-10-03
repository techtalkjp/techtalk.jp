import { css, type Handle } from 'remix/component'

import { createI18n, type Locale } from '../i18n/index.ts'
import { paths } from '../paths.ts'
import { getI18n, I18nProvider } from '../i18n/provider.tsx'
import { Document } from './document.tsx'
import { PageShell } from './layout.tsx'
import { narrowContainer, secondaryButton } from './styles.ts'

const proseLink = css({
  color: 'var(--accent)',
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
})

export function PrivacyPage() {
  return () => (
    <Document
      locale="ja"
      seo={{ title: 'プライバシーポリシー - TechTalk', path: '/privacy' }}
    >
      <I18nProvider value={createI18n('ja')}>
        <PageShell>
          <main
            mix={[
              narrowContainer,
              css({
                position: 'relative',
                zIndex: 10,
                maxWidth: '48rem',
                paddingBlock: '6rem',
              }),
            ]}
          >
            <h1
              mix={css({
                marginBottom: '3rem',
                textAlign: 'center',
                fontSize: '2.25rem',
                lineHeight: 1.25,
                fontWeight: 700,
                color: 'var(--text-strong)',
              })}
            >
              TechTalkプライバシーポリシー
            </h1>
            <div
              mix={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                lineHeight: 1.75,
                color: 'var(--text-body)',
              })}
            >
              <p>
                当サイトにお送りいただいたお客さまの個人情報およびプライバシーの保護については、内閣府の下に置かれた個人情報保護委員会による「
                <a
                  href="https://www.ppc.go.jp/personalinfo/legal/guidelines_tsusoku/"
                  target="_blank"
                  rel="noopener noreferrer"
                  mix={proseLink}
                >
                  個人情報の保護に関する法律についてのガイドライン
                </a>
                」（以下、「ガイドライン」と言います）が、現段階における指導的な基準となっています。当サイトの運営会社である株式会社
                TechTalk（以下、「当社」と言います）は、本ポリシーに記述している事柄とガイドラインを合わせて当社のプライバシーポリシーとします。
              </p>
              <p>
                お客さまが、このプライバシーポリシーに同意されていることを前提として、サービスを提供しています。また、お客さまへのより良いサービス提供のため、変更・改訂されることがありますが、その点においても同意されたとみなされます。あらかじめご了承ください。
              </p>
            </div>
            <div mix={css({ marginTop: '4rem', textAlign: 'center' })}>
              <a
                href={paths.home('ja')}
                mix={[
                  secondaryButton,
                  css({ borderRadius: '0.75rem', padding: '0.5rem 1rem' }),
                ]}
              >
                トップに戻る
              </a>
            </div>
          </main>
        </PageShell>
      </I18nProvider>
    </Document>
  )
}

export function NotFoundPage(handle: Handle<{ locale: Locale }>) {
  return () => {
    let i18n = createI18n(handle.props.locale)
    return (
      <Document
        locale={i18n.locale}
        seo={{ title: '404 Not Found - TechTalk' }}
      >
        <I18nProvider value={i18n}>
          <PageShell>
            <NotFoundContent />
          </PageShell>
        </I18nProvider>
      </Document>
    )
  }
}

function NotFoundContent(handle: Handle) {
  return () => {
    let { t, locale } = getI18n(handle)
    return (
      <main
        mix={[
          narrowContainer,
          css({
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            minHeight: '70vh',
            textAlign: 'center',
          }),
        ]}
      >
        <p
          mix={css({
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'var(--accent)',
          })}
        >
          404
        </p>
        <h1
          mix={css({
            fontSize: '2.25rem',
            fontWeight: 700,
            color: 'var(--text-strong)',
          })}
        >
          {t('ページが見つかりません')}
        </h1>
        <p mix={css({ color: 'var(--text-muted)' })}>
          {t('お探しのページは移動または削除された可能性があります。')}
        </p>
        <a href={paths.home(locale)} mix={secondaryButton}>
          {t('トップへ戻る')}
        </a>
      </main>
    )
  }
}
