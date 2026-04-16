import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { ContactFormData } from '../types'
import { container, footer, h1, hr, label, main } from './styles'

export const ContactNotificationEmail = ({
  data,
}: {
  data: ContactFormData
}) => (
  <Html>
    <Head />
    <Preview>新しいお問い合わせ: {data.name}様</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>新しいお問い合わせ</Heading>
        <Hr style={hr} />

        <Section>
          <Text style={label}>名前</Text>
          <Text style={value}>{data.name}</Text>

          <Text style={label}>メールアドレス</Text>
          <Text style={value}>{data.email}</Text>

          {data.company && (
            <>
              <Text style={label}>会社名</Text>
              <Text style={value}>{data.company}</Text>
            </>
          )}

          {data.phone && (
            <>
              <Text style={label}>電話番号</Text>
              <Text style={value}>{data.phone}</Text>
            </>
          )}
        </Section>

        <Hr style={hr} />

        <Section>
          <Text style={label}>メッセージ</Text>
          <Text style={messageStyle}>{data.message}</Text>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          言語: {data.locale} | プライバシーポリシー:{' '}
          {data.privacyPolicy ? '同意済み' : '未同意'}
        </Text>
      </Container>
    </Body>
  </Html>
)

const value: React.CSSProperties = {
  color: '#333',
  fontSize: '16px',
  margin: '0 0 8px',
}

const messageStyle: React.CSSProperties = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap',
  margin: '0',
}
