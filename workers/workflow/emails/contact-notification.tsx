import type { Handle } from 'remix/component'

import type { ContactFormData } from '../types.ts'
import { EmailLayout, styles } from './layout.tsx'

export function ContactNotificationEmail(
  handle: Handle<{ data: ContactFormData; classificationNote?: string }>,
) {
  return () => {
    let { data, classificationNote } = handle.props
    return (
      <EmailLayout lang="ja" preview={`新しいお問い合わせ: ${data.name}様`}>
        <h1 style={styles.h1}>新しいお問い合わせ</h1>
        <hr style={styles.hr} />

        <p style={styles.label}>名前</p>
        <p style={styles.value}>{data.name}</p>

        <p style={styles.label}>メールアドレス</p>
        <p style={styles.value}>{data.email}</p>

        {data.company ? (
          <>
            <p style={styles.label}>会社名</p>
            <p style={styles.value}>{data.company}</p>
          </>
        ) : null}

        <hr style={styles.hr} />

        <p style={styles.label}>メッセージ</p>
        <p style={styles.message}>{data.message}</p>

        {classificationNote ? (
          <>
            <p style={styles.label}>自動判定</p>
            <p style={styles.message}>{classificationNote}</p>
          </>
        ) : null}

        <hr style={styles.hr} />

        <p style={styles.footer}>
          言語: {data.locale} | プライバシーポリシー:{' '}
          {data.privacyPolicy ? '同意済み' : '未同意'}
        </p>
      </EmailLayout>
    )
  }
}
