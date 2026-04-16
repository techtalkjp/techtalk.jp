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

export const contactReplySubject = (locale: string) =>
  locale === 'ja'
    ? 'お問い合わせありがとうございます - TechTalk'
    : 'Thank you for contacting us - TechTalk'

export const ContactReplyEmail = ({ data }: { data: ContactFormData }) => {
  const isJapanese = data.locale === 'ja'

  return (
    <Html>
      <Head />
      <Preview>{contactReplySubject(data.locale)}</Preview>
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
          <Text style={{ ...footer, margin: '4px 0' }}>TechTalk Inc.</Text>
        </Container>
      </Body>
    </Html>
  )
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
