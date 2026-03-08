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

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Passwort zurücksetzen – Celebra</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Text style={logoText}>✦ Celebra</Text>
        </Section>
        <Hr style={divider} />
        <Heading style={h1}>Passwort zurücksetzen</Heading>
        <Text style={text}>
          Du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt.
          Klicke auf den Button, um ein neues Passwort zu wählen.
        </Text>
        <Section style={buttonSection}>
          <Button style={button} href={confirmationUrl}>
            Neues Passwort wählen
          </Button>
        </Section>
        <Text style={footer}>
          Falls du kein neues Passwort angefordert hast, kannst du diese E-Mail ignorieren.
          Dein Passwort bleibt unverändert.
        </Text>
        <Hr style={divider} />
        <Text style={brand}>
          <Link href="https://celebra.at" style={brandLink}>celebra.at</Link> · Deine digitale Event-Einladung
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '40px 30px', maxWidth: '480px', margin: '0 auto' }
const logoSection = { textAlign: 'center' as const, marginBottom: '8px' }
const logoText = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#c8922a',
  margin: '0',
}
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
