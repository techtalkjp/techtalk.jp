import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import { PageIntro } from '../page-intro.tsx'
import { phrase, primaryButton, secondaryButton } from '../styles.ts'

export function HeroSection(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <PageIntro
        title={
          <>
            <span mix={phrase}>{t('技術の話から、')}</span>
            <span mix={phrase}>{t('新しい事業をつくる。')}</span>
          </>
        }
        lede={t(
          '事業の話を、技術の言葉に直さずにそのまま聞かせてください。技術の話は、経営と開発の両方を経験した代表がします。何ができるか、どんな価値をつくれるか、事業として立ち上げられるかを構想の段階から一緒に考え、動く最初の版まで自分で作ります。',
        )}
      >
        <div
          mix={css({
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '40px',
          })}
        >
          <a href="#contact" mix={primaryButton}>
            {t('相談する')}
          </a>
          <a href="#approach" mix={secondaryButton}>
            {t('進め方を見る')}
          </a>
        </div>
        <p
          mix={css({
            marginTop: '24px',
            fontSize: 'var(--t-14)',
            color: 'var(--text-subtle)',
          })}
        >
          {t(
            'まだ固まっていない話でかまいません。最初の打ち合わせから、代表の溝口が出ます。',
          )}
        </p>
      </PageIntro>
    )
  }
}
