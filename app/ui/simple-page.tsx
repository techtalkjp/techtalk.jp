import { css, type Handle } from 'remix/component'

import { createI18n, type Locale } from '../i18n/index.ts'
import { paths } from '../paths.ts'
import { getI18n, I18nProvider } from '../i18n/provider.tsx'
import { Document } from './document.tsx'
import { PageShell } from './layout.tsx'
import { PageIntro } from './page-intro.tsx'
import { container, primaryButton, textLink } from './styles.ts'

export function PrivacyPage() {
  return () => (
    <Document
      locale="ja"
      seo={{ title: 'プライバシーポリシー - TechTalk', path: '/privacy' }}
    >
      <I18nProvider value={createI18n('ja')}>
        <PageShell>
          <main>
            <PageIntro title="プライバシーポリシー" />
            <div mix={[container, css({ paddingBottom: '112px' })]}>
              <div
                mix={css({
                  display: 'grid',
                  gap: '20px',
                  maxWidth: '45rem',
                  color: 'var(--text-muted)',
                })}
              >
                <p>
                  当サイトにお送りいただいたお客さまの個人情報およびプライバシーの保護については、内閣府の下に置かれた個人情報保護委員会による「
                  <a
                    href="https://www.ppc.go.jp/personalinfo/legal/guidelines_tsusoku/"
                    target="_blank"
                    rel="noopener"
                    mix={textLink}
                  >
                    個人情報の保護に関する法律についてのガイドライン
                  </a>
                  」（以下、「ガイドライン」と言います）が、現段階における指導的な基準となっています。当サイトの運営会社である株式会社TechTalk（以下、「当社」と言います）は、本ポリシーに記述している事柄とガイドラインを合わせて当社のプライバシーポリシーとします。
                </p>
                <p>
                  お客さまが、このプライバシーポリシーに同意されていることを前提として、サービスを提供しています。また、お客さまへのより良いサービス提供のため、変更・改訂されることがありますが、その点においても同意されたとみなされます。あらかじめご了承ください。
                </p>
              </div>
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
      <main mix={css({ minHeight: '60vh' })}>
        <PageIntro
          title={t('ページが見つかりません')}
          lede={t('お探しのページは移動または削除された可能性があります。')}
        >
          <div mix={css({ marginTop: '40px' })}>
            <a href={paths.home(locale)} mix={primaryButton}>
              {t('トップへ戻る')}
            </a>
          </div>
        </PageIntro>
      </main>
    )
  }
}
