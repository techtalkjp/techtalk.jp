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

interface ContactNotificationEmailProps {
  data: ContactFormData
}

export const ContactNotificationEmail = ({
  data,
}: ContactNotificationEmailProps) => (
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

const main: React.CSSProperties = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 48px 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const h1: React.CSSProperties = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
}

const hr: React.CSSProperties = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const label: React.CSSProperties = {
  color: '#666',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  margin: '16px 0 4px',
}

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

const footer: React.CSSProperties = {
  color: '#999',
  fontSize: '12px',
}
