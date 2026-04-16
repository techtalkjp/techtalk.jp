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

interface ContactReplyEmailProps {
  data: ContactFormData
}

export const ContactReplyEmail = ({ data }: ContactReplyEmailProps) => {
  const isJapanese = data.locale === 'ja'

  return (
    <Html>
      <Head />
      <Preview>
        {isJapanese
          ? 'お問い合わせありがとうございます - TechTalk'
          : 'Thank you for contacting us - TechTalk'}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {isJapanese
              ? 'お問い合わせありがとうございます'
              : 'Thank You for Reaching Out'}
          </Heading>

          <Text style={paragraph}>
            {isJapanese ? (
              <>
                {data.name} 様<br />
                <br />
                この度はお問い合わせいただき、誠にありがとうございます。
                <br />
                内容を確認の上、担当者より改めてご連絡させていただきます。
              </>
            ) : (
              <>
                Dear {data.name},<br />
                <br />
                Thank you for contacting us. We have received your message and
                will get back to you shortly.
              </>
            )}
          </Text>

          <Hr style={hr} />

          <Section>
            <Text style={label}>
              {isJapanese ? 'お問い合わせ内容' : 'Your Message'}
            </Text>
            <Text style={messageStyle}>{data.message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            {isJapanese
              ? 'このメールはお問い合わせの確認として自動送信されています。'
              : 'This email was sent automatically to confirm your inquiry.'}
          </Text>
          <Text style={footer}>TechTalk Inc.</Text>
        </Container>
      </Body>
    </Html>
  )
}

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

const paragraph: React.CSSProperties = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
}

const messageStyle: React.CSSProperties = {
  color: '#555',
  fontSize: '14px',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap',
  backgroundColor: '#f9f9f9',
  padding: '16px',
  borderRadius: '4px',
  margin: '0',
}

const footer: React.CSSProperties = {
  color: '#999',
  fontSize: '12px',
  margin: '4px 0',
}
