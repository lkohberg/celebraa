/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Hr, Img,
  Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'celebra.at'
const SITE_URL = 'https://celebraa.lovable.app'

interface RenewalReminderProps {
  eventTitle?: string
  daysLeft?: number
}

const RenewalReminderEmail = ({ eventTitle = 'Dein Event', daysLeft = 30 }: RenewalReminderProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Dein Event "{eventTitle}" läuft in {daysLeft} Tagen ab – jetzt verlängern</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img src="https://nycaurobmnnrskwlzgym.supabase.co/storage/v1/object/public/email-assets/celebra-logo.png" width="70" height="70" alt="Celebra" style={logoImg} />
        </Section>
        <Hr style={divider} />
        <Heading style={h1}>Dein Event läuft bald ab ⏰</Heading>
        <Text style={text}>
          Die Laufzeit deines Events <strong>"{eventTitle}"</strong> endet in <strong>{daysLeft} Tagen</strong>.
        </Text>
        <Text style={text}>
          Verlängere jetzt um weitere 6 Monate für nur <strong>€10</strong>, damit deine 
          Gäste weiterhin auf die Event-Seite zugreifen können.
        </Text>
        <Section style={buttonSection}>
          <Button style={button} href={`${SITE_URL}/dashboard`}>
            Jetzt im Dashboard verlängern
          </Button>
        </Section>
        <Text style={footer}>
          Du erhältst diese E-Mail, weil du ein Event auf {SITE_NAME} erstellt hast.
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
  component: RenewalReminderEmail,
  subject: (data: Record<string, any>) => `Dein Event "${data.eventTitle || 'Event'}" läuft bald ab – jetzt verlängern`,
  displayName: 'Renewal Reminder',
  previewData: { eventTitle: 'Hochzeit Anna & Max', daysLeft: 30 },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '40px 30px', maxWidth: '480px', margin: '0 auto' }
const logoSection = { textAlign: 'center' as const, marginBottom: '8px' }
const logoImg = { margin: '0 auto', borderRadius: '50%' }
const divider = { borderColor: '#e8e0d4', margin: '20px 0' }
const h1 = { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 'bold' as const, color: '#1f2937', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#6b7280', lineHeight: '1.6', margin: '0 0 20px' }
const buttonSection = { textAlign: 'center' as const, margin: '0 0 24px' }
const button = { backgroundColor: '#c8922a', color: '#faf7f2', fontSize: '15px', fontWeight: '600' as const, borderRadius: '12px', padding: '14px 28px', textDecoration: 'none' }
const footer = { fontSize: '13px', color: '#9ca3af', margin: '0 0 0' }
const brand = { fontSize: '12px', color: '#9ca3af', textAlign: 'center' as const, margin: '0' }
const brandLink = { color: '#c8922a', textDecoration: 'none' }
