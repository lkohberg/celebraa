/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Hr, Img,
  Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'celebra.at'
const SITE_URL = 'https://celebraa.lovable.app'

const WelcomeEmail = () => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Willkommen bei {SITE_NAME} – erstelle jetzt dein erstes Event!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img src="https://nycaurobmnnrskwlzgym.supabase.co/storage/v1/object/public/email-assets/celebra-logo.png" width="70" height="70" alt="Celebra" style={logoImg} />
        </Section>
        <Hr style={divider} />
        <Heading style={h1}>Willkommen bei {SITE_NAME}! 🎉</Heading>
        <Text style={text}>
          Schön, dass du dabei bist! Mit Celebra erstellst du in wenigen Minuten 
          professionelle digitale Event-Einladungen – inklusive Rückmeldungs-Formular, 
          Dashboard und Excel-Export.
        </Text>
        <Heading as="h2" style={h2}>So geht's los:</Heading>
        <Text style={text}>
          1. <strong>Design wählen</strong> – Wähle aus unseren Templates für Hochzeiten, Geburtstage oder Firmen-Events.{'\n'}
          2. <strong>Anpassen</strong> – Texte, Farben und Blöcke konfigurieren.{'\n'}
          3. <strong>Teilen</strong> – Sende deinen Gästen den Link oder QR-Code.
        </Text>
        <Section style={buttonSection}>
          <Button style={button} href={`${SITE_URL}/templates`}>
            Erstes Event erstellen
          </Button>
        </Section>
        <Text style={footer}>
          Bei Fragen erreichst du uns jederzeit unter celebra.at@gmail.com.
        </Text>
        <Hr style={divider} />
        <Text style={brand}>
          <Link href={SITE_URL} style={brandLink}>{SITE_NAME}</Link> · Deine digitale Event-Einladung
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WelcomeEmail,
  subject: 'Willkommen bei celebra.at – erstelle dein erstes Event!',
  displayName: 'Welcome Email',
  previewData: {},
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '40px 30px', maxWidth: '480px', margin: '0 auto' }
const logoSection = { textAlign: 'center' as const, marginBottom: '8px' }
const logoImg = { margin: '0 auto', borderRadius: '50%' }
const divider = { borderColor: '#e8e0d4', margin: '20px 0' }
const h1 = { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 'bold' as const, color: '#1f2937', margin: '0 0 16px' }
const h2 = { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px', fontWeight: '600' as const, color: '#1f2937', margin: '0 0 12px' }
const text = { fontSize: '15px', color: '#6b7280', lineHeight: '1.6', margin: '0 0 20px' }
const buttonSection = { textAlign: 'center' as const, margin: '0 0 24px' }
const button = { backgroundColor: '#c8922a', color: '#faf7f2', fontSize: '15px', fontWeight: '600' as const, borderRadius: '12px', padding: '14px 28px', textDecoration: 'none' }
const footer = { fontSize: '13px', color: '#9ca3af', margin: '0 0 0' }
const brand = { fontSize: '12px', color: '#9ca3af', textAlign: 'center' as const, margin: '0' }
const brandLink = { color: '#c8922a', textDecoration: 'none' }
