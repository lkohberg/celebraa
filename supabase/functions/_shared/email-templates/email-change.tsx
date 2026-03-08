/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>E-Mail-Änderung bestätigen – Celebra</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img src="https://nycaurobmnnrskwlzgym.supabase.co/storage/v1/object/public/email-assets/celebra-logo.png" width="80" height="80" alt="Celebra" style={logoImg} />
        </Section>
        <Hr style={divider} />
        <Heading style={h1}>E-Mail-Adresse ändern</Heading>
        <Text style={text}>
          Du hast angefragt, deine E-Mail-Adresse von{' '}
          <Link href={`mailto:${email}`} style={link}>{email}</Link>{' '}
          auf{' '}
          <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>{' '}
          zu ändern.
        </Text>
        <Section style={buttonSection}>
          <Button style={button} href={confirmationUrl}>
            Änderung bestätigen
          </Button>
        </Section>
        <Text style={footer}>
          Falls du diese Änderung nicht angefordert hast, sichere bitte sofort dein Konto.
        </Text>
        <Hr style={divider} />
        <Text style={brand}>
          <Link href="https://celebra.at" style={brandLink}>celebra.at</Link> · Deine digitale Event-Einladung
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '40px 30px', maxWidth: '480px', margin: '0 auto' }
const logoSection = { textAlign: 'center' as const, marginBottom: '8px' }
const logoImg = { margin: '0 auto', borderRadius: '50%' }
const divider = { borderColor: '#e8e0d4', margin: '20px 0' }
const h1 = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#1f2937',
  margin: '0 0 16px',
}
const text = {
  fontSize: '15px',
  color: '#6b7280',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
const link = { color: '#c8922a', textDecoration: 'underline' }
const buttonSection = { textAlign: 'center' as const, margin: '0 0 24px' }
const button = {
  backgroundColor: '#c8922a',
  color: '#faf7f2',
  fontSize: '15px',
  fontWeight: '600' as const,
  borderRadius: '12px',
  padding: '14px 28px',
  textDecoration: 'none',
}
const footer = { fontSize: '13px', color: '#9ca3af', margin: '0 0 0' }
const brand = { fontSize: '12px', color: '#9ca3af', textAlign: 'center' as const, margin: '0' }
const brandLink = { color: '#c8922a', textDecoration: 'none' }
